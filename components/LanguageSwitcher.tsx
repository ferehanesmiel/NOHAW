
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
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const selectedLanguage = languages.find(l => l.code === language) || languages[0];

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center text-gray-600 hover:text-emerald-800 transition-colors px-2 py-1 rounded-md hover:bg-slate-100"
      >
        <GlobeIcon />
        <span className="ml-2 hidden md:inline font-medium">{selectedLanguage?.name}</span>
        <ChevronDownIcon />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 z-50 animate-fade-in-down">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`w-full text-left block px-4 py-2 text-sm transition-colors ${
                language === lang.code 
                  ? 'bg-slate-50 text-[--accent] font-semibold' 
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
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
