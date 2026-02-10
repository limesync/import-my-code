import { useState } from 'react';
import { useAdminReviews, useUpdateReviewStatus, useDeleteReview } from '@/hooks/useReviews';
import { useAdminLocale } from '@/contexts/AdminLocaleContext';
import { useProducts } from '@/hooks/useProducts';
import { Check, X, Trash2, Star, Clock, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import type { TranslationKey } from '@/i18n/admin';

export default function AdminReviews() {
  const { data: reviews = [], isLoading } = useAdminReviews();
  const { data: products = [] } = useProducts('all');
  const updateStatus = useUpdateReviewStatus();
  const deleteReview = useDeleteReview();
  const { t } = useAdminLocale();
  const [statusFilter, setStatusFilter] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');

  const productMap = Object.fromEntries(products.map(p => [p.id, p]));

  const filtered = reviews.filter(r => {
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    const product = productMap[r.product_id];
    const matchesSearch = !searchQuery || 
      product?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.body?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const counts = reviews.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleApprove = (id: string) => {
    updateStatus.mutate({ id, status: 'approved' }, {
      onSuccess: () => toast.success(t('reviews.approved' as TranslationKey)),
    });
  };

  const handleReject = (id: string) => {
    updateStatus.mutate({ id, status: 'rejected' }, {
      onSuccess: () => toast.success(t('reviews.rejected' as TranslationKey)),
    });
  };

  const handleDelete = (id: string) => {
    deleteReview.mutate(id, {
      onSuccess: () => toast.success(t('reviews.deleted' as TranslationKey)),
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-3xl font-semibold text-foreground">{t('reviews.title' as TranslationKey)}</h1>
        <p className="text-sm text-muted-foreground mt-1">{reviews.length} {t('reviews.total' as TranslationKey)}</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { value: 'pending', label: t('reviews.pending' as TranslationKey) },
          { value: 'approved', label: t('reviews.approvedFilter' as TranslationKey) },
          { value: 'rejected', label: t('reviews.rejectedFilter' as TranslationKey) },
          { value: 'all', label: t('reviews.all' as TranslationKey) },
        ].map(opt => (
          <button
            key={opt.value}
            onClick={() => setStatusFilter(opt.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              statusFilter === opt.value ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            {opt.label} ({opt.value === 'all' ? reviews.length : counts[opt.value] || 0})
          </button>
        ))}
      </div>

      <div className="admin-card mb-6">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder={t('reviews.search' as TranslationKey)} className="pl-10" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="admin-card text-center py-12">
          <p className="text-muted-foreground">{t('reviews.noReviews' as TranslationKey)}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(review => {
            const product = productMap[review.product_id];
            return (
              <div key={review.id} className="admin-card">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map(i => (
                          <Star key={i} size={14} className={i <= review.rating ? 'text-primary fill-primary' : 'text-border'} />
                        ))}
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        review.status === 'approved' ? 'bg-green-100 text-green-800' :
                        review.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {review.status === 'approved' ? t('reviews.approvedFilter' as TranslationKey) :
                         review.status === 'rejected' ? t('reviews.rejectedFilter' as TranslationKey) :
                         t('reviews.pending' as TranslationKey)}
                      </span>
                    </div>
                    {review.title && <p className="font-display font-semibold text-sm mb-1">{review.title}</p>}
                    {review.body && <p className="text-sm text-muted-foreground mb-2">{review.body}</p>}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{product?.title || 'Ukendt produkt'}</span>
                      <span>·</span>
                      <span>{new Date(review.created_at).toLocaleDateString('da-DK', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {review.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(review.id)}
                          className="p-2 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                          title={t('reviews.approve' as TranslationKey)}
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => handleReject(review.id)}
                          className="p-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                          title={t('reviews.reject' as TranslationKey)}
                        >
                          <X size={16} />
                        </button>
                      </>
                    )}
                    {review.status === 'rejected' && (
                      <button
                        onClick={() => handleApprove(review.id)}
                        className="p-2 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                        title={t('reviews.approve' as TranslationKey)}
                      >
                        <Check size={16} />
                      </button>
                    )}
                    {review.status === 'approved' && (
                      <button
                        onClick={() => handleReject(review.id)}
                        className="p-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                        title={t('reviews.reject' as TranslationKey)}
                      >
                        <X size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="p-2 rounded-lg bg-secondary text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                      title={t('reviews.delete' as TranslationKey)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
