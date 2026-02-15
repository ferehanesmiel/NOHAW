
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BottomNav from '../components/BottomNav';

const SupportPage: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <Header />
            <main className="flex-grow container mx-auto p-8 pt-28">
                <div className="bg-white rounded-lg shadow p-8">
                    <h1 className="text-3xl font-bold text-slate-800 text-center">Support Center</h1>
                    <p className="mt-4 text-slate-600 text-center max-w-2xl mx-auto">
                        Have questions? We're here to help. Contact us at support@nohaw.com for any inquiries.
                    </p>
                </div>
            </main>
            <div className="pb-16 md:pb-0"></div>
            <Footer />
            <BottomNav />
        </div>
    );
};

export default SupportPage;
