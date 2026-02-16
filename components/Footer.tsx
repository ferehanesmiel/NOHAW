
import * as React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-[var(--bg-primary)] border-t border-[var(--border-color)] pt-12 pb-8 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            {/* Column 1: Links & Brand */}
            <div>
                 <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">NOHAW</h3>
                 <div className="flex flex-col space-y-3">
                    <Link to="/about-us" className="text-[var(--text-secondary)] hover:text-[--accent] text-sm transition-colors">{t('aboutUs')}</Link>
                    <Link to="/support" className="text-[var(--text-secondary)] hover:text-[--accent] text-sm transition-colors">{t('support')}</Link>
                 </div>
            </div>

            {/* Column 2: Founder / Powered By */}
            <div>
                <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-4">Powered By</h3>
                <div className="space-y-2">
                    <p className="text-xl font-black text-[var(--text-primary)] tracking-tight">
                        ZEMEN<span className="text-[--accent]">DIGITAL</span>
                    </p>
                    <div className="text-sm text-[var(--text-secondary)]">
                        <span className="font-semibold text-[var(--text-primary)]">Founder:</span> Ferehan Esmiel
                    </div>
                </div>
            </div>

            {/* Column 3: Contact Info */}
            <div>
                <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-4">Contact Us</h3>
                <div className="space-y-3 text-sm text-[var(--text-secondary)]">
                    <p className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[--accent]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        ASOSA, ETHIOPIA
                    </p>
                    <p className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[--accent]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                        <span>+251 904 276 965 <span className="text-[var(--text-secondary)] mx-1">|</span> +251 472 879 67</span>
                    </p>
                    <p className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[--accent]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        <a href="mailto:esmielferehan@gmail.com" className="hover:text-[--accent] transition-colors">esmielferehan@gmail.com</a>
                    </p>
                </div>
            </div>
        </div>

        <div className="border-t border-[var(--border-color)] pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-[var(--text-secondary)]">
          <p>&copy; {new Date().getFullYear()} NOHAW, Inc. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Empowering the Future.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;