import { useState } from 'react';
import { Save, Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import { useAdminHeroSlides, HeroSlide } from '@/hooks/useHeroSlides';
import { useAdminLocale } from '@/contexts/AdminLocaleContext';
import { toast } from 'sonner';

export default function AdminFrontpage() {
  const { slides, isLoading, createSlide, updateSlide, deleteSlide } = useAdminHeroSlides();
  const [pendingChanges, setPendingChanges] = useState<Record<string, Partial<HeroSlide>>>({});
  const { t } = useAdminLocale();

  const handleFieldChange = (id: string, field: keyof HeroSlide, value: string | boolean | number) => {
    setPendingChanges(prev => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  };

  const getFieldValue = (slide: HeroSlide, field: keyof HeroSlide) => {
    return pendingChanges[slide.id]?.[field] ?? slide[field];
  };

  const handleSave = async () => {
    try {
      const updates = Object.entries(pendingChanges).map(([id, changes]) => updateSlide.mutateAsync({ id, ...changes }));
      await Promise.all(updates);
      setPendingChanges({});
      toast.success(t('frontpage.saved'));
    } catch (error) {
      toast.error(t('frontpage.errorSave'));
    }
  };

  const handleAddSlide = async () => {
    try {
      await createSlide.mutateAsync({
        title: 'Ny sektion', subtitle: 'Beskrivelse her',
        button_text: 'Se mere', button_link: '/produkter',
        image_url: '', visible: false, sort_order: slides.length,
      });
      toast.success(t('frontpage.sectionAdded'));
    } catch (error) {
      toast.error(t('frontpage.errorSave'));
    }
  };

  const handleDeleteSlide = async (id: string) => {
    try {
      await deleteSlide.mutateAsync(id);
      setPendingChanges(prev => { const next = { ...prev }; delete next[id]; return next; });
      toast.success(t('frontpage.sectionDeleted'));
    } catch (error) {
      toast.error(t('frontpage.errorSave'));
    }
  };

  const handleToggleVisible = (slide: HeroSlide) => {
    handleFieldChange(slide.id, 'visible', !(getFieldValue(slide, 'visible') as boolean));
  };

  const hasChanges = Object.keys(pendingChanges).length > 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-semibold text-foreground">{t('frontpage.title')}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t('frontpage.subtitle')}</p>
        </div>
        <button
          onClick={handleSave}
          disabled={!hasChanges || updateSlide.isPending}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all rounded-lg ${
            hasChanges ? 'bg-foreground text-background hover:opacity-90' : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
        >
          <Save size={16} /> {updateSlide.isPending ? t('frontpage.saving') : t('frontpage.saveChanges')}
        </button>
      </div>

      <div className="space-y-6">
        {slides.map((slide, i) => (
          <div key={slide.id} className="admin-card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-medium">{t('frontpage.heroSection')} {i + 1}</h3>
              <div className="flex items-center gap-2">
                <button onClick={() => handleToggleVisible(slide)} className={`p-2 transition-colors ${getFieldValue(slide, 'visible') ? 'text-primary' : 'text-muted-foreground'}`} title={getFieldValue(slide, 'visible') ? t('frontpage.visible') : t('frontpage.hidden')}>
                  {getFieldValue(slide, 'visible') ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <button onClick={() => handleDeleteSlide(slide.id)} disabled={deleteSlide.isPending} className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">{t('frontpage.titleLabel')}</label>
                <input value={getFieldValue(slide, 'title') as string} onChange={e => handleFieldChange(slide.id, 'title', e.target.value)} className="w-full bg-background border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">{t('frontpage.subtitleLabel')}</label>
                <textarea value={(getFieldValue(slide, 'subtitle') as string) || ''} onChange={e => handleFieldChange(slide.id, 'subtitle', e.target.value)} rows={2} className="w-full bg-background border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring resize-y" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">{t('frontpage.buttonText')}</label>
                  <input value={(getFieldValue(slide, 'button_text') as string) || ''} onChange={e => handleFieldChange(slide.id, 'button_text', e.target.value)} className="w-full bg-background border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">{t('frontpage.buttonLink')}</label>
                  <input value={(getFieldValue(slide, 'button_link') as string) || ''} onChange={e => handleFieldChange(slide.id, 'button_link', e.target.value)} className="w-full bg-background border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">{t('frontpage.imageUrl')}</label>
                <input value={(getFieldValue(slide, 'image_url') as string) || ''} onChange={e => handleFieldChange(slide.id, 'image_url', e.target.value)} className="w-full bg-background border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring" placeholder="/assets/hero-pillow.jpg" />
              </div>
              {(getFieldValue(slide, 'image_url') as string) && (
                <div className="w-full h-40 bg-secondary overflow-hidden rounded">
                  <img src={getFieldValue(slide, 'image_url') as string} alt="Preview" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                </div>
              )}
            </div>
          </div>
        ))}
        <button onClick={handleAddSlide} disabled={createSlide.isPending} className="w-full border-2 border-dashed border-border rounded p-6 text-sm text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors flex items-center justify-center gap-2">
          <Plus size={16} /> {createSlide.isPending ? t('frontpage.creating') : t('frontpage.addSection')}
        </button>
      </div>
    </div>
  );
}
