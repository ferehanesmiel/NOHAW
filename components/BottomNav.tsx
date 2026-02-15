
import * as React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { HomeIcon, CoursesIcon, ProfileIcon, MoreIcon } from './icons';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

const BottomNav: React.FC = () => {
    const { t } = useLanguage();
    const { isAuthenticated } = useAuth();
    const [moreMenuOpen, setMoreMenuOpen] = React.useState(false);
    
    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        `flex flex-col items-center justify-center w-full pt-2 pb-1 text-xs ${isActive ? 'text-emerald-500' : 'text-slate-500'}`;

    return (
        <>
            <div className="fixed bottom-0 left-0 right-0 h-16 bg-white/70 backdrop-blur-lg border-t border-slate-200 md:hidden z-40">
                <div className="flex justify-around items-center h-full">
                    <NavLink to="/" className={navLinkClass}>
                        <HomeIcon />
                        <span>{t('home')}</span>
                    </NavLink>
                    <NavLink to="/courses" className={navLinkClass}>
                        <CoursesIcon />
                        <span>{t('courses')}</span>
                    </NavLink>
                    {isAuthenticated && (
                        <NavLink to="/profile" className={navLinkClass}>
                            <ProfileIcon />
                            <span>{t('profile')}</span>
                        </NavLink>
                    )}
                    <button onClick={() => setMoreMenuOpen(!moreMenuOpen)} className="flex flex-col items-center justify-center w-full pt-2 pb-1 text-xs text-slate-500">
                        <MoreIcon />
                        <span>{t('more')}</span>
                    </button>
                </div>
            </div>
            {moreMenuOpen && (
                <div 
                    onClick={() => setMoreMenuOpen(false)} 
                    className="fixed inset-0 bg-black/40 z-30 md:hidden"
                >
                    <div 
                        onClick={(e) => e.stopPropagation()}
                        className="absolute bottom-16 left-0 right-0 bg-white rounded-t-lg p-4"
                    >
                         <Link to="/about-us" className="block w-full text-left py-3 text-slate-700 hover:bg-slate-100 rounded-md px-2">{t('aboutUs')}</Link>
                         <Link to="/support" className="block w-full text-left py-3 text-slate-700 hover:bg-slate-100 rounded-md px-2">{t('support')}</Link>
                    </div>
                </div>
            )}
        </>
    );
};

export default BottomNav;