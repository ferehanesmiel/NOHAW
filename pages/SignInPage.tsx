
import * as React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { LogoIcon, GoogleIcon } from '../components/icons';

const SignInPage: React.FC = () => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const { signIn, isAuthenticated, isAdmin } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();

    React.useEffect(() => {
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
        <div className="min-h-screen flex bg-slate-50">
            {/* Image Section - Agenda 2063 Art Style */}
            <div className="hidden lg:block relative w-0 flex-1 bg-white overflow-hidden">
                <img
                    className="absolute inset-0 h-full w-full object-cover pencil-art"
                    src="https://images.unsplash.com/photo-15422596594ab-d716d9b3a776?q=80&w=2070&auto=format&fit=crop"
                    alt="African Agenda 2063 Art - Future and Tradition"
                />
                <div className="absolute inset-0 bg-indigo-900/10 mix-blend-multiply"></div>
                <div className="absolute bottom-10 left-10 text-slate-800 bg-white/80 backdrop-blur-sm p-4 rounded-lg max-w-md shadow-lg border border-slate-200">
                    <p className="font-bold text-lg">The Africa We Want</p>
                    <p className="text-sm">Empowering the future through education and innovation. Agenda 2063.</p>
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
                            
                            {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>}

                            <div>
                                <button type="submit" className="w-full elegant-button">
                                    {t('signIn')}
                                </button>
                            </div>
                        </form>

                         <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-[var(--border-color)]" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-[var(--bg-primary)] text-[var(--text-secondary)]">Or continue with</span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <button onClick={handleGoogleSignIn} className="w-full inline-flex justify-center py-2 px-4 border border-[var(--border-color)] rounded-md shadow-sm bg-[var(--bg-primary)] text-sm font-medium text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] transition-colors">
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
