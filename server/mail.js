import nodemailer from 'nodemailer'

function env(key, fallback = '') {
  const v = process.env[key]
  return (typeof v === 'string' ? v.trim() : '') || fallback
}

/** @returns {nodemailer.Transporter | null} null if SMTP is not configured */
function getTransporter() {
  const host = env('SMTP_HOST')
  const user = env('SMTP_USER')
  const pass = env('SMTP_PASS')
  if (!host || !user || !pass) return null
  const port = parseInt(env('SMTP_PORT', '587'), 10) || 587
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  })
}

const MAIL_FROM = env('MAIL_FROM') || env('SMTP_USER') || 'noreply@cvmora.com'

/**
 * Send welcome email when a user creates an account.
 * No-op if SMTP is not configured; logs and ignores errors.
 * @param {string} toEmail
 * @param {string} [name] - User's display name
 */
export async function sendWelcomeEmail(toEmail, name = '') {
  const transporter = getTransporter()
  if (!transporter) {
    console.log('[mail] SMTP not configured (set SMTP_HOST, SMTP_USER, SMTP_PASS). Skipping welcome email.')
    return
  }
  const displayName = (name && name.trim()) ? name.trim() : toEmail.split('@')[0] || 'there'
  const subject = 'Welcome to Cvmora'
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Cvmora</title>
</head>
<body style="margin:0; padding:0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #fafaf9; color: #1c1917;">
  <div style="max-width: 560px; margin: 0 auto; padding: 32px 24px;">
    <div style="background: #fff; border-radius: 16px; padding: 32px 24px; border: 1px solid #e7e5e4;">
      <p style="margin: 0 0 8px 0; font-size: 24px; font-weight: 700; color: #1c1917;">Welcome to Cvmora</p>
      <p style="margin: 0 0 24px 0; font-size: 15px; color: #78716c;">Your account has been created.</p>
      <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.5; color: #44403c;">
        Hi ${displayName},
      </p>
      <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #44403c;">
        Thanks for signing up. You can now build and save resumes, try different templates, and download your CV whenever you need it.
      </p>
      <p style="margin: 0 0 8px 0; font-size: 15px; color: #44403c;">
        <a href="${env('FRONTEND_URL', 'https://cvmora.com')}" style="color: #f97316; font-weight: 600; text-decoration: none;">Go to Cvmora →</a>
      </p>
      <p style="margin: 24px 0 0 0; font-size: 13px; color: #a8a29e;">
        If you didn’t create this account, you can ignore this email.
      </p>
    </div>
    <p style="margin: 24px 0 0 0; font-size: 12px; color: #a8a29e; text-align: center;">
      © ${new Date().getFullYear()} Cvmora · Build resumes that get you hired.
    </p>
  </div>
</body>
</html>
  `.trim()

  try {
    await transporter.sendMail({
      from: `Cvmora <${MAIL_FROM}>`,
      to: toEmail,
      subject,
      html,
      text: `Welcome to Cvmora\n\nHi ${displayName},\n\nThanks for signing up. You can now build and save resumes at ${env('FRONTEND_URL', 'https://cvmora.com')}.\n\n— Cvmora`,
    })
    console.log('[mail] Welcome email sent to', toEmail)
  } catch (err) {
    console.error('[mail] Failed to send welcome email:', err.message)
  }
}

/**
 * Send verification email with link. No-op if SMTP not configured.
 * @param {string} toEmail
 * @param {string} [name]
 * @param {string} verificationLink - Full URL to click (e.g. API_URL + '/api/auth/verify-email?token=' + token)
 */
export async function sendVerificationEmail(toEmail, name = '', verificationLink) {
  const transporter = getTransporter()
  if (!transporter) {
    console.log('[mail] SMTP not configured. Skipping verification email.')
    return
  }
  if (!verificationLink) return
  const displayName = (name && name.trim()) ? name.trim() : toEmail.split('@')[0] || 'there'
  const subject = 'Verify your Cvmora account'
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify your email</title>
</head>
<body style="margin:0; padding:0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #fafaf9; color: #1c1917;">
  <div style="max-width: 560px; margin: 0 auto; padding: 32px 24px;">
    <div style="background: #fff; border-radius: 16px; padding: 32px 24px; border: 1px solid #e7e5e4;">
      <p style="margin: 0 0 8px 0; font-size: 24px; font-weight: 700; color: #1c1917;">Verify your email</p>
      <p style="margin: 0 0 24px 0; font-size: 15px; color: #78716c;">One more step to activate your Cvmora account.</p>
      <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.5; color: #44403c;">
        Hi ${displayName},
      </p>
      <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #44403c;">
        Click the button below to verify your email address. The link is valid for 7 days.
      </p>
      <p style="margin: 0 0 24px 0;">
        <a href="${verificationLink}" style="display: inline-block; padding: 12px 24px; background: #f97316; color: #fff; font-weight: 600; text-decoration: none; border-radius: 8px;">Verify my email</a>
      </p>
      <p style="margin: 0 0 8px 0; font-size: 13px; color: #a8a29e;">
        Or copy and paste this link into your browser:
      </p>
      <p style="margin: 0; font-size: 12px; color: #78716c; word-break: break-all;">${verificationLink}</p>
      <p style="margin: 24px 0 0 0; font-size: 13px; color: #a8a29e;">
        If you didn’t create this account, you can ignore this email.
      </p>
    </div>
    <p style="margin: 24px 0 0 0; font-size: 12px; color: #a8a29e; text-align: center;">
      © ${new Date().getFullYear()} Cvmora
    </p>
  </div>
</body>
</html>
  `.trim()

  try {
    await transporter.sendMail({
      from: `Cvmora <${MAIL_FROM}>`,
      to: toEmail,
      subject,
      html,
      text: `Verify your Cvmora account\n\nHi ${displayName},\n\nClick the link below to verify your email:\n${verificationLink}\n\nThe link is valid for 7 days.\n\n— Cvmora`,
    })
    console.log('[mail] Verification email sent to', toEmail)
  } catch (err) {
    console.error('[mail] Failed to send verification email:', err.message)
  }
}

/**
 * Send password reset email with link. No-op if SMTP not configured.
 * @param {string} toEmail
 * @param {string} resetLink - Full URL (e.g. FRONTEND_URL/reset-password?token=xxx)
 */
export async function sendPasswordResetEmail(toEmail, resetLink) {
  const transporter = getTransporter()
  if (!transporter) {
    console.log('[mail] SMTP not configured. Skipping password reset email.')
    return
  }
  if (!resetLink) return
  const subject = 'Reset your Cvmora password'
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset your password</title>
</head>
<body style="margin:0; padding:0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #fafaf9; color: #1c1917;">
  <div style="max-width: 560px; margin: 0 auto; padding: 32px 24px;">
    <div style="background: #fff; border-radius: 16px; padding: 32px 24px; border: 1px solid #e7e5e4;">
      <p style="margin: 0 0 8px 0; font-size: 24px; font-weight: 700; color: #1c1917;">Reset your password</p>
      <p style="margin: 0 0 24px 0; font-size: 15px; color: #78716c;">You requested a password reset for your Cvmora account.</p>
      <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #44403c;">
        Click the button below to choose a new password. The link expires in 1 hour.
      </p>
      <p style="margin: 0 0 24px 0;">
        <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background: #f97316; color: #fff; font-weight: 600; text-decoration: none; border-radius: 8px;">Reset password</a>
      </p>
      <p style="margin: 0 0 8px 0; font-size: 13px; color: #a8a29e;">
        Or copy and paste this link into your browser:
      </p>
      <p style="margin: 0; font-size: 12px; color: #78716c; word-break: break-all;">${resetLink}</p>
      <p style="margin: 24px 0 0 0; font-size: 13px; color: #a8a29e;">
        If you didn’t request this, you can ignore this email. Your password will stay the same.
      </p>
    </div>
    <p style="margin: 24px 0 0 0; font-size: 12px; color: #a8a29e; text-align: center;">
      © ${new Date().getFullYear()} Cvmora
    </p>
  </div>
</body>
</html>
  `.trim()

  try {
    await transporter.sendMail({
      from: `Cvmora <${MAIL_FROM}>`,
      to: toEmail,
      subject,
      html,
      text: `Reset your Cvmora password\n\nClick the link below to choose a new password (link expires in 1 hour):\n${resetLink}\n\nIf you didn’t request this, ignore this email.\n\n— Cvmora`,
    })
    console.log('[mail] Password reset email sent to', toEmail)
  } catch (err) {
    console.error('[mail] Failed to send password reset email:', err.message)
  }
}
