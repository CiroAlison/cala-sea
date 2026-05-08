import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export const config = { runtime: 'edge' };

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};
const JSON_HEADERS = { 'Content-Type': 'application/json', ...CORS };

export default async function handler(req) {
  if (req.method === 'OPTIONS') return new Response(null, { status: 200, headers: CORS });

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405, headers: JSON_HEADERS
    });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400, headers: JSON_HEADERS
    });
  }

  const { nome, telefono, data, persone, tipo, note } = body;
  if (!nome || !telefono || !data || !persone || !tipo) {
    return new Response(JSON.stringify({ error: 'Campi obbligatori mancanti' }), {
      status: 400, headers: JSON_HEADERS
    });
  }

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS prenotazioni (
        id SERIAL PRIMARY KEY,
        nome TEXT NOT NULL,
        telefono TEXT NOT NULL,
        data DATE NOT NULL,
        persone TEXT NOT NULL,
        tipo TEXT NOT NULL,
        note TEXT,
        stato TEXT DEFAULT 'nuova',
        creato_il TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    const result = await sql`
      INSERT INTO prenotazioni (nome, telefono, data, persone, tipo, note)
      VALUES (${nome}, ${telefono}, ${data}, ${persone}, ${tipo}, ${note || ''})
      RETURNING id, creato_il
    `;

    return new Response(JSON.stringify({ ok: true, id: result[0].id }), {
      status: 201, headers: JSON_HEADERS
    });
  } catch (err) {
    console.error('DB error:', err);
    return new Response(JSON.stringify({ error: 'Errore database' }), {
      status: 500, headers: JSON_HEADERS
    });
  }
}
