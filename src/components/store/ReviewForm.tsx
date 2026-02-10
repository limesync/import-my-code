import { useState } from 'react';
import { useSubmitReview } from '@/hooks/useReviews';
import StarRating from './StarRating';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface ReviewFormProps {
  productId: string;
  userId: string;
  orderId: string;
  onSuccess?: () => void;
}

export default function ReviewForm({ productId, userId, orderId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const submitReview = useSubmitReview();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Vælg venligst en bedømmelse');
      return;
    }
    submitReview.mutate(
      { product_id: productId, user_id: userId, order_id: orderId, rating, title, body },
      {
        onSuccess: () => {
          toast.success('Anmeldelse indsendt! Den vil blive gennemgået inden den vises.');
          onSuccess?.();
        },
        onError: () => toast.error('Kunne ikke indsende anmeldelse'),
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-secondary/30 rounded-2xl p-6">
      <h3 className="font-display text-lg font-semibold">Skriv en anmeldelse</h3>
      
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
          Bedømmelse
        </label>
        <StarRating rating={rating} size={28} interactive onChange={setRating} />
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
          Titel
        </label>
        <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Kort opsummering..." />
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
          Din anmeldelse
        </label>
        <Textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Fortæl andre om din oplevelse..." rows={4} />
      </div>

      <button
        type="submit"
        disabled={submitReview.isPending}
        className="btn-primary px-8 py-3 rounded-full text-sm font-semibold"
      >
        {submitReview.isPending ? 'Indsender...' : 'Indsend anmeldelse'}
      </button>
    </form>
  );
}
