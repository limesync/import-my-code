import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { adminTranslations, type AdminLocale, type TranslationKey } from '@/i18n/admin';

interface AdminLocaleContextType {
  locale: AdminLocale;
  setLocale: (locale: AdminLocale) => void;
  t: (key: TranslationKey) => string;
}

const AdminLocaleContext = createContext<AdminLocaleContextType | null>(null);

export function AdminLocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<AdminLocale>(() => {
    const saved = localStorage.getItem('admin-locale');
    return (saved === 'en' || saved === 'da') ? saved : 'da';
  });

  const setLocale = useCallback((newLocale: AdminLocale) => {
    setLocaleState(newLocale);
    localStorage.setItem('admin-locale', newLocale);
  }, []);

  const t = useCallback((key: TranslationKey): string => {
    return adminTranslations[locale][key] || key;
  }, [locale]);

  return (
    <AdminLocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </AdminLocaleContext.Provider>
  );
}

export function useAdminLocale() {
  const ctx = useContext(AdminLocaleContext);
  if (!ctx) throw new Error('useAdminLocale must be used within AdminLocaleProvider');
  return ctx;
}
