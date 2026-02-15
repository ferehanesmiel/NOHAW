
import * as React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeSwitcher from './ThemeSwitcher';
import { LogoIcon } from './icons';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
    const { t } = useLanguage();
    const { user, isAuthenticated, signOut, isAdmin } = useAuth();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = React.useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    const handleSignOut = () => {
        signOut();
        setDropdownOpen(false);
        navigate('/');
    };
    
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        `text-base font-medium transition-colors pb-1 ${isActive ? 'text-[--accent] font-semibold border-b-2 border-[--accent]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`;

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-gray-800">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0">
                            <LogoIcon />
                        </Link>
                        {isAuthenticated && (
                            <nav className="hidden md:flex md:ml-10 md:space-x-8">
                                <NavLink to="/courses" className={navLinkClass}>{t('courses')}</NavLink>
                                <NavLink to="/dashboard" className={navLinkClass}>{t('dashboard')}</NavLink>
                                <NavLink to="/about-us" className={navLinkClass}>{t('aboutUs')}</NavLink>
                                <NavLink to="/support" className={navLinkClass}>{t('support')}</NavLink>
                                {isAdmin && (
                                    <NavLink to="/admin" className={navLinkClass}>Admin</NavLink>
                                )}
                            </nav>
                        )}
                    </div>
                    <div className="flex items-center space-x-4">
                        <ThemeSwitcher />
                        <LanguageSwitcher />
                        {isAuthenticated && user ? (
                            <div className="relative" ref={dropdownRef}>
                                <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center space-x-2">
                                    <div className="flex flex-col items-end">
                                        <span className="font-semibold text-slate-700 hidden sm:inline text-sm">{user.username}</span>
                                        {isAdmin && <span className="text-[10px] text-[--accent] font-bold uppercase tracking-wider hidden sm:inline">(Admin)</span>}
                                    </div>
                                     {user.profilePictureUrl ? (
                                        <img src={user.profilePictureUrl} alt={user.username} className="w-9 h-9 rounded-full object-cover border-2 border-slate-300" />
                                     ) : (
                                        <div className="w-9 h-9 bg-slate-200 rounded-full flex items-center justify-center text-[--accent] font-bold border-2 border-slate-300">
                                            {user.username.charAt(0).toUpperCase()}
                                        </div>
                                     )}
                                </button>
                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-slate-200">
                                        {isAdmin && <Link to="/admin" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-[--accent] font-semibold hover:bg-slate-100">{t('adminDashboard')}</Link>}
                                        {!isAdmin && <Link to="/dashboard" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">{t('dashboard')}</Link>}
                                        <Link to="/profile" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">{t('profile')}</Link>
                                        <button onClick={handleSignOut} className="w-full text-left block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">{t('signOut')}</button>
                                    </div>
                                )}
                            </div>
                        ) : (
                             <Link to="/signin" className="elegant-button">
                               {t('signIn')}
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
