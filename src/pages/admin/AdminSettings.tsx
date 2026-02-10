import { useAdminLocale } from '@/contexts/AdminLocaleContext';
import { Globe } from 'lucide-react';
import { toast } from 'sonner';
import type { AdminLocale } from '@/i18n/admin';

export default function AdminSettings() {
  const { locale, setLocale, t } = useAdminLocale();

  const handleLanguageChange = (newLocale: AdminLocale) => {
    setLocale(newLocale);
    toast.success(t('settings.saved'));
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-foreground">{t('settings.title')}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t('settings.subtitle')}</p>
      </div>

      <div className="admin-card space-y-6">
        <div>
          <h2 className="font-display text-lg font-medium flex items-center gap-2 mb-4">
            <Globe size={20} />
            {t('settings.language')}
          </h2>
          <p className="text-sm text-muted-foreground mb-4">{t('settings.languageDesc')}</p>
          <div className="flex gap-3">
            <button
              onClick={() => handleLanguageChange('da')}
              className={`px-5 py-3 rounded-lg text-sm font-medium transition-all border ${
                locale === 'da'
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-background text-foreground border-border hover:border-foreground/30'
              }`}
            >
              🇩🇰 {t('settings.danish')}
            </button>
            <button
              onClick={() => handleLanguageChange('en')}
              className={`px-5 py-3 rounded-lg text-sm font-medium transition-all border ${
                locale === 'en'
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-background text-foreground border-border hover:border-foreground/30'
              }`}
            >
              🇬🇧 {t('settings.english')}
            </button>
            <button
              onClick={() => handleLanguageChange('ur')}
              className={`px-5 py-3 rounded-lg text-sm font-medium transition-all border ${
                locale === 'ur'
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-background text-foreground border-border hover:border-foreground/30'
              }`}
            >
              🇵🇰 {t('settings.urdu')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
