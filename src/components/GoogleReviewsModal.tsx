'use client'

import { useState } from 'react'
import { Star, X, ExternalLink, ArrowRight } from 'lucide-react'
import { GoogleReview } from '@/lib/google-reviews'

const GoogleLogo = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

interface GoogleReviewsModalProps {
  reviews: GoogleReview[]
  rating: number
  totalReviews: number
  allReviews: GoogleReview[]
}

export function GoogleReviewsModalTrigger({
  rating,
  totalReviews,
  allReviews,
}: GoogleReviewsModalProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 mt-6 mx-auto bg-white border-2 border-zinc-200 text-zinc-700 px-6 py-3 rounded-xl font-semibold hover:border-primary-300 hover:text-primary-600 hover:shadow-md transition-all duration-200 group"
      >
        <GoogleLogo />
        Bekijk alle Google reviews
        <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative max-w-2xl mx-auto mt-[6vh] mb-[6vh] px-4 h-[88vh] flex flex-col">
            <div className="bg-white rounded-2xl shadow-2xl shadow-black/20 overflow-hidden border border-zinc-200 flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-300">
              {/* Header */}
              <div className="border-b border-zinc-100 px-6 py-5 shrink-0">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="bg-white rounded-lg p-1.5 border border-zinc-200 shadow-sm">
                        <GoogleLogo />
                      </div>
                      <h2 className="text-lg font-bold text-zinc-900">Google Reviews</h2>
                    </div>
                    <p className="text-sm text-zinc-500">
                      Compu Act Opleidingen op Google
                    </p>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Rating summary */}
                <div className="mt-4 flex items-center gap-6 bg-zinc-50 rounded-xl p-4">
                  <div className="text-center">
                    <div className="text-4xl font-extrabold text-zinc-900">{rating}</div>
                    <div className="flex gap-0.5 mt-1 justify-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < Math.round(rating) ? 'text-accent-500 fill-accent-500' : 'text-zinc-300'}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="h-10 w-px bg-zinc-200" />
                  <div>
                    <div className="text-sm font-semibold text-zinc-900">{totalReviews} recensies</div>
                    <p className="text-xs text-zinc-500 mt-0.5">Bron: Google Maps</p>
                  </div>
                </div>
              </div>

              {/* Reviews list */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <div className="space-y-4">
                  {allReviews.map((review, i) => (
                    <div
                      key={i}
                      className="bg-zinc-50 rounded-xl p-5 hover:bg-zinc-100/80 transition-colors"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        {review.profile_photo_url ? (
                          <img
                            src={review.profile_photo_url}
                            alt={review.author_name}
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold text-sm">
                            {review.author_name.charAt(0)}
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="font-semibold text-sm text-zinc-900">{review.author_name}</p>
                          <p className="text-xs text-zinc-400">{review.relative_time_description}</p>
                        </div>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, j) => (
                            <Star
                              key={j}
                              size={12}
                              className={j < review.rating ? 'text-accent-500 fill-accent-500' : 'text-zinc-300'}
                            />
                          ))}
                        </div>
                      </div>
                      {review.text && (
                        <p className="text-sm text-zinc-700 leading-relaxed">
                          &ldquo;{review.text}&rdquo;
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-zinc-100 px-6 py-4 bg-zinc-50/80 shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <GoogleLogo />
                    <span>Reviews afkomstig van Google Maps</span>
                  </div>
                  <a
                    href="https://www.google.com/maps/place/?q=place_id:ChIJsdIiroz8xUcRE9h7MjoRy4g"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-500 hover:text-primary-600 transition-colors"
                  >
                    Bekijk op Google
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
