# Nirmana Ventures Pvt. Ltd. — Website

A fast, dependency-free static website (HTML + CSS + vanilla JS) with cinematic animations, themed on the brand's navy & gold logo.

## Run it

No build step. Either:

- Double-click `index.html`, **or**
- Serve the folder (recommended so fonts/maps load without quirks):
  ```powershell
  # Python
  python -m http.server 8080
  # or Node
  npx serve .
  ```
  then open <http://localhost:8080>.

## Pages

| File | Purpose |
|---|---|
| `index.html` | Home — hero, values, services, about, stats, projects, process teaser, Instagram, CTA |
| `about.html` | Story, mission/vision/values, why choose us, stats |
| `process.html` | 9-step construction process as an animated timeline |
| `contact.html` | Contact cards, enquiry form (email / WhatsApp), Google Map, Instagram QR |

Shared code: `css/style.css`, `js/main.js`. Header/footer markup is repeated in each page — edit all four if you change nav/footer text.

## Add the images (important)

Every image slot points to a file in `assets/images/`. Until a file exists, a branded navy placeholder is shown automatically, so nothing looks broken — but drop in the real photos for the finished look. Use JPG (quality ~80, max ~2000px wide) to keep pages fast.

| File name | Suggested photo |
|---|---|
| `hero.jpg` | Marble-clad modern villa render (dusk) — home hero |
| `about-1.jpg` | Independent house exterior (evening render) |
| `about-2.jpg` | Kitchen interior |
| `about-3.jpg` | Living room interior |
| `about-hero.jpg`, `services-hero.jpg`, `projects-hero.jpg`, `process-hero.jpg`, `contact-hero.jpg` | Wide banner images for inner pages (any of the renders / interiors) |
| `cta.jpg` | Any exterior render (used dimmed behind the CTA band) |
| `site-progress.jpg` | The under-construction site photo with the banner |
| `project-1.jpg` … `project-9.jpg` | Project gallery (1 HSR residence, 2 Koramangala interiors, 3 E-City duplex, 4 BTM interior, 5 independent house, 6 kitchen, 7 renovation, 8 residential interior, 9 3D elevation) |
| `service-residential.jpg`, `service-commercial.jpg`, `service-interiors.jpg`, `service-turnkey.jpg`, `service-renovation.jpg`, `service-planning.jpg`, `service-management.jpg` | Services page |
| `process-1.jpg` … `process-9.jpg` | One photo per process step (crop from the process infographic or use site photos) |
| `QR.jpeg` | The Instagram QR code image (already added) |

The logo is drawn as inline SVG (navy/gold) so it stays crisp and adapts to dark/light headers. To use the PNG logo instead, replace the `<svg class="brand__mark">…</svg>` blocks with `<img src="assets/images/logo.png" class="brand__mark" alt="">`.

## Contact form

The form has no backend. "Send Enquiry" opens the visitor's email app with a pre-filled message to `poornimahc.nirmana@gmail.com`; "Send via WhatsApp" opens WhatsApp chat with +91 96060 75204 with the same message.

To receive submissions directly without email apps, sign up at a free form service (e.g. Formspree / Web3Forms), then in `js/main.js` section 14 replace the `mailto:` line with a `fetch()` POST to the endpoint they give you.

## Customising

- Colours & fonts: top of `css/style.css` (`:root` tokens).
- Phone / email / address: search-and-replace across the HTML files.
- Social links: Facebook and LinkedIn currently point to the generic site — update once profiles exist.
- Animations respect the user's "reduce motion" OS setting automatically.

## Deploy

Upload the whole folder to any static host (Netlify, Vercel, GitHub Pages, Hostinger, cPanel `public_html`). No server-side code is needed.
