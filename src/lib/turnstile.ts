// Server-side Cloudflare Turnstile token verification

const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY

export async function verifyTurnstileToken(token: string | null): Promise<boolean> {
  // If no secret key configured, skip verification (dev mode)
  if (!TURNSTILE_SECRET) return true
  if (!token) return false

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: TURNSTILE_SECRET,
        response: token,
      }),
    })

    const data = await response.json()
    return data.success === true
  } catch (error) {
    console.error('Turnstile verification failed:', error)
    return false
  }
}
