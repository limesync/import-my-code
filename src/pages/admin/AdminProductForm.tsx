import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAdminProduct, useAdminProducts, type AdminVariant } from '@/hooks/useAdminProducts';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import type { Json } from '@/integrations/supabase/types';
import ImageUpload from '@/components/admin/ImageUpload';

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
          title,
          slug,
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
          id,
          title,
          slug,
          description,
          category,
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

  if (isLoading && !isNew) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <button
        onClick={() => navigate('/admin/produkter')}
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider mb-6"
      >
        <ArrowLeft size={14} /> Tilbage til produkter
      </button>

      <h1 className="font-display text-3xl font-semibold text-foreground mb-8">
        {isNew ? 'Nyt produkt' : `Rediger: ${existing?.title}`}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic info */}
        <div className="admin-card space-y-4">
          <h2 className="font-display text-lg font-medium mb-2">Generelt</h2>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Titel</label>
            <input
              value={title}
              onChange={e => handleTitleChange(e.target.value)}
              className="w-full bg-background border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Slug</label>
            <input
              value={slug}
              onChange={e => setSlug(e.target.value)}
              className="w-full bg-background border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Beskrivelse</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={4}
              className="w-full bg-background border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-y"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Kategori</label>
              <input
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-background border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as 'active' | 'draft')}
                className="w-full bg-background border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="active">Aktiv</option>
                <option value="draft">Kladde</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Tags (kommasepareret)</label>
            <input
              value={tags}
              onChange={e => setTags(e.target.value)}
              className="w-full bg-background border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="fx: sand, neutral, geometrisk"
            />
          </div>
        </div>

        {/* Image */}
        <div className="admin-card space-y-4">
          <h2 className="font-display text-lg font-medium mb-2">Billede</h2>
          <div className="grid grid-cols-2 gap-4">
            <ImageUpload
              value={imageUrl}
              onChange={setImageUrl}
            />
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
                  Eller indsæt billede URL
                </label>
                <input
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  className="w-full bg-background border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="https://..."
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Upload et billede eller indsæt en URL. Anbefalede dimensioner: 800x800px
              </p>
            </div>
          </div>
        </div>

        {/* Variants */}
        <div className="admin-card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-medium">Varianter</h2>
            <button
              type="button"
              onClick={addVariant}
              className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              <Plus size={14} /> Tilføj variant
            </button>
          </div>

          {variants.map((variant, i) => (
            <div key={variant.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Variant {i + 1}</span>
                {variants.length > 1 && (
                  <button type="button" onClick={() => removeVariant(i)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Størrelse / Navn</label>
                  <input
                    value={variant.name}
                    onChange={e => updateVariant(i, 'name', e.target.value)}
                    className="w-full bg-background border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="45x45 cm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">SKU</label>
                  <input
                    value={variant.sku}
                    onChange={e => updateVariant(i, 'sku', e.target.value)}
                    className="w-full bg-background border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Pris (kr)</label>
                  <input
                    type="number"
                    value={variant.price}
                    onChange={e => updateVariant(i, 'price', Number(e.target.value))}
                    className="w-full bg-background border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    min={0}
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Sammenlign pris</label>
                  <input
                    type="number"
                    value={variant.compare_at_price || ''}
                    onChange={e => updateVariant(i, 'compare_at_price', e.target.value ? Number(e.target.value) : null)}
                    className="w-full bg-background border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    min={0}
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Lager</label>
                  <input
                    type="number"
                    value={variant.inventory}
                    onChange={e => updateVariant(i, 'inventory', Number(e.target.value))}
                    className="w-full bg-background border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    min={0}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-foreground text-background px-6 py-3 rounded-lg text-sm font-medium uppercase tracking-wider hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isSaving ? 'Gemmer...' : isNew ? 'Opret produkt' : 'Gem ændringer'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/produkter')}
            className="px-6 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Annuller
          </button>
        </div>
      </form>
    </div>
  );
}
