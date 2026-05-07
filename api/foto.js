import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);
export const config = { runtime: 'edge' };

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS foto (
      id        SERIAL PRIMARY KEY,
      nome      TEXT,
      categoria TEXT DEFAULT 'mare',
      tipo      TEXT DEFAULT 'foto',
      mime      TEXT DEFAULT 'image/jpeg',
      data      TEXT NOT NULL,
      creato_il TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`ALTER TABLE foto ADD COLUMN IF NOT EXISTS tipo TEXT DEFAULT 'foto'`;
  try { await sql`ALTER TABLE foto ALTER COLUMN data DROP NOT NULL`; } catch(e) {}
}

export default async function handler(req) {
  const url    = new URL(req.url);
  const id     = url.searchParams.get('id');
  const token  = url.searchParams.get('token');

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,DELETE',
      'Access-Control-Allow-Headers': 'Content-Type'
    }});
  }

  try {
    await ensureTable();
  } catch (e) {
    return new Response(JSON.stringify({ error: 'DB non disponibile' }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    });
  }

  /* ── GET /api/foto?id=X → serve immagine binaria ── */
  if (req.method === 'GET' && id) {
    try {
      const rows = await sql`SELECT mime, data FROM foto WHERE id = ${id}`;
      if (!rows.length) return new Response('Not found', { status: 404 });
      if (rows[0].data && (rows[0].data.startsWith('/img/') || rows[0].data.startsWith('http'))) {
        return new Response(null, { status: 302, headers: {
          'Location': rows[0].data,
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=86400'
        }});
      }
      const b64   = rows[0].data.replace(/^data:[^;]+;base64,/, '');
      const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
      return new Response(bytes, { headers: {
        'Content-Type': rows[0].mime || 'image/jpeg',
        'Cache-Control': 'public, max-age=604800, immutable',
        'Access-Control-Allow-Origin': '*'
      }});
    } catch (e) {
      return new Response('Error', { status: 500 });
    }
  }

  /* ── GET /api/foto → lista metadati (senza data) ── */
  if (req.method === 'GET') {
    const rows = await sql`SELECT id, nome, categoria, tipo, mime, creato_il FROM foto ORDER BY creato_il DESC`;
    return new Response(JSON.stringify(rows), { headers: {
      'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'
    }});
  }

  /* ── Operazioni protette ── */
  if (token !== process.env.ADMIN_TOKEN) {
    return new Response(JSON.stringify({ error: 'Non autorizzato' }), {
      status: 401, headers: { 'Content-Type': 'application/json' }
    });
  }

  /* ── POST → carica nuova foto ── */
  if (req.method === 'POST') {
    let body;
    try { body = await req.json(); } catch {
      return new Response(JSON.stringify({ error: 'JSON non valido' }), {
        status: 400, headers: { 'Content-Type': 'application/json' }
      });
    }
    const { nome, categoria, tipo, data, mime } = body;
    if (!data && data !== '') return new Response(JSON.stringify({ error: 'Media mancante' }), {
      status: 400, headers: { 'Content-Type': 'application/json' }
    });
    const rows = await sql`
      INSERT INTO foto (nome, categoria, tipo, mime, data)
      VALUES (${nome || 'media'}, ${categoria || 'mare'}, ${tipo || 'foto'}, ${mime || 'image/jpeg'}, ${data})
      RETURNING id
    `;
    return new Response(JSON.stringify({ ok: true, id: rows[0].id }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }

  /* ── DELETE → elimina foto ── */
  if (req.method === 'DELETE') {
    let body;
    try { body = await req.json(); } catch {
      return new Response(JSON.stringify({ error: 'JSON non valido' }), {
        status: 400, headers: { 'Content-Type': 'application/json' }
      });
    }
    await sql`DELETE FROM foto WHERE id = ${body.id}`;
    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response('Method not allowed', { status: 405 });
}
