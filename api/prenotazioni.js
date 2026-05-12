import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);
export const config = { runtime: 'edge' };

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET,OPTIONS',
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

  const url   = new URL(req.url);
  const token = url.searchParams.get('token');

  if (!(await isAdmin(token))) {
    return new Response(JSON.stringify({ error: 'Non autorizzato' }), { status: 401, headers: JSON_HEADERS });
  }

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS prenotazioni (
        id SERIAL PRIMARY KEY,
        nome TEXT NOT NULL,
        telefono TEXT NOT NULL,
        data DATE,
        persone TEXT,
        tipo TEXT,
        note TEXT,
        creato_il TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    await sql`ALTER TABLE prenotazioni ADD COLUMN IF NOT EXISTS stato TEXT DEFAULT 'nuova'`;

    const rows = await sql`
      SELECT id, nome, telefono, data, persone, tipo, note,
             COALESCE(stato, 'nuova') AS stato, creato_il
      FROM prenotazioni
      ORDER BY creato_il DESC
      LIMIT 200
    `;

    return new Response(JSON.stringify(rows), { status: 200, headers: JSON_HEADERS });
  } catch (err) {
    console.error('DB error:', err);
    return new Response(JSON.stringify({ error: 'Errore database' }), { status: 500, headers: JSON_HEADERS });
  }
}
