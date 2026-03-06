import { Router } from 'express'
import { findOrCreateOAuthUser } from '../auth.js'
import { sendWelcomeEmail } from '../mail.js'

export const oauthRouter = Router()

function env(key, fallback = '') {
  return (process.env[key] || fallback).replace(/\/$/, '')
}

function getRedirectUri(path) {
  const base = env('API_URL') || `http://localhost:${process.env.PORT || 3001}`
  return `${base}/api/auth${path}`
}

/** Redirect to Google consent */
oauthRouter.get('/google', (req, res) => {
  try {
    const frontend = env('FRONTEND_URL', 'http://localhost:5173')
    const clientId = env('GOOGLE_CLIENT_ID')
    if (!clientId) {
      console.error('[OAuth] GOOGLE_CLIENT_ID is missing. Check server/.env or .env')
      return res.redirect(frontend + '/login?error=Google+sign-in+not+configured')
    }
    const redirectUri = getRedirectUri('/google/callback')
    const scope = encodeURIComponent('email profile')
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`
    return res.redirect(url)
  } catch (e) {
    console.error('[OAuth /google]', e)
    const frontend = env('FRONTEND_URL', 'http://localhost:5173')
    return res.redirect(frontend + '/login?error=' + encodeURIComponent(e.message || 'Server error'))
  }
})

/** Google callback: exchange code, get profile, create/find user, redirect to app with token */
oauthRouter.get('/google/callback', async (req, res) => {
  const frontend = env('FRONTEND_URL', 'http://localhost:5173')
  const { code } = req.query
  if (!code) return res.redirect(frontend + '/login?error=missing_code')
  const clientId = env('GOOGLE_CLIENT_ID')
  const clientSecret = env('GOOGLE_CLIENT_SECRET')
  if (!clientId || !clientSecret) {
    return res.redirect(frontend + '/login?error=Google+sign-in+not+configured')
  }
  const redirectUri = getRedirectUri('/google/callback')
  console.log('[OAuth Google] Exchanging code, redirect_uri=', redirectUri)
  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code: String(code),
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    })
    const raw = await tokenRes.text()
    let tokens
    try {
      tokens = JSON.parse(raw)
    } catch {
      console.error('[OAuth Google] Token response not JSON. Status:', tokenRes.status, 'Body:', raw.slice(0, 300))
      return res.redirect(frontend + '/login?error=' + encodeURIComponent('Google token failed (invalid response)'))
    }
    if (!tokens.access_token) {
      const msg = tokens.error_description || tokens.error || 'Google token failed'
      console.error('[OAuth Google] Token exchange failed. Status:', tokenRes.status, 'Response:', tokens)
      return res.redirect(frontend + '/login?error=' + encodeURIComponent(msg))
    }
    const profileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })
    const profile = await profileRes.json()
    const email = profile.email
    const name = profile.name || ''
    const providerId = profile.id
    if (!email) return res.redirect(frontend + '/login?error=no_email')
    const result = findOrCreateOAuthUser('google', String(providerId), email, name)
    if (result.error) return res.redirect(frontend + '/login?error=' + encodeURIComponent(result.error))
    if (result.isNewUser) {
      sendWelcomeEmail(result.user.email, result.user.name).catch((err) =>
        console.error('[mail] Welcome email failed:', err)
      )
    }
    res.redirect(frontend + '/auth/callback?token=' + encodeURIComponent(result.token))
  } catch (e) {
    res.redirect(frontend + '/login?error=' + encodeURIComponent(e.message || 'Google sign-in failed'))
  }
})

/** Redirect to LinkedIn consent */
oauthRouter.get('/linkedin', (req, res) => {
  const frontend = env('FRONTEND_URL', 'http://localhost:5173')
  const clientId = env('LINKEDIN_CLIENT_ID')
  if (!clientId) {
    return res.redirect(frontend + '/login?error=LinkedIn+sign-in+not+configured')
  }
  const redirectUri = getRedirectUri('/linkedin/callback')
  const scope = encodeURIComponent('openid profile email')
  const state = Math.random().toString(36).slice(2)
  const url = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${state}`
  res.redirect(url)
})

/** LinkedIn callback: exchange code, get profile, create/find user, redirect to app with token */
oauthRouter.get('/linkedin/callback', async (req, res) => {
  const frontend = env('FRONTEND_URL', 'http://localhost:5173')
  const { code } = req.query
  if (!code) return res.redirect(frontend + '/login?error=missing_code')
  const clientId = env('LINKEDIN_CLIENT_ID')
  const clientSecret = env('LINKEDIN_CLIENT_SECRET')
  if (!clientId || !clientSecret) {
    return res.redirect(frontend + '/login?error=LinkedIn+sign-in+not+configured')
  }
  const redirectUri = getRedirectUri('/linkedin/callback')
  try {
    const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: String(code),
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
      }),
    })
    const tokens = await tokenRes.json()
    if (!tokens.access_token) {
      return res.redirect(frontend + '/login?error=LinkedIn+token+failed')
    }
    const profileRes = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })
    const profile = await profileRes.json()
    const email = profile.email
    const name = [profile.given_name, profile.family_name].filter(Boolean).join(' ') || profile.name || ''
    const providerId = profile.sub
    if (!email) return res.redirect(frontend + '/login?error=no_email')
    const result = findOrCreateOAuthUser('linkedin', String(providerId), email, name)
    if (result.error) return res.redirect(frontend + '/login?error=' + encodeURIComponent(result.error))
    if (result.isNewUser) {
      sendWelcomeEmail(result.user.email, result.user.name).catch((err) =>
        console.error('[mail] Welcome email failed:', err)
      )
    }
    res.redirect(frontend + '/auth/callback?token=' + encodeURIComponent(result.token))
  } catch (e) {
    res.redirect(frontend + '/login?error=' + encodeURIComponent(e.message || 'LinkedIn sign-in failed'))
  }
})
