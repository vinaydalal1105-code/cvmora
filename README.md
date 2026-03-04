# Cvmora — Resume Builder

A full-stack resume builder inspired by [resume.io](https://resume.io). Create resumes and cover letters, choose templates, export to PDF or Word, and use the job board and interview prep tools.

## Features

### Resume & Cover Letter
- **Resume builder** — Live preview, multiple templates (Professional, Modern, Minimal), add/remove experience and education
- **Cover letter builder** — Write and save cover letters, link to job title and company
- **Download** — PDF (print dialog) and Word (.docx) for both resume and cover letter
- **Upload resume** — Upload a PDF; extracted text is used to prefill your summary (requires server with pdf-parse)

### Account & Data
- **Sign up / Sign in** — Email and password; JWT auth
- **Dashboard** — List of your resumes and cover letters; create new or edit existing
- **Save** — Resumes and cover letters are stored in SQLite (server)

### Other Pages (resume.io-style)
- **Templates** — Browse resume templates
- **Examples** — Resume examples by industry (Nurse, Teacher, Engineer, etc.)
- **Job Board** — Browse remote jobs (powered by Remotive API)
- **Interview Prep** — Practice common interview questions by category
- **Salary Analyzer** — Placeholder and links to external salary tools
- **Resources** — Short list of guides (resume, cover letter, interview, negotiation)

## Run locally

### 1. Install and run the API (backend)

```bash
cd server
npm install
npm run dev
```

API runs at **http://localhost:3001**. Uses SQLite (`server/cvmora.db`).

### 2. Install and run the frontend

In a second terminal:

```bash
cd cvmora   # project root
npm install
npm run dev
```

Open **http://localhost:5173**. The Vite dev server proxies `/api` to the backend.

### 3. Optional: environment

- `server/.env`: `PORT=3001`, `JWT_SECRET=your-secret`, `SQLITE_PATH=./cvmora.db`

## Build for production

```bash
npm run build
```

Serve the `dist/` folder (e.g. with `npm run preview` or any static host). Run the server separately (e.g. `node server/index.js`) and set your frontend’s API base URL if not same origin.

## Stack

- **Frontend:** React 19, TypeScript, Vite 7, Tailwind CSS 4, react-router-dom, react-to-print, docx
- **Backend:** Node.js, Express, SQLite (better-sqlite3), JWT (jsonwebtoken), bcryptjs, multer, pdf-parse (optional)
