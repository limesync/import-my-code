import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAdminProduct, useAdminProducts, type AdminVariant } from '@/hooks/useAdminProducts';
import { Plus, Trash2, ArrowLeft, GripVertical, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import type { Json } from '@/integrations/supabase/types';
import ImageUpload from '@/components/admin/ImageUpload';
import { useAdminLocale } from '@/contexts/AdminLocaleContext';
import { getProductImage } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';

interface LocalVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  compare_at_price: number | null;
  inventory: number;
  options: Record<string, string>;
}

const emptyVariant = (): LocalVariant => ({
  id: `temp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  name: '',
  sku: '',
  price: 0,
  compare_at_price: null,
  inventory: 0,
  options: { størrelse: '' },
});

export default function AdminProductForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: existing, isLoading } = useAdminProduct(id);
  const { createProduct, updateProduct } = useAdminProducts();
  const { t } = useAdminLocale();
  const isNew = id === 'ny';

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [status, setStatus] = useState<'active' | 'draft'>('draft');
  const [variants, setVariants] = useState<LocalVariant[]>([emptyVariant()]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (existing) {
      setTitle(existing.title);
      setSlug(existing.slug);
      setDescription(existing.description || '');
      setCategory(existing.category || '');
      setTags(existing.tags?.join(', ') || '');
      setImageUrl(existing.images[0]?.url || '');
      setStatus(existing.status === 'archived' ? 'draft' : existing.status as 'active' | 'draft');
      setVariants(existing.variants.length > 0 
        ? existing.variants.map(v => ({
            ...v,
            options: (v.options as Record<string, string>) || { størrelse: '' },
          }))
        : [emptyVariant()]
      );
    }
  }, [existing]);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (isNew) {
      setSlug(value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-æøå]/g, ''));
    }
  };

  const updateVariant = (index: number, field: keyof LocalVariant, value: any) => {
    setVariants(prev => prev.map((v, i) => {
      if (i !== index) return v;
      if (field === 'options') return { ...v, options: value };
      return { ...v, [field]: value };
    }));
  };

  const addVariant = () => setVariants(prev => [...prev, emptyVariant()]);
  const removeVariant = (index: number) => {
    if (variants.length <= 1) return;
    setVariants(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (isNew) {
        await createProduct.mutateAsync({
          title, slug,
          description: description || undefined,
          category: category || undefined,
          tags: tags.split(',').map(t => t.trim()).filter(Boolean),
          status,
          variants: variants.map(v => ({
            name: v.name || v.options.størrelse || 'Standard',
            sku: v.sku || `SKU-${Date.now()}`,
            price: Number(v.price),
            compare_at_price: v.compare_at_price ? Number(v.compare_at_price) : null,
            inventory: Number(v.inventory),
            options: v.options as Json,
          })),
          images: imageUrl ? [{ url: imageUrl, alt: title }] : [],
        });
      } else if (id) {
        await updateProduct.mutateAsync({
          id, title, slug, description, category,
          tags: tags.split(',').map(t => t.trim()).filter(Boolean),
          status,
        });
      }
      navigate('/admin/produkter');
    } catch (error) {
      // Error is handled by mutation
    } finally {
      setIsSaving(false);
    }
  };

  // Resolve the display image
  const displayImage = imageUrl || (!isNew && existing?.slug ? getProductImage(existing.slug) : '');

  if (isLoading && !isNew) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl">
      <button
        onClick={() => navigate('/admin/produkter')}
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider mb-6"
      >
        <ArrowLeft size={14} /> {t('productForm.backToProducts')}
      </button>

      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-semibold text-foreground">
          {isNew ? t('productForm.new') : `${t('productForm.edit')}: ${existing?.title}`}
        </h1>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
            status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}>
            {status === 'active' ? <Eye size={12} /> : <EyeOff size={12} />}
            {status === 'active' ? t('products.active') : t('products.draft')}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left 2/3 */}
          <div className="lg:col-span-2 space-y-6">
            {/* General Info */}
            <div className="admin-card space-y-4">
              <h2 className="font-display text-lg font-medium">{t('productForm.general')}</h2>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">{t('productForm.titleLabel')}</label>
                <input value={title} onChange={e => handleTitleChange(e.target.value)} className="w-full bg-background border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" required placeholder="f.eks. Nordic Sand Pudebetræk" />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">{t('productForm.slug')}</label>
                <input value={slug} onChange={e => setSlug(e.target.value)} className="w-full bg-background border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono text-muted-foreground transition-all" required />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">{t('productForm.description')}</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={6} className="w-full bg-background border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-y transition-all" placeholder="Beskriv produktet i detaljer..." />
              </div>
            </div>

            {/* Media */}
            <div className="admin-card space-y-4">
              <h2 className="font-display text-lg font-medium">{t('productForm.image')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  {displayImage ? (
                    <div className="w-full aspect-square bg-secondary rounded-lg overflow-hidden border border-border">
                      <img src={displayImage} alt={title} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <ImageUpload value="" onChange={setImageUrl} />
                  )}
                </div>
                <div className="space-y-4">
                  {displayImage && <ImageUpload value={imageUrl} onChange={setImageUrl} />}
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">{t('productForm.imageUrlLabel')}</label>
                    <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="w-full bg-background border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="https://..." />
                  </div>
                  <p className="text-xs text-muted-foreground">{t('productForm.imageHelp')}</p>
                </div>
              </div>
            </div>

            {/* Variants */}
            <div className="admin-card space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-medium">{t('productForm.variantsTitle')}</h2>
                <button type="button" onClick={addVariant} className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors">
                  <Plus size={14} /> {t('productForm.addVariant')}
                </button>
              </div>

              <div className="space-y-3">
                {variants.map((variant, i) => (
                  <div key={variant.id} className="border rounded-xl p-4 bg-background/50 space-y-3 hover:border-primary/20 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GripVertical size={14} className="text-muted-foreground/40" />
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t('productForm.variant')} {i + 1}</span>
                      </div>
                      {variants.length > 1 && (
                        <button type="button" onClick={() => removeVariant(i)} className="p-1 text-muted-foreground hover:text-destructive transition-colors rounded">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">{t('productForm.sizeName')}</label>
                        <input value={variant.name} onChange={e => updateVariant(i, 'name', e.target.value)} className="w-full bg-background border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="45x45 cm" />
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">{t('productForm.sku')}</label>
                        <input value={variant.sku} onChange={e => updateVariant(i, 'sku', e.target.value)} className="w-full bg-background border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono transition-all" placeholder="SKU-001" />
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">{t('productForm.priceLabel')}</label>
                        <input type="number" value={variant.price} onChange={e => updateVariant(i, 'price', Number(e.target.value))} className="w-full bg-background border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" min={0} />
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">{t('productForm.comparePrice')}</label>
                        <input type="number" value={variant.compare_at_price || ''} onChange={e => updateVariant(i, 'compare_at_price', e.target.value ? Number(e.target.value) : null)} className="w-full bg-background border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" min={0} />
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">{t('productForm.stockLabel')}</label>
                        <input type="number" value={variant.inventory} onChange={e => updateVariant(i, 'inventory', Number(e.target.value))} className="w-full bg-background border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" min={0} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Right 1/3 */}
          <div className="space-y-6">
            {/* Status & Publish */}
            <div className="admin-card space-y-4">
              <h2 className="font-display text-lg font-medium">{t('productForm.statusLabel')}</h2>
              <select value={status} onChange={e => setStatus(e.target.value as 'active' | 'draft')} className="w-full bg-background border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all">
                <option value="active">{t('products.active')}</option>
                <option value="draft">{t('products.draft')}</option>
              </select>

              <div className="pt-2 space-y-2">
                <Button type="submit" disabled={isSaving} className="w-full gap-2">
                  {isSaving ? t('productForm.saving') : isNew ? t('productForm.create') : t('productForm.save')}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate('/admin/produkter')} className="w-full">
                  {t('productForm.cancelBtn')}
                </Button>
              </div>
            </div>

            {/* Organization */}
            <div className="admin-card space-y-4">
              <h2 className="font-display text-lg font-medium">{t('productForm.categoryLabel')}</h2>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">{t('productForm.categoryLabel')}</label>
                <input value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-background border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder="f.eks. Minimalistisk" />
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">{t('productForm.tags')}</label>
                <input value={tags} onChange={e => setTags(e.target.value)} className="w-full bg-background border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" placeholder={t('productForm.tagsPlaceholder')} />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}