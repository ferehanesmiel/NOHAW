
import * as React from 'react';
import { Language } from '../types';
import { translations } from '../utils/translations';
import { useLocalStorage } from '../hooks/useLocalStorage';

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: keyof typeof translations.en) => string;
};

const LanguageContext = React.createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: React.PropsWithChildren) => {
  // Use local storage to persist language preference
  const [language, setLanguage] = useLocalStorage<Language>('language', Language.EN);

  const t = (key: keyof typeof translations.en): string => {
    // Ensure we have a valid language key, fallback to EN if not found
    const langKey = (Object.values(Language).includes(language) ? language : Language.EN) as keyof typeof translations;
    const translationSet = translations[langKey] || translations[Language.EN];
    return translationSet[key] || translations[Language.EN][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = React.useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
