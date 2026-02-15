
import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, CoursesIcon, ProfileIcon } from './icons';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

const BottomNav: React.FC = () => {
    const { t } = useLanguage();
    const { isAuthenticated } = useAuth();
    
    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        `flex flex-col items-center justify-center w-full pt-2 pb-1 text-xs ${isActive ? 'text-emerald-500' : 'text-slate-500'}`;

    return (
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
            </div>
        </div>
    );
};

export default BottomNav;
