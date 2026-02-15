import React, { createContext, useState, useContext, PropsWithChildren } from 'react';
import { Language } from '../types';
import { translations } from '../utils/translations';

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: keyof typeof translations.en) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// FIX: Use PropsWithChildren to correctly type the component with children, resolving a TypeScript error in App.tsx.
export const LanguageProvider = ({ children }: PropsWithChildren) => {
  const [language, setLanguage] = useState<Language>(Language.EN);

  const t = (key: keyof typeof translations.en): string => {
    return translations[language][key] || translations[Language.EN][key];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
