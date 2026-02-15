
import * as React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Testimonial } from '../types';
import { db } from '../firebase';
import { doc, getDocs, setDoc, deleteDoc, collection } from 'firebase/firestore';

const ProfilePage: React.FC = () => {
    const { user, updateProfile, changePassword } = useAuth();
    const { t } = useLanguage();
    
    // User details state
    const [username, setUsername] = React.useState(user?.username || '');
    const [email, setEmail] = React.useState(user?.email || '');
    const [bio, setBio] = React.useState(user?.bio || '');
    const [profilePicture, setProfilePicture] = React.useState<string | null>(user?.profilePictureUrl || null);
    const [detailsSuccessMessage, setDetailsSuccessMessage] = React.useState('');

    // Password change state
    const [currentPassword, setCurrentPassword] = React.useState('');
    const [newPassword, setNewPassword] = React.useState('');
    const [confirmNewPassword, setConfirmNewPassword] = React.useState('');
    const [passwordMessage, setPasswordMessage] = React.useState('');
    const [isPasswordError, setIsPasswordError] = React.useState(false);
    
    // Testimonial State
    const [testimonials, setTestimonials] = React.useState<Testimonial[]>([]);
    const [myQuote, setMyQuote] = React.useState('');
    const [myRole, setMyRole] = React.useState('');
    const [existingTestimonialId, setExistingTestimonialId] = React.useState<string | null>(null);
    const [testimonialMessage, setTestimonialMessage] = React.useState('');

    React.useEffect(() => {
        if (user) {
            setUsername(user.username || '');
            setEmail(user.email || '');
            setBio(user.bio || '');
            setProfilePicture(user.profilePictureUrl || null);
        }
    }, [user]);

    React.useEffect(() => {
        const fetchTestimonials = async () => {
            const querySnapshot = await getDocs(collection(db, 'testimonials'));
            const list = querySnapshot.docs.map(d => ({id:d.id, ...d.data()} as Testimonial));
            setTestimonials(list);
            
            if(user) {
                const myT = list.find(t => t.author === user.username);
                if (myT) {
                    setMyQuote(myT.quote);
                    setMyRole(myT.role);
                    setExistingTestimonialId(myT.id);
                }
            }
        };
        fetchTestimonials();
    }, [user]);
    
    const handleDetailsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await updateProfile({
            username,
            bio,
            profilePictureUrl: profilePicture || undefined
        });
        setDetailsSuccessMessage(t('profileUpdated'));
        setTimeout(() => setDetailsSuccessMessage(''), 3000);
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsPasswordError(false);
        setPasswordMessage('');

        if (newPassword !== confirmNewPassword) {
            setIsPasswordError(true);
            setPasswordMessage(t('passwordMismatch'));
            return;
        }

        const success = await changePassword(currentPassword, newPassword);
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
    
    const handleTestimonialSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !myQuote || !myRole) return;

        if (existingTestimonialId) {
             const updated = {
                id: existingTestimonialId,
                author: user.username,
                role: myRole,
                quote: myQuote,
                imageUrl: user.profilePictureUrl || 'https://ui-avatars.com/api/?name=' + user.username
            };
            await setDoc(doc(db, 'testimonials', existingTestimonialId), updated);
            setTestimonialMessage('Testimonial updated successfully!');
        } else {
            const id = Date.now().toString();
            const newTestimonial: Testimonial = {
                id,
                author: user.username,
                role: myRole,
                quote: myQuote,
                imageUrl: user.profilePictureUrl || `https://ui-avatars.com/api/?name=${user.username.replace(' ', '+')}&background=random`
            };
            await setDoc(doc(db, 'testimonials', id), newTestimonial);
            setExistingTestimonialId(id);
            setTestimonialMessage('Testimonial submitted successfully!');
        }
        setTimeout(() => setTestimonialMessage(''), 3000);
    };

    const handleDeleteTestimonial = async () => {
        if(!existingTestimonialId || !window.confirm('Are you sure you want to delete your testimonial?')) return;
        
        await deleteDoc(doc(db, 'testimonials', existingTestimonialId));
        setMyQuote('');
        setMyRole('');
        setExistingTestimonialId(null);
        setTestimonialMessage('Testimonial deleted.');
        setTimeout(() => setTestimonialMessage(''), 3000);
    }
    
    return (
        <div className="flex flex-col min-h-screen bg-slate-100">
            <Header />
            <main className="flex-grow container mx-auto p-4 sm:p-8 pt-28">
                <div className="max-w-2xl mx-auto space-y-8">
                    {/* Profile Details Form */}
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <h1 className="text-3xl font-bold text-slate-800 text-center mb-6">{t('profile')}</h1>
                        {detailsSuccessMessage && (<div className="bg-emerald-100 border-l-4 border-emerald-500 text-emerald-700 p-4 mb-6" role="alert"><p>{detailsSuccessMessage}</p></div>)}
                        <form onSubmit={handleDetailsSubmit} className="space-y-6">
                            <div className="flex items-center space-x-6">
                                <div className="shrink-0">
                                    {profilePicture ? (
                                        <img className="h-20 w-20 object-cover rounded-full" src={profilePicture} alt="Current profile" />
                                    ) : (
                                        <div className="h-20 w-20 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 text-3xl font-bold">
                                            {username.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <label htmlFor="profilePicUrl" className="block text-sm font-medium text-slate-700">Profile Picture URL</label>
                                    <input 
                                        type="text" 
                                        id="profilePicUrl" 
                                        value={profilePicture || ''} 
                                        onChange={(e) => setProfilePicture(e.target.value)} 
                                        className="mt-1 elegant-input"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-slate-700">{t('username')}</label>
                                <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="mt-1 elegant-input"/>
                            </div>
                             <div>
                                <label htmlFor="bio" className="block text-sm font-medium text-slate-700">Bio</label>
                                <textarea id="bio" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} className="mt-1 elegant-input" placeholder="Tell us a little about yourself..."></textarea>
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700">{t('email')}</label>
                                <input type="email" id="email" value={email} className="mt-1 elegant-input bg-slate-200" readOnly />
                            </div>
                            <div className="flex justify-end"><button type="submit" className="elegant-button">{t('saveChanges')}</button></div>
                        </form>
                    </div>

                    {/* My Testimonial Form */}
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <h2 className="text-2xl font-bold text-slate-800 text-center mb-6">{existingTestimonialId ? 'Edit Your Testimonial' : 'Add a Testimonial'}</h2>
                        {testimonialMessage && (<div className="bg-emerald-100 border-l-4 border-emerald-500 text-emerald-700 p-4 mb-6" role="alert"><p>{testimonialMessage}</p></div>)}
                        <form onSubmit={handleTestimonialSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="myQuote" className="block text-sm font-medium text-slate-700">Your Quote</label>
                                <textarea id="myQuote" rows={4} value={myQuote} onChange={e => setMyQuote(e.target.value)} className="mt-1 elegant-input" placeholder="What do you think about NOHAW?" required/>
                            </div>
                            <div>
                                <label htmlFor="myRole" className="block text-sm font-medium text-slate-700">Your Role/Job Title</label>
                                <input type="text" id="myRole" value={myRole} onChange={e => setMyRole(e.target.value)} className="mt-1 elegant-input" placeholder="e.g., Software Engineer, Student" required/>
                            </div>
                            <div className="flex justify-end pt-2 space-x-4">
                                {existingTestimonialId && (<button type="button" onClick={handleDeleteTestimonial} className="elegant-button-outline border-red-500 text-red-500 hover:bg-red-500 hover:text-white">Delete</button>)}
                                <button type="submit" className="elegant-button">{existingTestimonialId ? 'Update Testimonial' : 'Submit Testimonial'}</button>
                            </div>
                        </form>
                    </div>

                    {/* Change Password Form */}
                    <div className="bg-white rounded-lg shadow-lg p-8">
                         <h2 className="text-2xl font-bold text-slate-800 text-center mb-6">{t('changePassword')}</h2>
                        {passwordMessage && (<div className={`p-4 mb-6 rounded-md text-sm ${isPasswordError ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>{passwordMessage}</div>)}
                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="currentPassword">{t('currentPassword')}</label>
                                <input type="password" id="currentPassword" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="mt-1 elegant-input" required/>
                            </div>
                             <div>
                                <label htmlFor="newPassword">{t('newPassword')}</label>
                                <input type="password" id="newPassword" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="mt-1 elegant-input" required/>
                            </div>
                             <div>
                                <label htmlFor="confirmNewPassword">{t('confirmNewPassword')}</label>
                                <input type="password" id="confirmNewPassword" value={confirmNewPassword} onChange={e => setConfirmNewPassword(e.target.value)} className="mt-1 elegant-input" required/>
                            </div>
                             <div className="flex justify-end pt-2"><button type="submit" className="elegant-button">{t('changePassword')}</button></div>
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
