const INDEXNOW_KEY = 'c25f56ae71d415ddc0d266beb46763b5'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.computertraining.nl'

export async function pingIndexNow(urls: string[]): Promise<{ success: boolean; error?: string }> {
  if (urls.length === 0) return { success: true }

  const fullUrls = urls.map(u => u.startsWith('http') ? u : `${SITE_URL}${u}`)

  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        host: 'www.computertraining.nl',
        key: INDEXNOW_KEY,
        keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: fullUrls,
      }),
    })

    if (res.ok || res.status === 202) {
      return { success: true }
    }

    return { success: false, error: `IndexNow returned ${res.status}` }
  } catch (err) {
    return { success: false, error: String(err) }
  }
}
