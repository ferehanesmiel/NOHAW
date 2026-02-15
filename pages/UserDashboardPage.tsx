
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const UserDashboardPage: React.FC = () => {
    const { user } = useAuth();
    const { t } = useLanguage();

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <Header />
            <main className="flex-grow container mx-auto p-8 pt-28">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">
                        Welcome back, {user?.username}!
                    </h1>
                    <p className="text-slate-600">
                        Ready to continue your learning journey?
                    </p>
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Link to="/courses" className="bg-emerald-50 p-6 rounded-lg hover:bg-emerald-100 transition-colors">
                            <h2 className="font-bold text-xl text-emerald-800">{t('allCourses')}</h2>
                            <p className="text-emerald-700 mt-1">Browse our full catalog of available courses.</p>
                        </Link>
                         <Link to="/profile" className="bg-blue-50 p-6 rounded-lg hover:bg-blue-100 transition-colors">
                            <h2 className="font-bold text-xl text-blue-800">{t('profile')}</h2>
                            <p className="text-blue-700 mt-1">Update your personal information and settings.</p>
                        </Link>
                    </div>
                </div>
            </main>
            <div className="pb-16 md:pb-0"></div>
            <Footer />
            <BottomNav />
        </div>
    );
};

export default UserDashboardPage;
