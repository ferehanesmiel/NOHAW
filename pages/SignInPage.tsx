
import * as React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { LogoIcon, GoogleIcon } from '../components/icons';
import TechNetworkArt from '../components/TechNetworkArt';

const SignInPage: React.FC = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const { signIn, isAuthenticated, isAdmin } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();
    
    React.useEffect(() => {
        if (isAuthenticated) {
            navigate(isAdmin ? '/admin' : '/dashboard');
        }
    }, [isAuthenticated, isAdmin, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        
        const result = await signIn(email, password);
        
        if (!result.success) {
            setError(result.message || 'Invalid email or password');
            setIsLoading(false);
        }
        // If success, the useEffect above will redirect
    };
    
    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        const result = await signIn('user@google.com', undefined, true);
        if(!result.success) {
            setError(result.message || 'Google Sign In failed');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-slate-50">
            {/* Tech Line Art Side Panel (Rose Theme) */}
            <div className="hidden lg:block relative w-0 flex-1 overflow-hidden bg-slate-900">
                <TechNetworkArt theme="rose" className="w-full h-full" id="signin-art" />
                <div className="absolute bottom-10 left-10 text-white z-10 p-4 max-w-md backdrop-blur-sm bg-black/20 rounded-xl border border-white/10">
                    <p className="font-bold text-3xl mb-2 text-rose-300">The Africa We Want</p>
                    <p className="text-rose-100/80 leading-relaxed">Empowering the future through education and innovation. Agenda 2063.</p>
                </div>
            </div>

            {/* Form Section */}
            <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-[var(--bg-main)]">
                 <div className="mx-auto w-full max-w-sm lg:w-96 bg-[var(--bg-primary)] p-8 rounded-2xl shadow-xl border border-[var(--border-color)]">
                    <div>
                        <Link to="/" className="inline-block mb-6">
                            <LogoIcon />
                        </Link>
                        <h2 className="text-3xl font-bold text-[var(--text-primary)]">{t('signInToAccount')}</h2>
                    </div>

                    <div className="mt-8">
                         <form className="space-y-6" onSubmit={handleSubmit}>
                             <div>
                                <label htmlFor="email" className="block text-sm font-medium text-[var(--text-secondary)] mb-1">{t('email')}</label>
                                <div className="mt-1">
                                    <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="elegant-input"/>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password"  className="block text-sm font-medium text-[var(--text-secondary)] mb-1">{t('password')}</label>
                                 <div className="mt-1">
                                    <input id="password" name="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="elegant-input"/>
                                </div>
                            </div>
                            
                            {error && (
                                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
                                    {error}
                                </div>
                            )}

                            <div>
                                <button type="submit" disabled={isLoading} className="w-full elegant-button disabled:opacity-50 disabled:cursor-not-allowed">
                                    {isLoading ? 'Signing In...' : t('signIn')}
                                </button>
                            </div>
                        </form>

                         <div className="mt-8">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                    <div className="w-full border-t border-slate-300 dark:border-slate-600" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-[var(--bg-primary)] text-[var(--text-secondary)] font-medium z-10">Or continue with</span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <button onClick={handleGoogleSignIn} disabled={isLoading} className="w-full inline-flex justify-center py-2 px-4 border border-[var(--border-color)] rounded-md shadow-sm bg-[var(--bg-primary)] text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors">
                                    <GoogleIcon />
                                    <span>{t('signInWithGoogle')}</span>
                                </button>
                            </div>
                        </div>
                        <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
                            {t('dontHaveAccount')}{' '}
                            <Link to="/signup" className="font-medium text-[--accent] hover:text-[--accent-hover]">
                                {t('signUp')}
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignInPage;
