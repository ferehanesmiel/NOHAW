
import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CourseCard from '../components/CourseCard';
import PaymentModal from '../components/PaymentModal';
import { useLanguage } from '../contexts/LanguageContext';
import { Course, HeroContent, NewsArticle, Testimonial } from '../types';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../contexts/AuthContext';
import { useCourse } from '../contexts/CourseContext';
import { db } from '../firebase';
import { doc, collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import TechNetworkArt from '../components/TechNetworkArt';

const NewsDetailModal: React.FC<{ article: NewsArticle; onClose: () => void }> = ({ article, onClose }) => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
        <div className="bg-[var(--bg-primary)] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative animate-scale-up border border-[var(--border-color)]" onClick={e => e.stopPropagation()}>
             {/* Header Image */}
            <div className="h-64 relative overflow-hidden bg-slate-900">
                {article.imageUrl && !article.imageUrl.includes('generated') ? (
                    <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
                ) : (
                    <TechNetworkArt id={article.id} theme="neon-lemon" className="w-full h-full" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                 <button onClick={onClose} className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition-colors z-10 backdrop-blur-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="px-2 py-1 text-xs font-bold uppercase tracking-widest text-slate-900 bg-lime-400 rounded-sm">News</span>
                        <span className="text-sm font-mono text-white/90">{new Date(article.date).toLocaleDateString()}</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight drop-shadow-md">{article.title}</h2>
                </div>
            </div>
            
            <div className="p-8">
                <div className="prose prose-slate dark:prose-invert max-w-none text-[var(--text-secondary)] leading-relaxed">
                    <p className="whitespace-pre-wrap">{article.content}</p>
                </div>
                
                 <div className="mt-8 pt-6 border-t border-[var(--border-color)] flex justify-end">
                    <button onClick={onClose} className="px-6 py-2 border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] rounded-lg transition-colors font-medium">
                        Close
                    </button>
                </div>
            </div>
        </div>
    </div>
);

const NewsCard: React.FC<{ article: NewsArticle; onClick: () => void }> = ({ article, onClick }) => (
    <div className="group flex flex-col h-full bg-[var(--bg-primary)] rounded-2xl overflow-hidden shadow-lg border border-[var(--border-color)] hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1" onClick={onClick}>
        {/* Top: Image/Art Container */}
        <div className="h-48 relative overflow-hidden bg-slate-900">
             {/* If we have a real image, show it. If generated/placeholder, show Art */}
             <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100">
                {article.imageUrl && !article.imageUrl.includes('generated') ? (
                    <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
                ) : (
                    <TechNetworkArt id={article.id} theme="neon-orange" className="w-full h-full" />
                )}
             </div>
             
             {/* Gradient overlay for depth */}
             <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
             
             {/* Date Badge - Now properly formatted and visible */}
             <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-md text-xs font-bold text-slate-800 shadow-sm border border-white/50">
                {new Date(article.date).toLocaleDateString()}
             </div>
        </div>
        
        {/* Bottom: Content (Variable Background) */}
        <div className="p-6 flex flex-col flex-grow">
            <h3 className="font-bold text-xl text-[var(--text-primary)] mb-3 line-clamp-2 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {article.title}
            </h3>
            <p className="text-[var(--text-secondary)] text-sm line-clamp-3 mb-4 flex-grow font-medium">
                {article.content}
            </p>
            
            <div className="mt-auto flex items-center text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider group-hover:gap-2 transition-all gap-1">
                Read Article <span className="text-lg leading-none">→</span>
            </div>
        </div>
    </div>
);

const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({ testimonial }) => (
    <div className="group h-72 [perspective:1000px] cursor-pointer">
        <div className="relative h-full w-full rounded-2xl shadow-xl transition-all duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
            {/* Front Face */}
            <div className="absolute inset-0 bg-[var(--bg-primary)] rounded-2xl overflow-hidden [backface-visibility:hidden] border border-orange-500/20 z-10">
                <div className="h-32 w-full relative bg-slate-900">
                    <TechNetworkArt id={testimonial.id} theme="neon-orange" className="w-full h-full" />
                    <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
                         <div className="w-20 h-20 rounded-full border-4 border-[var(--bg-primary)] bg-slate-800 flex items-center justify-center shadow-md overflow-hidden">
                             {testimonial.imageUrl && !testimonial.imageUrl.includes('ui-avatars') ? (
                                <img src={testimonial.imageUrl} alt={testimonial.author} className="w-full h-full object-cover"/>
                             ) : (
                                <span className="text-2xl font-bold text-orange-500">{testimonial.author.charAt(0)}</span>
                             )}
                         </div>
                    </div>
                </div>
                
                <div className="pt-12 pb-6 px-6 text-center">
                    <p className="font-bold text-xl text-[var(--text-primary)]">{testimonial.author}</p>
                    <p className="text-sm text-orange-600 font-medium uppercase tracking-wide">{testimonial.role}</p>
                </div>
            </div>

            {/* Back Face */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl p-8 text-center flex flex-col justify-center items-center [backface-visibility:hidden] [transform:rotateY(180deg)] shadow-xl overflow-hidden z-10">
                {/* Ensure Tech Art is behind text with low opacity */}
                <div className="absolute inset-0 z-0">
                     <TechNetworkArt id={testimonial.id + 'back'} theme="neon-lemon" className="w-full h-full opacity-30" />
                </div>
                
                <div className="relative z-20">
                    <svg className="w-8 h-8 text-white/80 mb-4 mx-auto" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z"></path></svg>
                    <p className="text-white text-lg font-bold italic leading-relaxed drop-shadow-md">"{testimonial.quote}"</p>
                </div>
            </div>
        </div>
    </div>
);

const HomePage: React.FC = () => {
    const { t } = useLanguage();
    const { isAuthenticated } = useAuth();
    const { courses, enroll } = useCourse();
    const navigate = useNavigate();

    const [news, setNews] = React.useState<NewsArticle[]>([]);
    const [testimonials, setTestimonials] = React.useState<Testimonial[]>([]);
    
    // Stable default text to prevent flickering
    const defaultHeroTitle = 'Design Your Future.';
    const defaultHeroSubtitle = 'Discover curated courses in technology and design, crafted to elevate your skills and professional life.';
    
    const [heroContent, setHeroContent] = React.useState<HeroContent>({
      title: defaultHeroTitle,
      subtitle: defaultHeroSubtitle,
      backgroundImageUrl: '',
    });

    // New state for viewing news article
    const [viewingNews, setViewingNews] = React.useState<NewsArticle | null>(null);

    React.useEffect(() => {
        const unsubHero = onSnapshot(doc(db, 'settings', 'hero'), (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data() as HeroContent;
                setHeroContent({
                    title: data.title || defaultHeroTitle,
                    subtitle: data.subtitle || defaultHeroSubtitle,
                    backgroundImageUrl: data.backgroundImageUrl || ''
                });
            }
        }, (error) => console.error("Error fetching hero data:", error));

        // Using Query to order by date descending so the newest news appears first
        const newsQuery = query(collection(db, 'news'), orderBy('date', 'desc'), limit(4));
        const unsubNews = onSnapshot(newsQuery, (snapshot) => {
            setNews(snapshot.docs.map(d => ({id:d.id, ...d.data()} as NewsArticle)));
        }, (error) => console.error("Error fetching news:", error));

        const unsubTestimonials = onSnapshot(collection(db, 'testimonials'), (snapshot) => {
            setTestimonials(snapshot.docs.map(d => ({id:d.id, ...d.data()} as Testimonial)));
        }, (error) => console.error("Error fetching testimonials:", error));

        return () => { unsubHero(); unsubNews(); unsubTestimonials(); };
    }, []);

    const [isPaymentModalOpen, setPaymentModalOpen] = React.useState(false);
    const [selectedCourse, setSelectedCourse] = React.useState<Course | null>(null);

    const handleEnrollClick = (course: Course) => {
        if (!isAuthenticated) {
            navigate('/signin');
            return;
        }
        if (course.price > 0) {
            setSelectedCourse(course);
            setPaymentModalOpen(true);
        } else {
            enroll(course.id);
            navigate(`/courses/${course.id}`);
        }
    };
    
    const handlePaymentSuccess = () => {
        if (selectedCourse) {
            enroll(selectedCourse.id);
            setPaymentModalOpen(false);
            navigate(`/courses/${selectedCourse.id}`);
        }
    };

    return (
        <div className="bg-[var(--bg-main)] transition-colors duration-300">
            <Header />
            <main className="pt-20">
                {/* Hero Section with Retro Neon Vibe - FORCED VISIBILITY */}
                {/* Fixed height ensures layout stability during loading */}
                <div className="relative overflow-hidden h-[700px] bg-slate-950 flex items-center justify-center">
                    {/* Background Art - z-0 */}
                    <div className="absolute inset-0 z-0">
                         {/* Memoized component to prevent re-render flicker */}
                         <TechNetworkArt theme="retro-mix" className="w-full h-full opacity-60" id="hero-main" />
                    </div>
                    
                    {/* Dark overlay for contrast - z-10 */}
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-[var(--bg-main)] pointer-events-none z-10"></div>

                    {/* Content - z-20 for guaranteed visibility over art/overlay */}
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20 text-center">
                        <div className="max-w-4xl mx-auto">
                            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter text-white mb-8 drop-shadow-[0_0_25px_rgba(255,255,255,0.4)] relative">
                                {heroContent.title}
                            </h1>
                            <p className="mb-10 text-xl sm:text-2xl text-cyan-100 font-light leading-relaxed drop-shadow-lg relative">
                                {heroContent.subtitle}
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center gap-6 relative">
                                <Link to={isAuthenticated ? "/dashboard" : "/signup"} className="px-10 py-5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white rounded-full font-bold text-xl shadow-[0_0_25px_rgba(236,72,153,0.6)] transition-all transform hover:scale-105 border border-white/20">
                                    {t('getStarted')}
                                </Link>
                                {!isAuthenticated && (
                                    <Link to="/signin" className="px-10 py-5 bg-transparent hover:bg-white/10 text-cyan-300 border-2 border-cyan-400 rounded-full font-bold text-xl transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(34,211,238,0.3)] backdrop-blur-sm">
                                        {t('signIn')}
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Courses Section */}
                <div className="py-24 bg-[var(--bg-primary)] transition-colors duration-300">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-[var(--text-primary)] tracking-tight mb-4">{t('featuredCourses')}</h2>
                            <div className="w-24 h-1.5 bg-[var(--accent)] mx-auto rounded-full"></div>
                        </div>
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">{courses.slice(0,3).map((course) => (<CourseCard key={course.id} course={course} onEnrollClick={handleEnrollClick} />))}</div>
                    </div>
                </div>

                {/* Testimonials Section */}
                <div className="py-24 bg-[var(--bg-secondary)] relative overflow-hidden transition-colors duration-300">
                    <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800 opacity-50">
                         {/* Subtle Retro Grid Background */}
                         <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'linear-gradient(#ccc 1px, transparent 1px), linear-gradient(90deg, #ccc 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
                    </div>
                    
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-[var(--text-primary)] tracking-tight mb-4">{t('studentTestimonials')}</h2>
                             <div className="w-24 h-1.5 bg-gradient-to-r from-orange-400 to-yellow-400 mx-auto rounded-full"></div>
                        </div>
                        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-2 max-w-5xl mx-auto">{testimonials.slice(0,2).map((testimonial) => (<TestimonialCard key={testimonial.id} testimonial={testimonial} />))}</div>
                    </div>
                </div>

                {/* News Section */}
                <div className="py-24 bg-[var(--bg-main)] relative overflow-hidden transition-colors duration-300">
                     {/* Background Tech Art for Section - Subtle */}
                     <div className="absolute inset-0 opacity-10 pointer-events-none">
                         <TechNetworkArt id="news-section-bg" theme="indigo" className="w-full h-full" />
                     </div>

                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-[var(--text-primary)] tracking-tight mb-4">{t('latestNews')}</h2>
                             <div className="w-24 h-1.5 bg-indigo-500 mx-auto rounded-full"></div>
                        </div>
                        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-2 max-w-5xl mx-auto">
                            {news.length > 0 ? (
                                news.slice(0,2).map((article) => (
                                    <NewsCard 
                                        key={article.id} 
                                        article={article} 
                                        onClick={() => setViewingNews(article)} 
                                    />
                                ))
                            ) : (
                                <div className="col-span-2 text-center text-[var(--text-secondary)]">No news available.</div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <div className="pb-16 md:pb-0"></div>
            <Footer />
            <BottomNav />
            {isPaymentModalOpen && selectedCourse && (
                <PaymentModal
                    course={selectedCourse}
                    onClose={() => setPaymentModalOpen(false)}
                    onPaymentSuccess={handlePaymentSuccess}
                />
            )}
            {viewingNews && (
                <NewsDetailModal article={viewingNews} onClose={() => setViewingNews(null)} />
            )}
        </div>
    );
};

export default HomePage;