# Guida Cala Sea — Per chi gestisce il sito
> Versione semplice. Nessuna competenza tecnica richiesta.

---

## 🌐 Il sito è qui
**https://cala-sea.vercel.app**

Chiunque al mondo può visitarlo aprendo questo link.
Ogni volta che fate una modifica, il sito si aggiorna **entro 2 minuti**.

---

## 📁 Dove vivono i file (sul Mac del gestore)

```
Cartella "cala-sea" sul Desktop
│
├── index.html      ← TUTTO il testo del sito (titoli, descrizioni, menu, orari...)
├── style.css       ← I colori e il design (non toccare se non necessario)
├── script.js       ← Le animazioni (non toccare)
│
└── img/            ← Tutte le foto e i video
    ├── hero.jpg         ← La foto principale (sfondo hero)
    ├── ig1.jpg          ← Foto Instagram 1
    ├── ig2.jpg          ← Foto Instagram 2
    ├── video2.mp4       ← Video principale
    ├── ig-video1.mp4    ← Reel Instagram 1
    ├── ig-video2.mp4    ← Reel Instagram 2
    ├── ig-video3.mp4    ← Reel Instagram 3
    └── ...altre foto
```

---

## ✏️ COME MODIFICARE IL TESTO

### Metodo 1 — Direttamente da GitHub (dal browser, senza installare niente)

1. Vai su **https://github.com/CiroAlison/cala-sea**
2. Clicca sul file **`index.html`**
3. Clicca sulla **matita** ✏️ in alto a destra
4. Cerca il testo che vuoi cambiare (usa `Ctrl+F` o `Cmd+F` per trovarlo)
5. Modifica il testo direttamente
6. In basso clicca il pulsante verde **"Commit changes"**
7. Aspetta 2 minuti → il sito è aggiornato ✅

### Cosa puoi cambiare facilmente:
- Numero di telefono → cerca `393278653508` e sostituisci
- Orari di apertura → cerca `10:00 – 02:00`
- Indirizzo → cerca `Viale Campanariello 33`
- Prezzi del menu → cerca `€14`, `€16`, etc.
- Descrizioni dei piatti → cerca il nome del piatto
- Descrizioni degli eventi → cerca il nome dell'evento (es. "Matrimoni")

---

## 🖼️ COME AGGIUNGERE/CAMBIARE FOTO

### Per cambiare una foto esistente:
1. Prepara la nuova foto con lo **stesso nome esatto** della vecchia (es. `hero.jpg`)
2. Vai su **https://github.com/CiroAlison/cala-sea/tree/main/img**
3. Clicca **"Add file" → "Upload files"**
4. Trascina la nuova foto
5. Clicca **"Commit changes"**
→ La foto vecchia viene sostituita automaticamente

### Per aggiungere nuove foto alla gallery:
1. Carica la foto nella cartella `img/` su GitHub (vedi sopra)
   - Chiamala ad esempio `ig3.jpg`, `ig4.jpg` etc.
2. Poi in `index.html` cerca questa riga:
   ```
   <img src="img/ig2.jpg"
   ```
3. Dopo quella sezione, aggiungi una riga simile per la nuova foto
4. Oppure: **chiedi al gestore tecnico** di farlo — è 30 secondi di lavoro

---

## 🎬 COME AGGIUNGERE NUOVI VIDEO/REELS

1. Scarica il reel da Instagram (usa **snapinsta.app**)
2. Rinominalo: `ig-video4.mp4` (continua la numerazione)
3. Caricalo nella cartella `img/` su GitHub
4. Comunica al gestore tecnico il nome del file → viene aggiunto in 5 minuti

---

## 📞 COSA NON DOVETE MAI TOCCARE

- Il file `style.css` (il design)
- Il file `script.js` (le animazioni)
- La cartella `api/` (le prenotazioni)
- Il file `vercel.json` e `package.json`

Se toccate questi file per errore e il sito si rompe, **basta dirlo al gestore tecnico** — si ripristina in pochi minuti dalla cronologia di GitHub.

---

## 🔐 ACCESSI DA CONSEGNARE AI PROPRIETARI

| Cosa | Dove | Per fare |
|------|------|---------|
| Sito live | https://cala-sea.vercel.app | Vedere il sito |
| Codice sorgente | https://github.com/CiroAlison/cala-sea | Modificare testi e caricare foto |
| Hosting | https://vercel.com | Vedere statistiche, gestire dominio |
| Database prenotazioni | https://neon.tech | Vedere le prenotazioni ricevute |
| Instagram | https://www.instagram.com/calasea_club/ | Profilo social |
| Facebook | https://www.facebook.com/people/Calasea-Beachclub/61574814732637/ | Pagina social |

---

## ⚡ AZIONI RAPIDE (le più comuni)

| Voglio... | Cosa fare |
|-----------|-----------|
| Cambiare numero WhatsApp | Cerca `393278653508` in `index.html` → sostituisci (ci sono più occorrenze) |
| Cambiare un prezzo | Cerca il nome del piatto in `index.html` → cambia il numero vicino a `€` |
| Aggiungere una foto alla gallery | Carica foto in `img/` → comunica al tecnico |
| Aggiungere un reel | Scarica da SnapInsta → carica in `img/` → comunica al tecnico |
| Cambiare foto principale del sito | Carica nuova foto come `hero.jpg` in `img/` |
| Il sito non si aggiorna | Aspetta 2 minuti, poi ricarica con `Ctrl+Shift+R` |
| Qualcosa si è rotto | Non toccare altro → contatta il gestore tecnico |

---

## 📱 DOMINIO (facoltativo)

Il sito può avere un indirizzo personalizzato tipo **calasea.com** (disponibile, ~11€/anno).
Per attivarlo: accedere al pannello Vercel e acquistare il dominio dalla sezione "Domains".

---

*Guida creata per il team Cala Sea — Torre Saracena, Torre del Greco*
