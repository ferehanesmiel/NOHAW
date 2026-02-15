
import * as React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../types';
import { GlobeIcon, ChevronDownIcon } from './icons';

const languages = [
  { code: Language.EN, name: 'English' },
  { code: Language.AM, name: 'Amharic' },
  { code: Language.OM, name: 'Oromo' },
  { code: Language.TI, name: 'Tigrinya' },
];

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = React.useState(false);

  const selectedLanguage = languages.find(l => l.code === language);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-gray-600 hover:text-emerald-800"
      >
        <GlobeIcon />
        <span className="ml-2 hidden md:inline">{selectedLanguage?.name}</span>
        <ChevronDownIcon />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;