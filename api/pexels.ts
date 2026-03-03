import type { VercelRequest, VercelResponse } from '@vercel/node'

const PEXELS_API_KEY = process.env.PEXELS_API_KEY

interface PexelsPhoto {
  id?: number
  alt?: string
  photographer?: string
  src?: {
    small?: string
    medium?: string
    large?: string
    portrait?: string
  }
}

function parsePexelsPhotos(data: unknown): PexelsPhoto[] {
  if (!data || typeof data !== 'object') return []
  const photos = (data as { photos?: unknown }).photos
  if (!Array.isArray(photos)) return []
  return photos.filter((photo): photo is PexelsPhoto => typeof photo === 'object' && photo !== null)
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!PEXELS_API_KEY) {
    return res.status(500).json({ error: 'PEXELS_API_KEY not configured' })
  }

  const { q, per_page = '6', orientation } = req.query
  if (!q || typeof q !== 'string') {
    return res.status(400).json({ error: 'q (query) is required' })
  }

  const params = new URLSearchParams({ query: q, per_page: String(per_page) })
  if (orientation && typeof orientation === 'string') {
    params.set('orientation', orientation)
  }

  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?${params}`,
      { headers: { Authorization: PEXELS_API_KEY } }
    )

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Pexels API error' })
    }

    const data = await response.json()
    const photos = parsePexelsPhotos(data).map((photo) => ({
      id: photo.id,
      alt: photo.alt,
      photographer: photo.photographer,
      src: {
        small: photo.src?.small || '',
        medium: photo.src?.medium || '',
        large: photo.src?.large || '',
        portrait: photo.src?.portrait || '',
      },
    }))

    return res.status(200).json({ photos })
  } catch {
    return res.status(500).json({ error: 'Failed to fetch from Pexels' })
  }
}
