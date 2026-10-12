# GUSTAVOEURO — sito ufficiale

Portale statico dark-web-style. Nessun build step: si apre e funziona.

## File
| file | cosa fa |
|---|---|
| `index.html` | tutto il sito (React 18 + Tailwind CDN, router hash) |
| `404.html` | redirect alla root mantenendo l'hash |
| `_headers` | header di sicurezza per Netlify / Cloudflare Pages |
| `_redirects` | rewrite SPA per Netlify |
| `.htaccess` | header + hardening per Apache |
| `nginx.conf` | snippet server nginx |
| `netlify.toml` / `vercel.json` / `Caddyfile` | config pronte per altri host |
| `firewall.conf` | regole Cloudflare + iptables |
| `robots.txt` | noindex totale |
| `sitemap.xml` | mappa rotte |
| `.well-known/security.txt` | contatto sicurezza |
| `humans.txt` | crediti |
| `manifest.webmanifest` | PWA |
| `sw.js` | service worker (offline + cache) |
| `.nojekyll` | GitHub Pages: disattiva Jekyll |

## Password
`GUSTAVOEURO` (ofuscata in `KEY` dentro `index.html`).

## Protezione IP
1. Metti il sito dietro **Cloudflare** (proxy ON): l'IP reale del server non compare mai.
2. Applica le regole in `firewall.conf`.
3. Header già pronti in `_headers` / `.htaccess` / `nginx.conf`.

## Note
- La CSP contiene `'unsafe-eval'` perché serve a Babel. Se un giorno togli Babel, puoi rimuoverlo.
- Il service worker aggiorna con strategia network-first: niente pagine stantie.
- Le foto del taglio 10 EUR sono **su richiesta**: blocco dedicato in `/cash`.
