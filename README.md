# ✈️ SEO PDF Suite — TFN Changer + Bulk PDF Maker

> **100% In-Browser • Zero Server Required • Vercel-Ready**

A powerful, zero-dependency document automation suite for SEO professionals. Instantly replace competitor phone numbers (TFNs), bulk-generate branded airline PDFs with smart filename inference, and download everything as a ZIP — all directly in your browser.

---

## 🚀 Live Demo

Deploy this instantly to **Vercel** — just connect your GitHub repo and it works out of the box.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

---

## ✨ Features

### TFN Changer Workspace
- **Smart TFN Detection** — Automatically finds competitor phone numbers in any format (`(855) 123-4567`, `+1 855-123-4567`, etc.)
- **Pattern-Preserving Replacement** — Replaces digits while keeping the exact formatting style of the original number
- **Dual TFN Support** — Alternates between two target numbers across all detected phone numbers
- **Live Preview** — See the formatted output before applying changes
- **One-Click Undo** — Instantly revert any replacement
- **Rich Text Editor** — Full Quill.js editor with formatting, lists, colors

### Bulk PDF Maker Workspace
- **Batch Generation** — Generate 50+ branded airline PDFs from a single master template
- **Smart Filename Inference** — `delta-air` pattern → `alaska-air.pdf`, `copa-air.pdf`, etc. automatically
- **Airline Name Replacement** — Auto-replaces airline names throughout the document
- **Headline Auto-Generation** — Creates unique headlines per airline
- **CSV/Google Sheets Import** — Paste a Google Sheets URL or raw CSV to populate the airline list
- **ZIP Download** — All generated PDFs bundled into a single ZIP

### General
- **Zero Server** — No backend, no Python, no Docker required
- **Dark / Light Theme** — Persisted in localStorage
- **Mobile Responsive** — Works on tablets and large phones

---

## 🛠️ Tech Stack

| Component | Library |
|-----------|---------|
| Rich Text Editor | [Quill.js 1.3.6](https://quilljs.com) |
| PDF Generation | [html2pdf.js 0.10.1](https://github.com/eKoopmans/html2pdf.js) |
| Vector PDF | [pdfmake 0.2.7](http://pdfmake.org) |
| ZIP Bundling | [JSZip 3.10.1](https://stuk.github.io/jszip/) |
| CSV Parsing | [PapaParse 5.4.1](https://www.papaparse.com) |
| Icons | [Font Awesome 6.4](https://fontawesome.com) |
| Fonts | [Inter — Google Fonts](https://fonts.google.com/specimen/Inter) |

**All libraries load from CDN — no `npm install` needed.**

---

## 📦 Deploy to Vercel

### Option 1: One-Click via GitHub
1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import from GitHub
3. Select the repo → click **Deploy**
4. Done! ✅

### Option 2: Vercel CLI
```bash
npm i -g vercel
cd "TFN changer Tool"
vercel --prod
```

> The included `vercel.json` is pre-configured with security headers, asset caching, and clean URL routing.

---

## 🖥️ Run Locally

No build step required — it's plain HTML/CSS/JS.

```bash
# Option A: Python (built-in)
python3 -m http.server 3000

# Option B: Node
npx serve .

# Then open: http://localhost:3000
```

---

## 📁 Project Structure

```
├── index.html          # Main app shell
├── css/
│   └── style.css       # All styles (dark + light theme, responsive)
├── js/
│   └── app.js          # Core app logic (TFN engine, PDF, bulk generator)
├── vercel.json         # Vercel deployment config
├── .gitignore
└── pdf-engine/         # Optional Python/FastAPI backend (local use only)
    ├── Dockerfile
    ├── requirements.txt
    └── app/
        ├── main.py
        └── pdf_service.py
```

> **Note:** The `pdf-engine/` folder is a local-only optional backend that uses LibreOffice for server-side PDF generation. It is **not deployed to Vercel** and is not required for the app to work.

---

## 🔧 Configuration

The app auto-detects its environment:
- **On HTTPS (Vercel):** Pure in-browser PDF generation via `html2pdf.js`
- **On HTTP (localhost):** Attempts to connect to the Python backend at `http://localhost:8000`, falls back to browser engine if unavailable

---

## 📝 License

MIT — free to use, modify, and deploy.
