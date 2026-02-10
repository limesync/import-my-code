import StarRating from './StarRating';
import type { ProductReview } from '@/hooks/useReviews';

interface ReviewListProps {
  reviews: ProductReview[];
}

export default function ReviewList({ reviews }: ReviewListProps) {
  if (!reviews.length) {
    return (
      <p className="text-muted-foreground text-sm py-4">
        Ingen anmeldelser endnu. Vær den første til at anmelde dette produkt!
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map(review => {
        const name = review.profile
          ? `${review.profile.first_name || ''} ${review.profile.last_name || ''}`.trim() || 'Anonym'
          : 'Anonym';
        return (
          <div key={review.id} className="border-b border-border pb-6 last:border-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <StarRating rating={review.rating} size={14} />
                {review.title && (
                  <span className="font-display font-semibold text-sm">{review.title}</span>
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {new Date(review.created_at).toLocaleDateString('da-DK', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
            {review.body && (
              <p className="text-sm text-muted-foreground leading-relaxed mb-2">{review.body}</p>
            )}
            <p className="text-xs text-muted-foreground font-medium">{name}</p>
          </div>
        );
      })}
    </div>
  );
}
