import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);
export const config = { runtime: 'edge' };

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET,POST',
  'Access-Control-Allow-Headers': 'Content-Type',
};
const JSON_HEADERS = { 'Content-Type': 'application/json', ...CORS };

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS recensioni (
      id          SERIAL PRIMARY KEY,
      nome        TEXT NOT NULL,
      stelle      INTEGER NOT NULL,
      testo       TEXT NOT NULL,
      data_visita TEXT,
      stato       TEXT DEFAULT 'pending',
      creato_il   TIMESTAMPTZ DEFAULT NOW()
    )
  `;
}

export default async function handler(req) {
  if (req.method === 'OPTIONS') return new Response(null, { status: 200, headers: CORS });

  try { await ensureTable(); } catch(e) {
    return new Response(JSON.stringify({ error: 'DB non disponibile' }), { status: 500, headers: JSON_HEADERS });
  }

  const url   = new URL(req.url);
  const token = url.searchParams.get('token');

  /* ── GET pubblico: recensioni approvate per il sito ── */
  if (req.method === 'GET' && !token) {
    const rows = await sql`
      SELECT id, nome, stelle, testo, data_visita, creato_il
      FROM recensioni WHERE stato = 'approvata'
      ORDER BY creato_il DESC LIMIT 50
    `;
    return new Response(JSON.stringify(rows), { headers: JSON_HEADERS });
  }

  /* ── GET admin: tutte le recensioni con stato ── */
  if (req.method === 'GET' && token) {
    if (token !== process.env.ADMIN_TOKEN)
      return new Response(JSON.stringify({ error: 'Non autorizzato' }), { status: 401, headers: JSON_HEADERS });
    const rows = await sql`
      SELECT id, nome, stelle, testo, data_visita, stato, creato_il
      FROM recensioni ORDER BY
        CASE stato WHEN 'pending' THEN 0 WHEN 'approvata' THEN 1 ELSE 2 END,
        creato_il DESC LIMIT 300
    `;
    return new Response(JSON.stringify(rows), { headers: JSON_HEADERS });
  }

  /* ── POST pubblico: invia nuova recensione ── */
  if (req.method === 'POST' && !token) {
    let body;
    try { body = await req.json(); } catch {
      return new Response(JSON.stringify({ error: 'JSON non valido' }), { status: 400, headers: JSON_HEADERS });
    }
    const { nome, stelle, testo, data_visita } = body;
    if (!nome || !stelle || !testo)
      return new Response(JSON.stringify({ error: 'Nome, stelle e testo sono obbligatori' }), { status: 400, headers: JSON_HEADERS });
    if (stelle < 1 || stelle > 5)
      return new Response(JSON.stringify({ error: 'Stelle non valide' }), { status: 400, headers: JSON_HEADERS });
    if (testo.length > 1000)
      return new Response(JSON.stringify({ error: 'Testo troppo lungo (max 1000 caratteri)' }), { status: 400, headers: JSON_HEADERS });

    await sql`
      INSERT INTO recensioni (nome, stelle, testo, data_visita, stato)
      VALUES (${nome.slice(0,100)}, ${stelle}, ${testo.slice(0,1000)}, ${data_visita || null}, 'pending')
    `;
    return new Response(JSON.stringify({ ok: true }), { headers: JSON_HEADERS });
  }

  /* ── POST admin: approva / rifiuta recensione ── */
  if (req.method === 'POST' && token) {
    if (token !== process.env.ADMIN_TOKEN)
      return new Response(JSON.stringify({ error: 'Non autorizzato' }), { status: 401, headers: JSON_HEADERS });
    let body;
    try { body = await req.json(); } catch {
      return new Response(JSON.stringify({ error: 'JSON non valido' }), { status: 400, headers: JSON_HEADERS });
    }
    const { id, stato } = body;
    if (!id || !['approvata','rifiutata','pending'].includes(stato))
      return new Response(JSON.stringify({ error: 'Parametri non validi' }), { status: 400, headers: JSON_HEADERS });
    await sql`UPDATE recensioni SET stato = ${stato} WHERE id = ${id}`;
    return new Response(JSON.stringify({ ok: true }), { headers: JSON_HEADERS });
  }

  return new Response('Method not allowed', { status: 405 });
}
