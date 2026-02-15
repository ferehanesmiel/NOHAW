
import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import { LogoIcon } from './icons';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
    const { t } = useLanguage();
    const { user, isAuthenticated, signOut, isAdmin } = useAuth();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleSignOut = () => {
        signOut();
        setDropdownOpen(false);
        navigate('/');
    };
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        `text-base font-medium transition-colors ${isActive ? 'text-cyan-400' : 'text-slate-300 hover:text-white'}`;

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/60 backdrop-blur-xl border-b border-slate-700">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0">
                            <LogoIcon />
                        </Link>
                        {isAuthenticated && (
                            <nav className="hidden md:flex md:ml-10 md:space-x-8">
                                <NavLink to="/dashboard" className={navLinkClass}>{t('dashboard')}</NavLink>
                                <NavLink to="/courses" className={navLinkClass}>{t('courses')}</NavLink>
                                <NavLink to="/about-us" className={navLinkClass}>{t('aboutUs')}</NavLink>
                                <NavLink to="/support" className={navLinkClass}>{t('support')}</NavLink>
                            </nav>
                        )}
                    </div>
                    <div className="flex items-center space-x-4">
                        <LanguageSwitcher />
                        {isAuthenticated && user ? (
                            <div className="relative" ref={dropdownRef}>
                                <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center space-x-2">
                                    <span className="font-semibold text-slate-200 hidden sm:inline">{user.username}</span>
                                     <div className="w-9 h-9 bg-slate-700 rounded-full flex items-center justify-center text-cyan-400 font-bold border-2 border-slate-600">
                                        {user.username.charAt(0).toUpperCase()}
                                    </div>
                                </button>
                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-md shadow-lg py-1 z-50 border border-slate-700">
                                        {isAdmin && <Link to="/admin" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white">{t('adminDashboard')}</Link>}
                                        {!isAdmin && <Link to="/dashboard" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white">{t('dashboard')}</Link>}
                                        <Link to="/profile" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white">{t('profile')}</Link>
                                        <button onClick={handleSignOut} className="w-full text-left block px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white">{t('signOut')}</button>
                                    </div>
                                )}
                            </div>
                        ) : (
                             <Link to="/signin" className="tech-glow-button font-semibold py-2 px-5 rounded-full text-sm">
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
