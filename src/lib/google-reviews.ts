export interface GoogleReview {
  author_name: string
  rating: number
  text: string
  relative_time_description: string
  time: number
  profile_photo_url?: string
}

export interface GooglePlaceData {
  rating: number
  user_ratings_total: number
  reviews: GoogleReview[]
}

const PLACE_ID = process.env.GOOGLE_PLACE_ID || ''
const API_KEY = process.env.GOOGLE_PLACES_API_KEY || ''

export async function getGoogleReviews(): Promise<GooglePlaceData | null> {
  if (!PLACE_ID || !API_KEY) {
    return null
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=rating,user_ratings_total,reviews&language=nl&reviews_sort=newest&key=${API_KEY}`

    const res = await fetch(url, {
      next: { revalidate: 86400 }, // Cache for 24 hours
    })

    if (!res.ok) return null

    const data = await res.json()

    if (data.status !== 'OK' || !data.result) return null

    return {
      rating: data.result.rating ?? 4.8,
      user_ratings_total: data.result.user_ratings_total ?? 0,
      reviews: (data.result.reviews ?? []).filter(
        (r: GoogleReview) => r.rating >= 4 && r.text.length > 20
      ),
    }
  } catch {
    return null
  }
}

// Fallback data when API is not configured
export const fallbackReviews: GooglePlaceData = {
  rating: 4.8,
  user_ratings_total: 90,
  reviews: [
    {
      author_name: 'Walther Piek',
      rating: 5,
      text: 'De persoonlijke aandacht en het juiste niveau van de training maakten het verschil. Onze medewerkers konden de geleerde vaardigheden direct toepassen.',
      relative_time_description: '2 maanden geleden',
      time: 0,
    },
    {
      author_name: 'Sandra de Vries',
      rating: 5,
      text: 'Uitstekende Excel training. De docent nam ruim de tijd voor persoonlijke vragen en de stof was direct toepasbaar in mijn werk.',
      relative_time_description: '3 maanden geleden',
      time: 0,
    },
    {
      author_name: 'Mark Jansen',
      rating: 5,
      text: 'De incompany training was perfect afgestemd op onze organisatie. Zeer tevreden over de flexibiliteit en kwaliteit.',
      relative_time_description: '4 maanden geleden',
      time: 0,
    },
  ],
}
