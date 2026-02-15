
import * as React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { LogoIcon, GoogleIcon } from '../components/icons';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { HeroContent } from '../types';

const SignUpPage: React.FC = () => {
    const [username, setUsername] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const { signUp, signIn, isAuthenticated, isAdmin } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();
    
    // Retrieve dynamic images from local storage (managed in Admin)
    const [heroContent] = useLocalStorage<HeroContent>('heroContent', {
      title: 'Design Your Future.',
      subtitle: 'Discover curated courses.',
      backgroundImageUrl: '',
      signUpImageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60'
    });

    React.useEffect(() => {
        if (isAuthenticated) {
            navigate(isAdmin ? '/admin' : '/dashboard');
        }
    }, [isAuthenticated, isAdmin, navigate]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!username || !password || !email) {
            setError('Please fill out all fields.');
            return;
        }
        const success = signUp(email, password, username);
        if(!success) {
            setError('An account with this email already exists.');
        }
    };
    
    const handleGoogleSignIn = () => {
        signIn('user@google.com', undefined, true);
    };

    return (
        <div className="min-h-screen flex bg-slate-50">
             {/* Form Section */}
             <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-[var(--bg-main)]">
                 <div className="mx-auto w-full max-w-sm lg:w-96 bg-[var(--bg-primary)] p-8 rounded-2xl shadow-xl border border-[var(--border-color)]">
                    <div>
                        <Link to="/" className="inline-block mb-6">
                            <LogoIcon />
                        </Link>
                        <h2 className="text-3xl font-bold text-[var(--text-primary)]">{t('signUpForAccount')}</h2>
                    </div>

                    <div className="mt-8">
                         <form className="space-y-6" onSubmit={handleSubmit}>
                             <div>
                                <label htmlFor="username" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">{t('username')}</label>
                                <div className="mt-1"><input id="username" type="text" required value={username} onChange={(e) => setUsername(e.target.value)} className="elegant-input"/></div>
                            </div>
                             <div>
                                <label htmlFor="email" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">{t('email')}</label>
                                <div className="mt-1"><input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="elegant-input"/></div>
                            </div>
                            <div>
                                <label htmlFor="password"  className="block text-sm font-medium text-[var(--text-secondary)] mb-1">{t('password')}</label>
                                 <div className="mt-1"><input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="elegant-input"/></div>
                            </div>
                            
                            {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>}

                            <div><button type="submit" className="w-full elegant-button">{t('signUp')}</button></div>
                        </form>

                         <div className="mt-8">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                    <div className="w-full border-t border-slate-300 dark:border-slate-600" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    {/* FIX: Ensure background matches card background exactly and verify z-index */}
                                    <span className="px-4 bg-[var(--bg-primary)] text-[var(--text-secondary)] font-medium z-10">Or sign up with</span>
                                </div>
                            </div>
                            <div className="mt-6">
                                <button onClick={handleGoogleSignIn} className="w-full inline-flex justify-center py-2 px-4 border border-[var(--border-color)] rounded-md shadow-sm bg-[var(--bg-primary)] text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors">
                                    <GoogleIcon /><span>{t('signInWithGoogle')}</span>
                                </button>
                            </div>
                        </div>
                        <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
                            {t('alreadyHaveAccount')}{' '}
                            <Link to="/signin" className="font-medium text-[--accent] hover:text-[--accent-hover]">{t('signIn')}</Link>
                        </p>
                    </div>
                </div>
            </div>
             {/* Image Section - Agenda 2063 Art Style / Dynamic */}
             <div className="hidden lg:block relative w-0 flex-1 bg-white overflow-hidden">
                <img 
                    className="absolute inset-0 h-full w-full object-cover pencil-art" 
                    src={heroContent.signUpImageUrl || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60'} 
                    alt="African Innovation and Future Art" 
                />
                <div className="absolute inset-0 bg-orange-900/10 mix-blend-multiply"></div>
                <div className="absolute top-10 right-10 text-slate-800 bg-white/80 backdrop-blur-sm p-4 rounded-lg max-w-md shadow-lg border border-slate-200 text-right">
                    <p className="font-bold text-lg">Unity and Progress</p>
                    <p className="text-sm">Building the Africa of 2063 through shared knowledge.</p>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;
