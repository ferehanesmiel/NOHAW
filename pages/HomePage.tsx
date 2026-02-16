
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
import { doc, collection, onSnapshot } from 'firebase/firestore';
import TechNetworkArt from '../components/TechNetworkArt';

const NewsCard: React.FC<{ article: NewsArticle }> = ({ article }) => (
    <div className="group h-80 [perspective:1000px]">
        <div className="relative h-full w-full rounded-2xl shadow-xl border border-white/20 transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
            {/* Front Face */}
            <div className="absolute inset-0 bg-[var(--bg-primary)] rounded-2xl overflow-hidden [backface-visibility:hidden] flex flex-col">
                <div className="h-1/2 overflow-hidden">
                    <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
                <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                        <p className="text-xs font-bold text-[var(--accent)] mb-2 uppercase tracking-wide">{new Date(article.date).toLocaleDateString()}</p>
                        <h3 className="font-bold text-xl text-[var(--text-primary)] leading-tight">{article.title}</h3>
                    </div>
                    <div className="w-full h-1 bg-gradient-to-r from-[var(--accent)] to-transparent mt-4 rounded-full"></div>
                </div>
            </div>
            {/* Back Face */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-primary)] to-[var(--bg-secondary)] rounded-2xl p-8 flex flex-col justify-between [backface-visibility:hidden] [transform:rotateY(180deg)] border-2 border-[var(--accent)]">
                <div>
                    <h3 className="font-bold text-lg text-[var(--accent)] mb-4">Quick Summary</h3>
                    <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{article.content}</p>
                </div>
                <button className="elegant-button-outline w-full text-sm">Read Full Article</button>
            </div>
        </div>
    </div>
);

const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({ testimonial }) => (
    <div className="group h-72 [perspective:1000px]">
        <div className="relative h-full w-full rounded-2xl shadow-xl transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
            {/* Front Face */}
            <div className="absolute inset-0 bg-white rounded-2xl overflow-hidden [backface-visibility:hidden] border border-slate-200">
                {/* Replaced Image with Tech Art (Amber Theme) */}
                <div className="h-32 w-full relative bg-slate-900">
                    <TechNetworkArt id={testimonial.id} theme="amber" className="w-full h-full" />
                    <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
                         <div className="w-20 h-20 rounded-full border-4 border-white bg-slate-800 flex items-center justify-center shadow-md overflow-hidden">
                             {/* Use initials if no image, or just show art */}
                             {testimonial.imageUrl && !testimonial.imageUrl.includes('ui-avatars') ? (
                                <img src={testimonial.imageUrl} alt={testimonial.author} className="w-full h-full object-cover"/>
                             ) : (
                                <span className="text-2xl font-bold text-amber-500">{testimonial.author.charAt(0)}</span>
                             )}
                         </div>
                    </div>
                </div>
                
                <div className="pt-12 pb-6 px-6 text-center">
                    <p className="font-bold text-xl text-slate-800">{testimonial.author}</p>
                    <p className="text-sm text-amber-600 font-medium uppercase tracking-wide">{testimonial.role}</p>
                </div>
            </div>

            {/* Back Face */}
            <div className="absolute inset-0 bg-amber-500 rounded-2xl p-8 text-center flex flex-col justify-center items-center [backface-visibility:hidden] [transform:rotateY(180deg)] shadow-xl relative overflow-hidden">
                <TechNetworkArt id={testimonial.id + 'back'} theme="amber" className="absolute inset-0 opacity-20" />
                <div className="relative z-10">
                    <svg className="w-8 h-8 text-white/60 mb-4 mx-auto" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z"></path></svg>
                    <p className="text-white text-lg font-medium italic leading-relaxed">"{testimonial.quote}"</p>
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
    const [heroContent, setHeroContent] = React.useState<HeroContent>({
      title: 'Design Your Future.',
      subtitle: 'Discover curated courses in technology and design, crafted to elevate your skills and professional life.',
      backgroundImageUrl: '',
    });

    React.useEffect(() => {
        // Real-time Hero Content
        const unsubHero = onSnapshot(doc(db, 'settings', 'hero'), (docSnap) => {
            if (docSnap.exists()) {
                setHeroContent(docSnap.data() as HeroContent);
            }
        }, (error) => console.error("Error fetching hero data:", error));

        // Real-time News
        const unsubNews = onSnapshot(collection(db, 'news'), (snapshot) => {
            setNews(snapshot.docs.map(d => ({id:d.id, ...d.data()} as NewsArticle)));
        }, (error) => console.error("Error fetching news:", error));

        // Real-time Testimonials
        const unsubTestimonials = onSnapshot(collection(db, 'testimonials'), (snapshot) => {
            setTestimonials(snapshot.docs.map(d => ({id:d.id, ...d.data()} as Testimonial)));
        }, (error) => console.error("Error fetching testimonials:", error));

        return () => {
            unsubHero();
            unsubNews();
            unsubTestimonials();
        };
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
        <div className="bg-[var(--bg-main)]">
            <Header />
            <main className="pt-20">
                {/* Hero Section with Tech Line Art Background (Blue Theme) */}
                <div className="relative overflow-hidden h-[600px] bg-slate-900">
                    <TechNetworkArt theme="blue" className="absolute inset-0 w-full h-full" id="hero-main" />
                    
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-[var(--bg-main)]"></div>

                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center relative z-10 text-center">
                        <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter text-white mb-6 animate-fade-in-up">
                            {heroContent.title}
                        </h1>
                        <p className="mt-4 max-w-3xl mx-auto text-xl text-blue-100 font-light leading-relaxed drop-shadow-md animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                            {heroContent.subtitle}
                        </p>
                        <div className="mt-10 flex justify-center gap-6 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                            <Link to={isAuthenticated ? "/dashboard" : "/signup"} className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold text-lg shadow-[0_0_20px_rgba(37,99,235,0.5)] transition-all hover:scale-105">
                                {t('getStarted')}
                            </Link>
                            {!isAuthenticated && (
                                <Link to="/signin" className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 rounded-full font-bold text-lg transition-all hover:scale-105">
                                    {t('signIn')}
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Courses Section */}
                <div className="py-24 bg-[var(--bg-primary)]">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-[var(--text-primary)] tracking-tight mb-4">{t('featuredCourses')}</h2>
                            <div className="w-24 h-1.5 bg-[var(--accent)] mx-auto rounded-full"></div>
                        </div>
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">{courses.slice(0,3).map((course) => (<CourseCard key={course.id} course={course} onEnrollClick={handleEnrollClick} />))}</div>
                    </div>
                </div>

                {/* Testimonials Section */}
                <div className="py-24 bg-[var(--bg-secondary)] relative overflow-hidden">
                    {/* Decorative Blob */}
                    <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-amber-500 opacity-5 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 rounded-full bg-orange-500 opacity-5 blur-3xl"></div>
                    
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-[var(--text-primary)] tracking-tight mb-4">{t('studentTestimonials')}</h2>
                             <div className="w-24 h-1.5 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto rounded-full"></div>
                        </div>
                        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-2 max-w-5xl mx-auto">{testimonials.slice(0,2).map((testimonial) => (<TestimonialCard key={testimonial.id} testimonial={testimonial} />))}</div>
                    </div>
                </div>

                {/* News Section */}
                <div className="py-24 bg-[var(--bg-primary)]">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-[var(--text-primary)] tracking-tight mb-4">{t('latestNews')}</h2>
                             <div className="w-24 h-1.5 bg-[var(--accent)] mx-auto rounded-full"></div>
                        </div>
                        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-2 max-w-5xl mx-auto">{news.slice(0,2).map((article) => (<NewsCard key={article.id} article={article} />))}</div>
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
        </div>
    );
};

export default HomePage;
