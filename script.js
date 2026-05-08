/* ═══════════════════════════════════════════
   CALA SEA – script.js  v3
   ═══════════════════════════════════════════ */

/* ─── HTML escape helper ─── */
function esc(s) { return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

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
function wireMenuTabs(container) {
  const scope = container || document;
  scope.querySelectorAll('.tab').forEach(btn => {
    btn.addEventListener('click', () => {
      // scope: find the nearest container
      const sec = btn.closest('section') || document;
      sec.querySelectorAll('.tab').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected','false'); });
      sec.querySelectorAll('.tab-panel').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      btn.setAttribute('aria-selected','true');
      const t = document.getElementById('tab-' + btn.dataset.tab);
      if (t) t.classList.add('active');
    });
  });
}
wireMenuTabs();


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

/* ─── Applica impostazioni dal pannello admin ─── */
(function () {

  // Definizioni font (devono corrispondere a quelle in admin.html)
  const FONTS = [
    { key:'default',  serif:"'Cormorant Garamond',serif", sans:"'Jost',sans-serif",          gfUrl:'Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Jost:wght@200;300;400;500;600' },
    { key:'playfair', serif:"'Playfair Display',serif",   sans:"'Montserrat',sans-serif",     gfUrl:'Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Montserrat:wght@300;400;500;600' },
    { key:'garamond', serif:"'EB Garamond',serif",        sans:"'Raleway',sans-serif",        gfUrl:'EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Raleway:wght@300;400;500;600' },
    { key:'cinzel',   serif:"'Cinzel',serif",             sans:"'Raleway',sans-serif",        gfUrl:'Cinzel:wght@400;500;600;700&family=Raleway:wght@300;400;500;600' },
    { key:'libre',    serif:"'Libre Baskerville',serif",  sans:"'Nunito',sans-serif",         gfUrl:'Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Nunito:wght@300;400;500;600;700' },
  ];

  function loadFont(fontDef) {
    if (!fontDef || fontDef.key === 'default') return;
    const link = document.createElement('link');
    link.rel  = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=' + fontDef.gfUrl + '&display=swap';
    document.head.appendChild(link);
    link.onload = () => {
      document.documentElement.style.setProperty('--serif', fontDef.serif);
      document.documentElement.style.setProperty('--sans',  fontDef.sans);
    };
    // Apply immediately in case fonts are already cached
    document.documentElement.style.setProperty('--serif', fontDef.serif);
    document.documentElement.style.setProperty('--sans',  fontDef.sans);
  }

  function renderMenu(data) {
    const sec = document.getElementById('menu');
    if (!sec || !data || !data.tabs || !data.tabs.length) return;
    const container = sec.querySelector('.container');
    if (!container) return;

    // Remove existing tab-bar wrapper, tab-bars and tab-panels
    container.querySelectorAll('.tab-bar-wrap, .tab-bar, .tab-panel, .menu-footer-note').forEach(el => el.remove());

    // Build tab bar (wrapped for overflow indicator)
    const tabBarWrap = document.createElement('div');
    tabBarWrap.className = 'tab-bar-wrap';
    const tabBar = document.createElement('div');
    tabBar.className = 'tab-bar';
    tabBar.setAttribute('role', 'tablist');
    data.tabs.forEach((tab, i) => {
      const btn = document.createElement('button');
      btn.className = 'tab' + (i === 0 ? ' active' : '');
      btn.dataset.tab = tab.id;
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      btn.textContent = tab.label;
      tabBar.appendChild(btn);
    });
    tabBarWrap.appendChild(tabBar);
    container.appendChild(tabBarWrap);

    // Build tab panels
    data.tabs.forEach((tab, i) => {
      const panel = document.createElement('div');
      panel.className = 'tab-panel' + (i === 0 ? ' active' : '');
      panel.id = 'tab-' + tab.id;
      panel.setAttribute('role', 'tabpanel');

      const grid = document.createElement('div');
      grid.className = 'menu-grid';
      (tab.items || []).forEach(item => {
        const mi = document.createElement('div');
        mi.className = 'mi';
        mi.innerHTML = `<div class="mi-info"><h4>${esc(item.nome)}</h4>${item.desc ? '<p>' + esc(item.desc) + '</p>' : ''}</div><span class="mi-p">€${esc(item.prezzo)}</span>`;
        grid.appendChild(mi);
      });
      panel.appendChild(grid);
      container.appendChild(panel);
    });

    // Nota globale sotto tutti i pannelli
    if (data.nota) {
      // rimuovi eventuale nota precedente
      container.querySelectorAll('.menu-footer-note').forEach(el => el.remove());
      const nota = document.createElement('p');
      nota.className = 'menu-footer-note';
      nota.textContent = data.nota;
      container.appendChild(nota);
    }

    // Re-wire tab click handlers using shared function
    wireMenuTabs(container);
  }

  function appendCustomPhotos(fotos) {
    if (!fotos || !fotos.length) return;
    const grid = document.querySelector('.gallery-grid');
    if (!grid) return;

    // Add any new filter categories
    const filterBar = document.querySelector('.gallery-filters');
    const existingFilters = new Set();
    document.querySelectorAll('.gf-btn[data-filter]').forEach(b => existingFilters.add(b.dataset.filter));

    const catEmoji = { mare:'🌊', cibo:'🍽️', serata:'🌅', serate:'🌅', evento:'🎉', video:'🎥', reel:'📱' };

    fotos.forEach(foto => {
      const tipo = foto.tipo || 'foto';
      const isVid = tipo === 'video' || tipo === 'reel';
      const cat = isVid ? tipo : (foto.categoria || 'mare');

      // Add filter button if new category
      if (filterBar && cat !== 'tutti' && !existingFilters.has(cat)) {
        const btn = document.createElement('button');
        btn.className = 'gf-btn';
        btn.dataset.filter = cat;
        const emoji = catEmoji[cat] || '';
        btn.textContent = emoji + ' ' + cat.charAt(0).toUpperCase() + cat.slice(1);
        filterBar.appendChild(btn);
        existingFilters.add(cat);
        btn.addEventListener('click', () => {
          document.querySelectorAll('.gf-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          document.querySelectorAll('.g-item[data-cat]').forEach(item => {
            item.classList.toggle('g-hidden', item.dataset.cat !== cat);
          });
        });
      }

      const a = document.createElement('div');
      a.className = 'g-item g-item--custom';
      a.dataset.cat = cat;

      if (isVid) {
        a.innerHTML = `<video src="/api/foto?id=${foto.id}" muted playsinline loop loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block"></video><div class="g-overlay"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8"><polygon points="5 3 19 12 5 21 5 3" fill="white" stroke="none"/></svg></div>`;
        const vid = a.querySelector('video');
        const obs = new IntersectionObserver(([e]) => { if(e.isIntersecting) vid.play().catch(()=>{}); else { vid.pause(); vid.currentTime=0; } }, { threshold: 0.5 });
        obs.observe(a);
      } else {
        a.innerHTML = `<img src="/api/foto?id=${foto.id}" alt="${foto.nome || 'Foto Cala Sea'}" loading="lazy" /><div class="g-overlay"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.8" fill="white" stroke="none"/></svg></div>`;
      }

      grid.insertBefore(a, grid.firstChild);
    });

    // Re-apply active filter
    const activeFilter = document.querySelector('.gf-btn.active')?.dataset.filter || 'tutti';
    if (activeFilter !== 'tutti') {
      document.querySelectorAll('.g-item[data-cat]').forEach(item => {
        item.classList.toggle('g-hidden', item.dataset.cat !== activeFilter);
      });
    }
  }

  fetch('/api/settings')
    .then(r => r.json())
    .then(s => {

      // Annuncio banner
      const text = s.annuncio && s.annuncio.trim();
      if (text) {
        const banner = document.getElementById('annuncio-banner');
        const span   = document.getElementById('annuncio-text');
        if (banner && span) { span.textContent = text; banner.style.display = 'block'; }
      }

      // Colori (CSS vars)
      if (s.col_navy) document.documentElement.style.setProperty('--navy',      s.col_navy);
      if (s.col_sand) document.documentElement.style.setProperty('--sand',      s.col_sand);
      if (s.col_gold) document.documentElement.style.setProperty('--gold',      s.col_gold);
      if (s.col_navy) document.documentElement.style.setProperty('--navy-deep', shadeColor(s.col_navy, -20));

      // Font
      if (s.font_key && s.font_key !== 'default') {
        const fontDef = FONTS.find(f => f.key === s.font_key);
        if (fontDef) loadFont(fontDef);
      }

      // Contatti
      if (s.c_tel) {
        document.querySelectorAll('[data-cs="tel"]').forEach(el => {
          el.textContent = s.c_tel;
          if (el.tagName === 'A') el.href = 'tel:' + s.c_tel.replace(/\s/g, '');
        });
      }
      if (s.c_orari) {
        document.querySelectorAll('[data-cs="orari"]').forEach(el => el.textContent = s.c_orari);
      }
      if (s.c_email) {
        document.querySelectorAll('[data-cs="email"]').forEach(el => {
          el.textContent = s.c_email;
          if (el.tagName === 'A') el.href = 'mailto:' + s.c_email;
        });
      }
      if (s.c_indirizzo) {
        document.querySelectorAll('[data-cs="indirizzo"]').forEach(el => el.textContent = s.c_indirizzo);
      }

      // Testi
      if (s.t_tagline) {
        document.querySelectorAll('[data-i18n="hero.tagline"]').forEach(el => el.textContent = s.t_tagline);
      }
      if (s.t_sub) {
        document.querySelectorAll('[data-i18n="hero.sub"]').forEach(el => el.innerHTML = s.t_sub);
      }
      if (s.t_chisiamo) {
        const cs = document.querySelector('.col-text .body-text');
        if (cs) cs.textContent = s.t_chisiamo;
      }

      // Testi data-ts (applicazione universale)
      document.querySelectorAll('[data-ts]').forEach(el => {
        const key = el.dataset.ts;
        if (s[key] && s[key].trim()) {
          // Per h2 con innerHTML (potrebbero avere em/br)
          if (el.tagName === 'H2' || el.tagName === 'H1') {
            el.innerHTML = s[key];
          } else {
            el.textContent = s[key];
          }
        }
      });

      // Override testi eventi (sovrascrivono le traduzioni i18n)
      const evKeys = {
        't_ev_wedding_title':    'events.wedding.title',
        't_ev_wedding_desc':     'events.wedding.desc',
        't_ev_birthday_title':   'events.birthday.title',
        't_ev_birthday_desc':    'events.birthday.desc',
        't_ev_communion_title':  'events.communion.title',
        't_ev_communion_desc':   'events.communion.desc',
        't_ev_baptism_title':    'events.baptism.title',
        't_ev_baptism_desc':     'events.baptism.desc',
        't_ev_graduation_title': 'events.graduation.title',
        't_ev_graduation_desc':  'events.graduation.desc',
        't_ev_babyshower_title': 'events.babyshower.title',
        't_ev_babyshower_desc':  'events.babyshower.desc',
        't_ev_anniversary_title':'events.anniversary.title',
        't_ev_anniversary_desc': 'events.anniversary.desc',
        't_ev_djset_title':      'events.djset.title',
        't_ev_djset_desc':       'events.djset.desc',
        't_ev_corporate_title':  'events.corporate.title',
        't_ev_corporate_desc':   'events.corporate.desc',
      };
      let evChanged = false;
      Object.entries(evKeys).forEach(([settingsKey, i18nKey]) => {
        if (s[settingsKey] && s[settingsKey].trim()) {
          if (translations.it[i18nKey] !== s[settingsKey]) {
            translations.it[i18nKey] = s[settingsKey];
            evChanged = true;
          }
        }
      });
      if (evChanged) applyLang(currentLang);

      // WhatsApp number override
      if (s.c_wa && s.c_wa.trim()) {
        const waNum = s.c_wa.replace(/\D/g, '');
        document.querySelectorAll('[data-wa="true"]').forEach(link => {
          const currentHref = link.getAttribute('href') || '';
          const textPart = currentHref.includes('?text=') ? currentHref.split('?text=')[1] : '';
          link.href = 'https://wa.me/' + waNum + (textPart ? '?text=' + textPart : '');
        });
        document.querySelectorAll('.prenota-note').forEach(el => {
          el.textContent = 'Risposta garantita entro 1 ora · ' + s.c_wa;
        });
      }

      // Menu dinamico — usa solo se ha almeno 1 tab valido
      if (s.menu_json) {
        try {
          const menuData = JSON.parse(s.menu_json);
          if (menuData && Array.isArray(menuData.tabs) && menuData.tabs.length > 0) renderMenu(menuData);
        } catch(e) { /* invalid JSON, keep static menu */ }
      }

    })
    .catch(() => {});

  // Carica foto custom dalla galleria admin (separato per non bloccare settings)
  fetch('/api/foto')
    .then(r => r.json())
    .then(fotos => { if (Array.isArray(fotos) && fotos.length) appendCustomPhotos(fotos); })
    .catch(() => {});

  document.getElementById('annuncio-close')?.addEventListener('click', () => {
    const b = document.getElementById('annuncio-banner');
    if (b) b.style.display = 'none';
  });

  // Helper: scurisce un colore hex di una percentuale
  function shadeColor(hex, pct) {
    const n = parseInt(hex.replace('#',''), 16);
    const r = Math.min(255, Math.max(0, (n>>16) + pct));
    const g = Math.min(255, Math.max(0, ((n>>8)&0xff) + pct));
    const b = Math.min(255, Math.max(0, (n&0xff) + pct));
    return '#' + [r,g,b].map(v => v.toString(16).padStart(2,'0')).join('');
  }
})();

/* ─── Loading Screen ─── */
(function () {
  const loader = document.getElementById('page-loader');
  if (!loader) return;
  const hide = () => loader.classList.add('hidden');
  if (document.readyState === 'complete') {
    setTimeout(hide, 900);
  } else {
    window.addEventListener('load', () => setTimeout(hide, 900));
    setTimeout(hide, 3500); // fallback
  }
})();

/* ─── Gallery Filters ─── */
(function () {
  const btns  = document.querySelectorAll('.gf-btn');
  const items = document.querySelectorAll('.g-item[data-cat]');
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      items.forEach(item => {
        const match = filter === 'tutti' || item.dataset.cat === filter;
        item.classList.toggle('g-hidden', !match);
      });
    });
  });
})();


/* ─── Recensioni clienti ─── */
(function () {
  const toggleBtn = document.getElementById('rev-toggle-btn');
  const form      = document.getElementById('rev-form');
  const starsInput = document.getElementById('rev-stars-input');
  const starsLabel = document.getElementById('rev-stars-label');
  const charCount  = document.getElementById('rev-char-count');
  const revTesto   = document.getElementById('rev-testo');
  const revMsg     = document.getElementById('rev-form-msg');
  if (!toggleBtn || !form) return;

  let selectedStars = 0;
  const starLabels = ['','Pessimo 😞','Scarso 😐','Nella media 🙂','Ottimo 😊','Eccellente 🤩'];

  // Toggle form
  toggleBtn.addEventListener('click', () => {
    const open = form.style.display !== 'none';
    form.style.display = open ? 'none' : 'block';
    toggleBtn.style.opacity = open ? '1' : '.7';
    if (!open) form.querySelector('#rev-nome')?.focus();
  });

  // Stelle
  const starBtns = starsInput ? starsInput.querySelectorAll('.rsb') : [];
  starBtns.forEach(btn => {
    btn.addEventListener('mouseenter', () => highlightStars(parseInt(btn.dataset.v)));
    btn.addEventListener('mouseleave', () => highlightStars(selectedStars));
    btn.addEventListener('click', () => {
      selectedStars = parseInt(btn.dataset.v);
      highlightStars(selectedStars);
      if (starsLabel) starsLabel.textContent = starLabels[selectedStars] || '';
    });
  });

  function highlightStars(n) {
    starBtns.forEach(b => b.classList.toggle('active', parseInt(b.dataset.v) <= n));
  }

  // Contatore caratteri
  revTesto?.addEventListener('input', () => {
    if (charCount) charCount.textContent = revTesto.value.length;
  });

  // Submit
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const nome  = document.getElementById('rev-nome')?.value.trim();
    const testo = revTesto?.value.trim();
    const data_visita = document.getElementById('rev-data')?.value || null;

    if (!selectedStars) { setMsg('Seleziona una valutazione a stelle.', false); return; }
    if (!nome)   { setMsg('Inserisci il tuo nome.', false); return; }
    if (!testo)  { setMsg('Scrivi la tua recensione.', false); return; }

    const btn = form.querySelector('.rev-submit-btn');
    btn.textContent = 'Invio…'; btn.disabled = true;

    try {
      const res = await fetch('/api/recensioni', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, stelle: selectedStars, testo, data_visita })
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setMsg('✓ Grazie! La tua recensione sarà pubblicata dopo approvazione.', true);
        form.reset();
        selectedStars = 0;
        highlightStars(0);
        if (starsLabel) starsLabel.textContent = 'Tocca per valutare';
        if (charCount) charCount.textContent = '0';
        setTimeout(() => { form.style.display = 'none'; toggleBtn.style.opacity = '1'; }, 3000);
      } else {
        setMsg('⚠ ' + (data.error || 'Errore. Riprova.'), false);
      }
    } catch { setMsg('⚠ Errore di connessione. Riprova.', false); }

    btn.textContent = 'Invia recensione'; btn.disabled = false;
  });

  function setMsg(txt, ok) {
    if (!revMsg) return;
    revMsg.textContent = txt;
    revMsg.className = 'rev-form-msg ' + (ok ? 'ok' : 'err');
  }

  // Carica recensioni approvate dal DB e aggiungile alla grid
  fetch('/api/recensioni')
    .then(r => r.ok ? r.json() : [])
    .then(list => {
      if (!list.length) return;
      const grid = document.querySelector('.reviews-grid');
      if (!grid) return;
      const starStr = n => '★'.repeat(n) + '☆'.repeat(5 - n);
      list.forEach(rev => {
        const dataFmt = rev.data_visita
          ? new Date(rev.data_visita + '-01').toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })
          : new Date(rev.creato_il).toLocaleDateString('it-IT', { month: 'long', year: 'numeric' });
        const article = document.createElement('article');
        article.className = 'review-card fade-in';
        article.innerHTML = `
          <div class="rev-stars">${starStr(rev.stelle)}</div>
          <blockquote class="rev-text">"${rev.testo.replace(/"/g,'&quot;')}"</blockquote>
          <footer class="rev-author">
            <span class="rev-av">${esc(rev.nome.charAt(0).toUpperCase())}</span>
            <div><strong>${esc(rev.nome)}</strong><small>${dataFmt} · Cala Sea</small></div>
          </footer>`;
        grid.appendChild(article);
        io.observe(article); // fade-in
      });
    })
    .catch(() => {});
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
