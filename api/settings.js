import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST', 'Access-Control-Allow-Headers': 'Content-Type' } });
  }

  // Crea la tabella se non esiste
  await sql`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  // GET — pubblico (legge le impostazioni per il sito)
  if (req.method === 'GET') {
    const rows = await sql`SELECT key, value FROM settings`;
    const result = {};
    rows.forEach(r => result[r.key] = r.value);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }

  // POST — richiede token admin
  if (req.method === 'POST') {
    const url = new URL(req.url);
    const token = url.searchParams.get('token');
    if (token !== process.env.ADMIN_TOKEN) {
      return new Response(JSON.stringify({ error: 'Non autorizzato' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    let body;
    try { body = await req.json(); } catch {
      return new Response(JSON.stringify({ error: 'JSON non valido' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const { key, value } = body;
    if (!key) return new Response(JSON.stringify({ error: 'Chiave mancante' }), { status: 400, headers: { 'Content-Type': 'application/json' } });

    await sql`
      INSERT INTO settings (key, value, updated_at)
      VALUES (${key}, ${value ?? ''}, NOW())
      ON CONFLICT (key) DO UPDATE SET value = ${value ?? ''}, updated_at = NOW()
    `;

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }

  return new Response('Method not allowed', { status: 405 });
}
