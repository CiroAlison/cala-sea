/* ═══════════════════════════════════════════
   CALA SEA – script.js  v2
   ═══════════════════════════════════════════ */

/* ─── Navbar + mobile bar + back-to-top on scroll ─── */
const navbar    = document.getElementById('navbar');
const mobileBar = document.getElementById('mobileBar');
const backTop   = document.getElementById('backTop');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  navbar.classList.toggle('scrolled', y > 60);
  if (mobileBar) mobileBar.classList.toggle('show', y > window.innerHeight * 0.5);
  if (backTop)   backTop.classList.toggle('show', y > 400);
}, { passive: true });

backTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ─── Burger / mobile nav ─── */
const burger   = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
const overlay  = document.getElementById('navOverlay');

function openMenu() {
  burger.classList.add('open');
  navLinks.classList.add('open');
  overlay.classList.add('show');
  document.body.style.overflow = 'hidden';
  burger.setAttribute('aria-expanded', 'true');
}
function closeMenu() {
  burger.classList.remove('open');
  navLinks.classList.remove('open');
  overlay.classList.remove('show');
  document.body.style.overflow = '';
  burger.setAttribute('aria-expanded', 'false');
}

burger.addEventListener('click', () => navLinks.classList.contains('open') ? closeMenu() : openMenu());
overlay.addEventListener('click', closeMenu);
window.closeMenu = closeMenu;

/* ─── Scroll fade-in ─── */
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.fade-in').forEach(el => io.observe(el));

/* ─── Menu tabs ─── */
document.querySelectorAll('.tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    const t = document.getElementById('tab-' + btn.dataset.tab);
    if (t) t.classList.add('active');
  });
});

/* ─── Countdown 25 Aprile 2025 ─── */
function pad(n) { return String(n).padStart(2, '0'); }

function updateCountdown() {
  const target = new Date('2025-04-25T12:00:00');
  const now    = new Date();
  const diff   = target - now;

  if (diff <= 0) {
    const msg = '<span style="color:var(--sand);font-size:.9rem;font-weight:500">L\'evento è oggi! 🎉</span>';
    const cd = document.getElementById('countdown25');
    const ev = document.getElementById('ev-countdown');
    if (cd) cd.innerHTML = msg;
    if (ev) ev.innerHTML = msg;
    return;
  }

  const days = Math.floor(diff / 864e5);
  const hrs  = Math.floor((diff % 864e5) / 36e5);
  const mins = Math.floor((diff % 36e5) / 6e4);
  const secs = Math.floor((diff % 6e4) / 1e3);

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = pad(val); };
  set('cd-days', days); set('cd-hrs', hrs); set('cd-min', mins);
  set('ev-days', days); set('ev-hrs', hrs); set('ev-min', mins); set('ev-sec', secs);
}
updateCountdown();
setInterval(updateCountdown, 1000);

/* ─── Booking form → WhatsApp ─── */
const form = document.getElementById('prenota-form');
if (form) {
  const dateInput = document.getElementById('data');
  if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;
    form.querySelectorAll('[required]').forEach(f => {
      f.classList.remove('error');
      const bad = f.type === 'checkbox' ? !f.checked : !f.value.trim();
      if (bad) { f.classList.add('error'); valid = false; }
    });
    if (!valid) {
      form.querySelector('.error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const nome     = document.getElementById('nome').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const data     = document.getElementById('data').value;
    const persone  = document.getElementById('persone').value;
    const tipo     = document.getElementById('tipo').value;
    const note     = document.getElementById('note')?.value.trim() || '';

    const dateStr = data
      ? new Date(data + 'T00:00:00').toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
      : '';

    const msg = [
      'Ciao Cala Sea! 👋 Vorrei prenotare:',
      `👤 Nome: ${nome}`,
      `📞 Tel: ${telefono}`,
      `📅 Data: ${dateStr}`,
      `👥 Persone: ${persone}`,
      `🍽️ Tipo: ${tipo}`,
      note ? `📝 Note: ${note}` : ''
    ].filter(Boolean).join('\n');

    window.open('https://wa.me/393278653508?text=' + encodeURIComponent(msg), '_blank');

    // Salva anche nel database (silenzioso, non blocca il flusso WhatsApp)
    fetch('/api/prenota', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, telefono, data, persone, tipo, note })
    }).catch(() => {});
  });
}

/* ─── Cookie banner ─── */
const cookieBanner = document.getElementById('cookie-banner');
const COOKIE_KEY   = 'calasea_cookie_ok';
if (cookieBanner && !localStorage.getItem(COOKIE_KEY)) {
  setTimeout(() => cookieBanner.classList.add('show'), 1400);
}
function dismissCookie() {
  if (cookieBanner) cookieBanner.classList.remove('show');
  localStorage.setItem(COOKIE_KEY, '1');
}
document.getElementById('cookie-accept')?.addEventListener('click', dismissCookie);
document.getElementById('cookie-reject')?.addEventListener('click', dismissCookie);

/* ─── Smooth scroll (chiude anche il menu mobile) ─── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    if (!id) return;
    const el = document.getElementById(id);
    if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth' }); closeMenu(); }
  });
});
