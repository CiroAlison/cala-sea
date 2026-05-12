import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);
export const config = { runtime: 'edge' };

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};
const JSON_HEADERS = { 'Content-Type': 'application/json', ...CORS };

async function isAdmin(token) {
  if (!token) return false;
  if (token === process.env.ADMIN_TOKEN) return true;
  try {
    const rows = await sql`SELECT value FROM settings WHERE key = 'admin_tokens_json'`;
    if (rows.length && rows[0].value) {
      const list = JSON.parse(rows[0].value);
      return Array.isArray(list) && list.some(a => a.token === token);
    }
  } catch(e) {}
  return false;
}

export default async function handler(req) {
  if (req.method === 'OPTIONS') return new Response(null, { status: 200, headers: CORS });

  await sql`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  /* ── GET pubblico ── */
  if (req.method === 'GET') {
    const rows = await sql`SELECT key, value FROM settings`;
    const result = {};
    rows.forEach(r => result[r.key] = r.value);
    return new Response(JSON.stringify(result), { status: 200, headers: JSON_HEADERS });
  }

  /* ── POST richiede token admin ── */
  if (req.method === 'POST') {
    const url   = new URL(req.url);
    const token = url.searchParams.get('token');
    if (!(await isAdmin(token))) {
      return new Response(JSON.stringify({ error: 'Non autorizzato' }), { status: 401, headers: JSON_HEADERS });
    }

    let body;
    try { body = await req.json(); } catch {
      return new Response(JSON.stringify({ error: 'JSON non valido' }), { status: 400, headers: JSON_HEADERS });
    }

    const { key, value } = body;
    if (!key) return new Response(JSON.stringify({ error: 'Chiave mancante' }), { status: 400, headers: JSON_HEADERS });

    await sql`
      INSERT INTO settings (key, value, updated_at)
      VALUES (${key}, ${value ?? ''}, NOW())
      ON CONFLICT (key) DO UPDATE SET value = ${value ?? ''}, updated_at = NOW()
    `;

    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: JSON_HEADERS });
  }

  return new Response('Method not allowed', { status: 405 });
}
