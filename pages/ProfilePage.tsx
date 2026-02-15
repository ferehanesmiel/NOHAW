
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const ProfilePage: React.FC = () => {
    const { user, updateUser, changePassword } = useAuth();
    const { t } = useLanguage();
    
    // User details state
    const [username, setUsername] = useState(user?.username || '');
    const [email, setEmail] = useState(user?.email || '');
    const [detailsSuccessMessage, setDetailsSuccessMessage] = useState('');

    // Password change state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    const [isPasswordError, setIsPasswordError] = useState(false);


    useEffect(() => {
        setUsername(user?.username || '');
        setEmail(user?.email || '');
    }, [user]);

    const handleDetailsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateUser(username);
        setDetailsSuccessMessage(t('profileUpdated'));
        setTimeout(() => setDetailsSuccessMessage(''), 3000);
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsPasswordError(false);
        setPasswordMessage('');

        if (newPassword !== confirmNewPassword) {
            setIsPasswordError(true);
            setPasswordMessage(t('passwordMismatch'));
            return;
        }

        const success = changePassword(currentPassword, newPassword);
        if (success) {
            setIsPasswordError(false);
            setPasswordMessage(t('passwordChangedSuccess'));
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        } else {
            setIsPasswordError(true);
            setPasswordMessage(t('incorrectPassword'));
        }
    };
    
    return (
        <div className="flex flex-col min-h-screen bg-slate-100">
            <Header />
            <main className="flex-grow container mx-auto p-8 pt-28">
                <div className="max-w-2xl mx-auto space-y-8">
                    {/* Profile Details Form */}
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <h1 className="text-3xl font-bold text-slate-800 text-center mb-6">
                            {t('profile')}
                        </h1>
                        {detailsSuccessMessage && (
                            <div className="bg-emerald-100 border-l-4 border-emerald-500 text-emerald-700 p-4 mb-6" role="alert">
                                <p>{detailsSuccessMessage}</p>
                            </div>
                        )}
                        <form onSubmit={handleDetailsSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-slate-700">{t('username')}</label>
                                <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"/>
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700">{t('email')}</label>
                                <input type="email" id="email" value={email} className="mt-1 block w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-md shadow-sm sm:text-sm" readOnly />
                            </div>
                            <div className="flex justify-end">
                                <button type="submit" className="tech-glow-button py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md">
                                    {t('saveChanges')}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Change Password Form */}
                    <div className="bg-white rounded-lg shadow-lg p-8">
                         <h2 className="text-2xl font-bold text-slate-800 text-center mb-6">
                            {t('changePassword')}
                        </h2>
                        {passwordMessage && (
                            <div className={`p-4 mb-6 rounded-md text-sm ${isPasswordError ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                {passwordMessage}
                            </div>
                        )}
                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="currentPassword">{t('currentPassword')}</label>
                                <input type="password" id="currentPassword" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm" required/>
                            </div>
                             <div>
                                <label htmlFor="newPassword">{t('newPassword')}</label>
                                <input type="password" id="newPassword" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm" required/>
                            </div>
                             <div>
                                <label htmlFor="confirmNewPassword">{t('confirmNewPassword')}</label>
                                <input type="password" id="confirmNewPassword" value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm" required/>
                            </div>
                             <div className="flex justify-end pt-2">
                                <button type="submit" className="tech-glow-button py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md">
                                    {t('changePassword')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
            <div className="pb-16 md:pb-0"></div>
            <Footer />
            <BottomNav />
        </div>
    );
};

export default ProfilePage;
