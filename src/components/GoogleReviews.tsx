import { Star } from 'lucide-react'
import { GoogleReview } from '@/lib/google-reviews'
import { GoogleReviewsModalTrigger } from './GoogleReviewsModal'

interface GoogleReviewsBadgeProps {
  rating: number
  totalReviews: number
  size?: 'sm' | 'md' | 'lg'
}

export function GoogleReviewsBadge({ rating, totalReviews, size = 'md' }: GoogleReviewsBadgeProps) {
  const starSize = size === 'sm' ? 10 : size === 'md' ? 14 : 18
  const ratingSize = size === 'sm' ? 'text-sm' : size === 'md' ? 'text-lg' : 'text-xl'
  const textSize = size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-sm'

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={starSize}
            className={i < Math.round(rating) ? 'text-accent-500 fill-accent-500' : 'text-zinc-300'}
          />
        ))}
      </div>
      <span className={`font-bold ${ratingSize}`}>{rating}</span>
      {totalReviews > 0 && (
        <span className={`text-zinc-500 ${textSize}`}>&middot; {totalReviews} Google recensies</span>
      )}
    </a>
  )
}

interface GoogleReviewCardProps {
  review: GoogleReview
  variant?: 'white' | 'gray'
}

export function GoogleReviewCard({ review, variant = 'white' }: GoogleReviewCardProps) {
  return (
    <div className={`rounded-xl p-6 flex flex-col ${variant === 'gray' ? 'bg-zinc-50' : 'bg-white border border-zinc-200'}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-sm">
          {review.author_name.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-sm text-zinc-900">{review.author_name}</p>
          <p className="text-xs text-zinc-400">{review.relative_time_description}</p>
        </div>
      </div>
      <div className="flex gap-0.5 mb-3">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={13}
            className={i < review.rating ? 'text-accent-500 fill-accent-500' : 'text-zinc-300'}
          />
        ))}
      </div>
      <p className="text-sm text-zinc-700 leading-relaxed flex-1">
        &ldquo;{review.text}&rdquo;
      </p>
    </div>
  )
}

interface GoogleReviewsSectionProps {
  reviews: GoogleReview[]
  allReviews: GoogleReview[]
  rating: number
  totalReviews: number
  title?: string
  variant?: 'white' | 'gray'
  maxReviews?: number
}

export function GoogleReviewsSection({
  reviews,
  allReviews,
  rating,
  totalReviews,
  title = 'Wat onze deelnemers zeggen',
  variant = 'white',
  maxReviews = 3,
}: GoogleReviewsSectionProps) {
  const displayReviews = reviews.slice(0, maxReviews)

  return (
    <div>
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">{title}</h2>
        <div className="flex items-center justify-center gap-3">
          <GoogleReviewsBadge rating={rating} totalReviews={totalReviews} size="lg" />
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {displayReviews.map((review, i) => (
          <GoogleReviewCard key={i} review={review} variant={variant} />
        ))}
      </div>
      <div className="flex justify-center mt-8">
        <GoogleReviewsModalTrigger
          rating={rating}
          totalReviews={totalReviews}
          allReviews={allReviews}
        />
      </div>
    </div>
  )
}
