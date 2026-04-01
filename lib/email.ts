import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

const FROM_EMAIL = process.env.EMAIL_FROM || 'CloudOS <noreply@cloudos.app>'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://cloudos.app'

export async function sendVerificationEmail(email: string, displayName: string, token: string): Promise<boolean> {
  if (!resend) {
    console.warn('RESEND_API_KEY not set — skipping verification email')
    return false
  }

  const verifyUrl = `${APP_URL}/api/auth/verify?token=${encodeURIComponent(token)}`

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Verify your CloudOS account',
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Verify your CloudOS account</title>
</head>
<body style="margin:0;padding:0;background:#0d1117;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d1117;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#161b22;border-radius:12px;border:1px solid rgba(255,255,255,0.08);overflow:hidden;max-width:560px;">
          <!-- Header -->
          <tr>
            <td style="padding:32px 40px 24px;border-bottom:1px solid rgba(255,255,255,0.06);">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-right:10px;">
                    <svg width="32" height="26" viewBox="0 0 86 72" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g transform="translate(8,8)"><circle cx="30" cy="34" r="19" fill="#93C5FD"/><circle cx="55" cy="41" r="13" fill="#93C5FD"/><rect x="11" y="41" width="57" height="20" rx="10" fill="#93C5FD"/></g>
                      <g transform="translate(5,5)"><circle cx="30" cy="34" r="19" fill="#60A5FA"/><circle cx="55" cy="41" r="13" fill="#60A5FA"/><rect x="11" y="41" width="57" height="20" rx="10" fill="#60A5FA"/></g>
                      <g transform="translate(2,2)"><circle cx="30" cy="34" r="19" fill="#2563EB"/><circle cx="55" cy="41" r="13" fill="#2563EB"/><rect x="11" y="41" width="57" height="20" rx="10" fill="#2563EB"/></g>
                      <g><circle cx="30" cy="34" r="19" fill="#1D4ED8"/><circle cx="55" cy="41" r="13" fill="#1D4ED8"/><rect x="11" y="41" width="57" height="20" rx="10" fill="#1D4ED8"/></g>
                    </svg>
                  </td>
                  <td style="color:#ffffff;font-size:20px;font-weight:700;letter-spacing:-0.3px;">CloudOS</td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              <h1 style="margin:0 0 8px;color:#ffffff;font-size:24px;font-weight:700;">Verify your email</h1>
              <p style="margin:0 0 24px;color:rgba(255,255,255,0.6);font-size:15px;line-height:1.6;">
                Hi ${displayName}, welcome to CloudOS! Click the button below to verify your email address and activate your account.
              </p>
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-radius:8px;background:#0078D4;">
                    <a href="${verifyUrl}" style="display:inline-block;padding:14px 32px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;border-radius:8px;">
                      Verify Email Address
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:24px 0 0;color:rgba(255,255,255,0.4);font-size:13px;line-height:1.5;">
                This link expires in 24 hours. If you didn't create a CloudOS account, you can safely ignore this email.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:16px 40px 24px;border-top:1px solid rgba(255,255,255,0.06);">
              <p style="margin:0;color:rgba(255,255,255,0.25);font-size:12px;">
                CloudOS — Your computer in the cloud. Free forever.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      return false
    }
    return true
  } catch (err) {
    console.error('Email send error:', err)
    return false
  }
}

export async function sendPasswordResetEmail(email: string, displayName: string, token: string): Promise<boolean> {
  if (!resend) {
    console.warn('RESEND_API_KEY not set — skipping password reset email')
    return false
  }

  const resetUrl = `${APP_URL}/auth?mode=reset&token=${encodeURIComponent(token)}`

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Reset your CloudOS password',
      html: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#0d1117;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d1117;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#161b22;border-radius:12px;border:1px solid rgba(255,255,255,0.08);overflow:hidden;max-width:560px;">
          <tr>
            <td style="padding:32px 40px 24px;border-bottom:1px solid rgba(255,255,255,0.06);">
              <span style="color:#ffffff;font-size:20px;font-weight:700;">CloudOS</span>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 40px;">
              <h1 style="margin:0 0 8px;color:#ffffff;font-size:24px;font-weight:700;">Reset your password</h1>
              <p style="margin:0 0 24px;color:rgba(255,255,255,0.6);font-size:15px;line-height:1.6;">
                Hi ${displayName}, click the button below to reset your CloudOS password.
              </p>
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-radius:8px;background:#0078D4;">
                    <a href="${resetUrl}" style="display:inline-block;padding:14px 32px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;border-radius:8px;">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:24px 0 0;color:rgba(255,255,255,0.4);font-size:13px;line-height:1.5;">
                This link expires in 1 hour. If you didn't request a password reset, you can safely ignore this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      return false
    }
    return true
  } catch (err) {
    console.error('Password reset email error:', err)
    return false
  }
}
