import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type' } });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
  }

  const url = new URL(req.url);
  const token = url.searchParams.get('token');
  if (token !== process.env.ADMIN_TOKEN) {
    return new Response(JSON.stringify({ error: 'Non autorizzato' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  let body;
  try { body = await req.json(); } catch {
    return new Response(JSON.stringify({ error: 'JSON non valido' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const { id, stato } = body;
  if (!id || !stato) {
    return new Response(JSON.stringify({ error: 'id e stato obbligatori' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const statiValidi = ['nuova', 'confermata', 'cancellata'];
  if (!statiValidi.includes(stato)) {
    return new Response(JSON.stringify({ error: 'Stato non valido' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    // Aggiunge la colonna stato se non esiste ancora
    await sql`ALTER TABLE prenotazioni ADD COLUMN IF NOT EXISTS stato TEXT DEFAULT 'nuova'`;

    await sql`UPDATE prenotazioni SET stato = ${stato} WHERE id = ${id}`;

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (err) {
    console.error('DB error:', err);
    return new Response(JSON.stringify({ error: 'Errore database' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
