import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export const config = { runtime: 'edge' };

export default async function handler(req) {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: { 'Access-Control-Allow-Origin': '*' } });
  }

  // Password semplice per proteggere la lista prenotazioni
  const url = new URL(req.url);
  const token = url.searchParams.get('token');
  if (token !== process.env.ADMIN_TOKEN) {
    return new Response(JSON.stringify({ error: 'Non autorizzato' }), {
      status: 401, headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    // Crea la tabella se non esiste ancora (es. zero prenotazioni)
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

    const rows = await sql`
      SELECT id, nome, telefono, data, persone, tipo, note, stato, creato_il
      FROM prenotazioni
      ORDER BY creato_il DESC
      LIMIT 200
    `;

    return new Response(JSON.stringify(rows), {
      status: 200, headers: { 'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' }
    });
  } catch (err) {
    console.error('DB error:', err);
    return new Response(JSON.stringify({ error: 'Errore database' }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    });
  }
}
