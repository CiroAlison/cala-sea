import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);
export const config = { runtime: 'edge' };

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};
const JSON_HEADERS = { 'Content-Type': 'application/json', ...CORS };

async function getAdminList() {
  try {
    const rows = await sql`SELECT value FROM settings WHERE key = 'admin_tokens_json'`;
    if (rows.length && rows[0].value) return JSON.parse(rows[0].value);
  } catch(e) {}
  return [];
}

async function saveAdminList(list) {
  await sql`
    INSERT INTO settings (key, value, updated_at) VALUES ('admin_tokens_json', ${JSON.stringify(list)}, NOW())
    ON CONFLICT (key) DO UPDATE SET value = ${JSON.stringify(list)}, updated_at = NOW()
  `;
}

async function isAdmin(token) {
  if (!token) return false;
  if (token === process.env.ADMIN_TOKEN) return true;
  const list = await getAdminList();
  return list.some(a => a.token === token);
}

export default async function handler(req) {
  if (req.method === 'OPTIONS') return new Response(null, { status: 200, headers: CORS });

  const url   = new URL(req.url);
  const token = url.searchParams.get('token');

  if (!token || !(await isAdmin(token))) {
    return new Response(JSON.stringify({ error: 'Non autorizzato' }), { status: 401, headers: JSON_HEADERS });
  }

  const isMaster = token === process.env.ADMIN_TOKEN;

  /* ── GET — lista admin (senza password) ── */
  if (req.method === 'GET') {
    const list = await getAdminList();
    return new Response(JSON.stringify({
      isMaster,
      admins: list.map(({ id, nome }) => ({ id, nome }))
    }), { headers: JSON_HEADERS });
  }

  /* ── POST — gestione admin ── */
  if (req.method === 'POST') {
    let body;
    try { body = await req.json(); } catch {
      return new Response(JSON.stringify({ error: 'JSON non valido' }), { status: 400, headers: JSON_HEADERS });
    }

    const list = await getAdminList();

    /* Aggiungi nuovo admin */
    if (body.action === 'add') {
      const { nome, token: newTok } = body;
      if (!nome || !newTok)
        return new Response(JSON.stringify({ error: 'Nome e password obbligatori' }), { status: 400, headers: JSON_HEADERS });
      if (newTok.length < 6)
        return new Response(JSON.stringify({ error: 'Password troppo corta (minimo 6 caratteri)' }), { status: 400, headers: JSON_HEADERS });
      if (newTok === process.env.ADMIN_TOKEN)
        return new Response(JSON.stringify({ error: 'Password non disponibile' }), { status: 400, headers: JSON_HEADERS });
      const id = Date.now().toString(36);
      list.push({ id, nome: nome.slice(0, 50), token: newTok });
      await saveAdminList(list);
      return new Response(JSON.stringify({ ok: true, id }), { headers: JSON_HEADERS });
    }

    /* Rimuovi admin */
    if (body.action === 'remove') {
      if (!body.id)
        return new Response(JSON.stringify({ error: 'ID mancante' }), { status: 400, headers: JSON_HEADERS });
      const newList = list.filter(a => a.id !== body.id);
      await saveAdminList(newList);
      return new Response(JSON.stringify({ ok: true }), { headers: JSON_HEADERS });
    }

    /* Cambia la propria password */
    if (body.action === 'change_password') {
      const { newToken } = body;
      if (!newToken || newToken.length < 6)
        return new Response(JSON.stringify({ error: 'Nuova password troppo corta (minimo 6 caratteri)' }), { status: 400, headers: JSON_HEADERS });
      if (newToken === process.env.ADMIN_TOKEN)
        return new Response(JSON.stringify({ error: 'Password non disponibile' }), { status: 400, headers: JSON_HEADERS });
      const idx = list.findIndex(a => a.token === token);
      if (idx !== -1) {
        // Admin DB: aggiorna il token esistente
        list[idx].token = newToken;
      } else {
        // Admin master: aggiunge un entry DB con la nuova password
        list.push({ id: 'master_' + Date.now().toString(36), nome: 'Admin', token: newToken });
      }
      await saveAdminList(list);
      return new Response(JSON.stringify({ ok: true }), { headers: JSON_HEADERS });
    }

    return new Response(JSON.stringify({ error: 'Azione non valida' }), { status: 400, headers: JSON_HEADERS });
  }

  return new Response('Method not allowed', { status: 405 });
}
