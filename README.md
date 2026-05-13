# MaLuDa

IT school based in Batumi, Georgia. Practical courses in Python, SQL, Data Analysis, AWS / GCP / Azure, DevOps, AI and Vibe Coding — live classes, small groups, real projects.

This repository contains the public-facing website and supporting scripts.

## Repository contents

- **`maluda-website/`** — Astro 5 site (dark theme, particles, glassmorphism). Astro DB powers the registration form, course catalog, and live scarcity counter.
- **`generate_pdfs.py`** — utility for generating instructor / student PDFs from source material.
- **`show_greeting.py`** — small CLI greeting helper.

## Running the website locally

Requirements: Node.js 20+ and npm.

```bash
cd maluda-website
npm install
npm run dev
```

The dev server starts at `http://localhost:4321`. The site supports Russian and English; toggle via the navbar language switch.

Environment variables for the registration API (Resend / Telegram / Astro DB) are documented in `maluda-website/.env.example` if present — copy it to `.env` and fill in your own credentials. **Never commit `.env`.**

## Building for production

```bash
cd maluda-website
npm run build      # outputs to maluda-website/dist/
npm run preview    # serves the built site locally
```

## License

All rights reserved.
