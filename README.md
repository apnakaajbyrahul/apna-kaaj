# APNA KAAJ website: beginner guide
Plain HTML + CSS + JavaScript, multi-page, no install. **Keep the folder structure exactly as is** (extract the zip fully).

## Run locally
Double-click `index.html`.

## Pages & folders
`index.html` · `updates.html` · `gallery.html` · `about.html` · `contact.html` · `privacy.html` · `404.html` · `services/` (4 service pages)
`css/style.css` (colours/spacing in `:root`) · `js/main.js` (**CONFIG: phone, WhatsApp, email, location, requestEndpoint**) · `js/request.js` (request popup) · `js/services.js` · `js/updates.js` · `js/gallery.js` · `assets/`
`robots.txt` allows public indexing; add its Sitemap directive and create `sitemap.xml` after confirming the permanent public URL.

## Images (all local; same file names = automatic replacement; keep each under ~200 KB, WebP)
- `assets/logo/apna-kaaj-logo-light.png` (white text, for dark areas) and `apna-kaaj-logo.png`, `favicon.png`
- `assets/hero/apna-kaaj-shop.webp` (your real shop photo, 1536×1024) and `apna-kaaj-shop-800.webp` (800px version for phones). Keep the 3:2 shape so the signboards are never cropped.
- `assets/services/`: `jan-sewa-kendra`, `studio-printing`, `ro-water`, `digital-library` (1200×675 .webp; also used as page-hero images), plus Studio page: `studio-photography`, `studio-videography`, `studio-drone`, `studio-album`, `studio-cards`, `studio-printing-work` (1200×750)
- `assets/other/`: `ro-jars`, `ro-delivery`, `library-desks` (1200×900). The About page uses your real shop photo (`assets/hero/apna-kaaj-shop.webp`).
- `assets/gallery/`: `wedding-01, wedding-card-01, invitation-01, flex-01, album-01, drone-01, prewedding-01, event-01` (1200×900)
A missing image shows a small placeholder with the file name to add.

## Edit content
- **Services:** `js/services.js`. Add/remove/rename a line inside a category. Studio and RO Water categories also have `img` and `blurb`.
- **Latest updates:** `js/updates.js`. Add or delete one `{...}` object. Current ones are SAMPLE data.
- **Gallery:** put the photo in `assets/gallery/`, add one line in `js/gallery.js`.
- **Phone / WhatsApp / email / location:** top of `js/main.js` (`CONFIG`). Phone = 10 digits.

## Request system (in-site popup → Google Apps Script → Google Sheets)
Every Request / Enquire button opens the popup with the business and service already filled. Until `CONFIG.requestEndpoint` is set, the form runs in **test mode**: it validates but says clearly that nothing was saved, and offers WhatsApp. Success is shown **only** when the endpoint replies `{"ok":true}`.

Data sent (JSON, POST, `Content-Type: text/plain`): `timestamp, requestId, name, mobile, location, business, service, requiredDate, message, status` (status = "New").

When ready: create a Google Sheet with a "Requests" tab and these 10 headings, then Extensions → Apps Script:
```js
function doPost(e){
  const d = JSON.parse(e.postData.contents);
  SpreadsheetApp.openById("YOUR_SHEET_ID").getSheetByName("Requests")
    .appendRow([d.timestamp,d.requestId,d.name,d.mobile,d.location,d.business,d.service,d.requiredDate,d.message,d.status]);
  return ContentService.createTextOutput(JSON.stringify({ok:true,requestId:d.requestId}))
    .setMimeType(ContentService.MimeType.JSON);
}
```
Deploy → New deployment → Web app → Execute as **Me**, access **Anyone** → copy the URL into `requestEndpoint` in `js/main.js`. (No secrets are stored in the website.)

## Deploy to GitHub Pages
1. New repo on github.com → upload everything (folders included, `index.html` at top).
2. Settings → Pages → Deploy from a branch → `main` / root → Save.
3. GitHub Pages displays the published URL under repository Settings → Pages. Add canonical, social-sharing and sitemap URLs only after the permanent public URL is confirmed. To update later, edit files and commit to `main`.
