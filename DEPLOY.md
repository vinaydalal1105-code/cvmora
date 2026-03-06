# Deploying to cvmora.com (Vercel)

The app is set up to deploy **frontend + API** on Vercel so everything runs on **cvmora.com**.

## What gets deployed

- **Frontend**: Vite build → served from `dist/`, SPA fallback to `index.html`.
- **API**: Node serverless function at `/api/*` (auth, resumes, cover letters, upload, jobs) using the same Express app.

## Vercel environment variables

In the Vercel project (**Settings → Environment Variables**), set these for **Production** (and Preview if you want):

| Variable | Description | Example |
|----------|-------------|---------|
| `FRONTEND_URL` | Full URL of the site | `https://cvmora.com` |
| `API_URL` | Full URL of the API (same origin when on Vercel) | `https://cvmora.com` |
| `JWT_SECRET` | Secret for session tokens | (generate a long random string) |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | (from Google Cloud Console) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | |
| `LINKEDIN_CLIENT_ID` | LinkedIn OAuth app ID (optional) | |
| `LINKEDIN_CLIENT_SECRET` | LinkedIn OAuth secret (optional) | |
| `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` | For verification & password-reset emails (optional) | e.g. Gmail SMTP |
| `SQLITE_PATH` | Optional; defaults to `/tmp/cvmora.db` on Vercel | `/tmp/cvmora.db` |

**OAuth redirect URIs** (in Google/LinkedIn consoles):

- Google: `https://cvmora.com/api/auth/google/callback`
- LinkedIn: `https://cvmora.com/api/auth/linkedin/callback`

## Database on Vercel

The API uses SQLite with `SQLITE_PATH` defaulting to `/tmp/cvmora.db` on Vercel. `/tmp` is **ephemeral**: data can be lost between cold starts or deployments. For production with persistent data, use a hosted database (e.g. [Vercel Postgres](https://vercel.com/storage/postgres), [Turso](https://turso.tech)) and switch the server to that client.

## Deploy

1. Push to your Git repo (GitHub/GitLab/Bitbucket).
2. In Vercel, import the project or connect the repo if already linked.
3. Set the env vars above.
4. Deploy (or rely on automatic deploys on push).

The frontend will call `/api/...` on the same origin (cvmora.com), so no `VITE_API_URL` is needed in production.
