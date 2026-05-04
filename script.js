/* ═══════════════════════════════════════════
   CALA SEA – script.js  v3
   ═══════════════════════════════════════════ */

/* ─── i18n — Traduzione IT / EN ─── */
const translations = {
  it: {
    'nav.about': 'Chi Siamo', 'nav.menu': 'Menu', 'nav.gallery': 'Gallery',
    'nav.reviews': 'Recensioni', 'nav.events': 'Eventi', 'nav.contacts': 'Contatti',
    'nav.book': 'Prenota',
    'hero.tagline': 'Dove il mare incontra il lusso',
    'hero.sub': 'Beach Club &nbsp;·&nbsp; Ristorante &nbsp;·&nbsp; Cocktail Bar &nbsp;·&nbsp; Eventi Esclusivi',
    'hero.cta.book': 'Prenota Ora', 'hero.cta.menu': 'Scopri il Menu',
    'gallery.eyebrow': 'Atmosfera', 'gallery.sub': 'Le nostre foto dal vivo',
    'gallery.cta': 'Seguici su Facebook',
    'events.wedding.title': 'Matrimoni',
    'events.wedding.desc': 'Il giorno più bello della vita, con la vista del Golfo. Menù personalizzato, allestimento floreale, aperitivo sul mare.',
    'events.birthday.title': 'Compleanni',
    'events.birthday.desc': 'Festeggia il tuo compleanno con stile. Torta, musica, vista mare e tutto quello che desideri per una serata indimenticabile.',
    'events.communion.title': 'Comunioni & Cresime',
    'events.communion.desc': 'Un giorno speciale nella vita dei vostri figli. Accogliamo i vostri ospiti in un ambiente elegante e familiare.',
    'events.baptism.title': 'Battesimi',
    'events.baptism.desc': 'Celebrate l\'arrivo del vostro bambino con una festa indimenticabile sul Golfo di Napoli.',
    'events.graduation.title': 'Feste di Laurea',
    'events.graduation.desc': 'Hai sudato per arrivarci — ora festeggia come si deve. Menu personalizzato, brindisi sul mare e ricordi per sempre.',
    'events.babyshower.title': 'Baby Shower',
    'events.babyshower.desc': 'Celebrate l\'arrivo del bebè in arrivo con dolcezza. Addobbi su misura, dolci artigianali e atmosfera romantica sul mare.',
    'events.anniversary.title': 'Anniversari',
    'events.anniversary.desc': 'Ogni anno in più vale un tramonto sul Golfo. Cena romantica, fiori, candele e il Vesuvio sullo sfondo.',
    'events.djset.title': 'DJ Set & Live Music',
    'events.djset.desc': 'Serate con DJ resident, musica dal vivo, aperitivi al tramonto. Il ritmo giusto per ogni occasione.',
    'events.corporate.title': 'Aziendali & Team Building',
    'events.corporate.desc': 'Cene di gala, presentazioni, team building. Il Golfo di Napoli come sfondo per i tuoi successi professionali.',
    'events.cta': 'Richiedi info →',
  },
  en: {
    'nav.about': 'About Us', 'nav.menu': 'Menu', 'nav.gallery': 'Gallery',
    'nav.reviews': 'Reviews', 'nav.events': 'Events', 'nav.contacts': 'Contacts',
    'nav.book': 'Book Now',
    'hero.tagline': 'Where the sea meets luxury',
    'hero.sub': 'Beach Club &nbsp;·&nbsp; Restaurant &nbsp;·&nbsp; Cocktail Bar &nbsp;·&nbsp; Exclusive Events',
    'hero.cta.book': 'Book Now', 'hero.cta.menu': 'Explore the Menu',
    'gallery.eyebrow': 'Atmosphere', 'gallery.sub': 'Our live photos',
    'gallery.cta': 'Follow us on Facebook',
    'events.wedding.title': 'Weddings',
    'events.wedding.desc': 'The most beautiful day of your life, with the Gulf of Naples as your backdrop. Custom menu, floral arrangements, seaside aperitif.',
    'events.birthday.title': 'Birthday Parties',
    'events.birthday.desc': 'Celebrate your birthday in style. Cake, music, sea views and everything you wish for an unforgettable evening.',
    'events.communion.title': 'Communions & Confirmations',
    'events.communion.desc': 'A special day in your children\'s lives. We welcome your guests in an elegant and warm atmosphere.',
    'events.baptism.title': 'Baptisms',
    'events.baptism.desc': 'Celebrate the arrival of your child with an unforgettable party on the Gulf of Naples.',
    'events.graduation.title': 'Graduation Parties',
    'events.graduation.desc': 'You worked hard to get here — now celebrate properly. Custom menu, seaside toast and memories forever.',
    'events.babyshower.title': 'Baby Showers',
    'events.babyshower.desc': 'Celebrate the upcoming arrival with sweetness. Custom decorations, artisan sweets and a romantic sea atmosphere.',
    'events.anniversary.title': 'Anniversaries',
    'events.anniversary.desc': 'Every year together is worth a sunset on the Gulf. Romantic dinner, flowers, candles and Vesuvius in the background.',
    'events.djset.title': 'DJ Sets & Live Music',
    'events.djset.desc': 'Evenings with resident DJs, live music, sunset aperitifs. The right rhythm for every occasion.',
    'events.corporate.title': 'Corporate & Team Building',
    'events.corporate.desc': 'Gala dinners, presentations, team building. The Gulf of Naples as the backdrop for your professional success.',
    'events.cta': 'Request info →',
  }
};

let currentLang = localStorage.getItem('calasea_lang') || 'it';

function applyLang(lang) {
  currentLang = lang;
  localStorage.setItem('calasea_lang', lang);
  document.documentElement.lang = lang === 'en' ? 'en' : 'it';
  const btn = document.getElementById('langToggle');
  if (btn) btn.textContent = lang === 'it' ? 'EN' : 'IT';
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const txt = translations[lang][key];
    if (txt !== undefined) el.innerHTML = txt;
  });
}

document.getElementById('langToggle')?.addEventListener('click', () => {
  applyLang(currentLang === 'it' ? 'en' : 'it');
});

// Applica lingua salvata al caricamento
applyLang(currentLang);

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

/* ─── Reels Instagram: autoplay, restart on re-entry, sound toggle ─── */
(function () {
  const reels = document.querySelectorAll('.reel-item');
  if (!reels.length) return;

  let globalMuted = true;

  reels.forEach(item => {
    const video = item.querySelector('video');
    if (!video) return;

    // Aggiungi pulsante audio
    const btn = document.createElement('button');
    btn.className = 'reel-sound-btn';
    btn.innerHTML = svgMuted();
    btn.setAttribute('aria-label', 'Attiva audio');
    item.appendChild(btn);

    btn.addEventListener('click', e => {
      e.stopPropagation();
      globalMuted = !globalMuted;
      document.querySelectorAll('.reel-item video').forEach(v => { v.muted = globalMuted; });
      document.querySelectorAll('.reel-sound-btn').forEach(b => {
        b.innerHTML = globalMuted ? svgMuted() : svgUnmuted();
        b.setAttribute('aria-label', globalMuted ? 'Attiva audio' : 'Disattiva audio');
      });
    });

    // IntersectionObserver: play quando entra, reset+pause quando esce
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        video.muted = globalMuted;
        video.currentTime = 0;
        video.play().catch(() => {});
        item.classList.add('reel-active');
      } else {
        video.pause();
        video.currentTime = 0;
        item.classList.remove('reel-active');
      }
    }, { threshold: 0.5 });

    obs.observe(item);
  });

  function svgMuted() {
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
      <line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
    </svg>`;
  }
  function svgUnmuted() {
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
      <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/>
    </svg>`;
  }
})();

/* ─── Smooth scroll (chiude anche il menu mobile) ─── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    if (!id) return;
    const el = document.getElementById(id);
    if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth' }); closeMenu(); }
  });
});
