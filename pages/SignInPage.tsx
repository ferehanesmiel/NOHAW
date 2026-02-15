
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { LogoIcon, GoogleIcon } from '../components/icons';

const SignInPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { signIn, isAuthenticated, isAdmin } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate(isAdmin ? '/admin' : '/dashboard');
        }
    }, [isAuthenticated, isAdmin, navigate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const success = signIn(email, password);
        if (!success) {
            setError('Invalid email or password');
        }
    };
    
    const handleGoogleSignIn = () => {
        signIn('user@google.com', undefined, true);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4">
            <div className="w-full max-w-md p-8 space-y-6 bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg">
                <div className="text-center">
                    <Link to="/" className="inline-block">
                        <LogoIcon />
                    </Link>
                    <h2 className="mt-6 text-3xl font-extrabold text-slate-900">{t('signInToAccount')}</h2>
                </div>
                
                <button
                    onClick={handleGoogleSignIn}
                    className="w-full flex justify-center items-center py-2 px-4 border border-slate-300 rounded-md shadow-sm bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                    <GoogleIcon />
                    {t('signInWithGoogle')}
                </button>
                
                <div className="flex items-center justify-center space-x-2">
                    <span className="h-px w-16 bg-slate-300"></span>
                    <span className="text-slate-500 font-normal">OR</span>
                    <span className="h-px w-16 bg-slate-300"></span>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                     <div>
                        <label htmlFor="email" className="sr-only">{t('email')}</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="appearance-none relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-500 text-slate-900 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                            placeholder={t('email')}
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="sr-only">{t('password')}</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="appearance-none relative block w-full px-3 py-2 border border-slate-300 placeholder-slate-500 text-slate-900 rounded-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                            placeholder={t('password')}
                        />
                    </div>

                    {error && <p className="text-sm text-red-600 text-center">{error}</p>}

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                        >
                            {t('signIn')}
                        </button>
                    </div>
                </form>
                <p className="text-center text-sm text-slate-600">
                    {t('dontHaveAccount')}{' '}
                    <Link to="/signup" className="font-medium text-emerald-600 hover:text-emerald-500">
                        {t('signUp')}
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignInPage;
