
import * as React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { LogoIcon, GoogleIcon } from '../components/icons';

const SignUpPage: React.FC = () => {
    const [username, setUsername] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const { signUp, signIn, isAuthenticated, isAdmin } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();

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
        <div className="min-h-screen flex bg-gray-50">
             <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                 <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div>
                        <Link to="/" className="inline-block mb-6">
                            <LogoIcon />
                        </Link>
                        <h2 className="text-3xl font-bold text-gray-900">{t('signUpForAccount')}</h2>
                    </div>

                    <div className="mt-8">
                         <form className="space-y-6" onSubmit={handleSubmit}>
                             <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700">{t('username')}</label>
                                <div className="mt-1"><input id="username" type="text" required value={username} onChange={(e) => setUsername(e.target.value)} className="elegant-input"/></div>
                            </div>
                             <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">{t('email')}</label>
                                <div className="mt-1"><input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="elegant-input"/></div>
                            </div>
                            <div>
                                <label htmlFor="password"  className="block text-sm font-medium text-gray-700">{t('password')}</label>
                                 <div className="mt-1"><input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="elegant-input"/></div>
                            </div>
                            
                            {error && <p className="text-sm text-red-600">{error}</p>}

                            <div><button type="submit" className="w-full elegant-button">{t('signUp')}</button></div>
                        </form>

                         <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300" /></div>
                                <div className="relative flex justify-center text-sm"><span className="px-2 bg-gray-50 text-gray-500">Or sign up with</span></div>
                            </div>
                            <div className="mt-6">
                                <button onClick={handleGoogleSignIn} className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                    <GoogleIcon /><span>{t('signInWithGoogle')}</span>
                                </button>
                            </div>
                        </div>
                        <p className="mt-6 text-center text-sm text-gray-600">
                            {t('alreadyHaveAccount')}{' '}
                            <Link to="/signin" className="font-medium text-[--accent] hover:text-[--accent-hover]">{t('signIn')}</Link>
                        </p>
                    </div>
                </div>
            </div>
             <div className="hidden lg:block relative w-0 flex-1 bg-gray-800">
                <img className="absolute inset-0 h-full w-full object-cover" src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80" alt="People at a conference" />
            </div>
        </div>
    );
};

export default SignUpPage;