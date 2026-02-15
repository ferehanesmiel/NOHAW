
import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CourseCard from '../components/CourseCard';
import PaymentModal from '../components/PaymentModal';
import { useLanguage } from '../contexts/LanguageContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Course, HeroContent, NewsArticle, Testimonial } from '../types';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../contexts/AuthContext';
import { useCourse } from '../contexts/CourseContext';
import { mockNews, mockTestimonials } from '../utils/mockData';

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
    <div className="group h-64 [perspective:1000px]">
        <div className="relative h-full w-full rounded-2xl shadow-lg transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
            {/* Front Face */}
            <div className="absolute inset-0 bg-[var(--bg-primary)] rounded-2xl p-6 text-center flex flex-col justify-center items-center [backface-visibility:hidden] border border-[var(--border-color)] group-hover:border-[var(--accent)] transition-colors">
                <div className="p-1 rounded-full bg-gradient-to-r from-[var(--accent)] to-purple-400 mb-4">
                     <img src={testimonial.imageUrl} alt={testimonial.author} className="w-20 h-20 rounded-full border-4 border-[var(--bg-primary)]" />
                </div>
                <p className="font-bold text-lg text-[var(--text-primary)]">{testimonial.author}</p>
                <p className="text-sm text-[var(--text-secondary)] font-medium">{testimonial.role}</p>
            </div>
            {/* Back Face */}
            <div className="absolute inset-0 bg-[var(--accent)] rounded-2xl p-8 text-center flex flex-col justify-center items-center [backface-visibility:hidden] [transform:rotateY(180deg)] shadow-xl">
                <p className="text-white text-lg font-medium italic">"{testimonial.quote}"</p>
                <div className="mt-4 text-white/80 text-sm">- {testimonial.author}</div>
            </div>
        </div>
    </div>
);

const HomePage: React.FC = () => {
    const { t } = useLanguage();
    const { isAuthenticated } = useAuth();
    const { courses, enroll } = useCourse();
    const navigate = useNavigate();

    const [news] = useLocalStorage<NewsArticle[]>('news', mockNews);
    const [testimonials] = useLocalStorage<Testimonial[]>('testimonials', mockTestimonials);
    const [heroContent] = useLocalStorage<HeroContent>('heroContent', {
      title: 'Design Your Future.',
      subtitle: 'Discover curated courses in technology and design, crafted to elevate your skills and professional life.',
      backgroundImageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80',
    });

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
                {/* Hero Section */}
                <div className="relative overflow-hidden">
                     <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: `url('${heroContent.backgroundImageUrl}')`}}></div>
                    <div className="absolute inset-0 hero-overlay"></div>
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-32 sm:py-48 relative text-center z-10">
                        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white drop-shadow-lg mb-6">{heroContent.title}</h1>
                        <p className="mt-6 max-w-3xl mx-auto text-xl text-slate-100 font-light leading-relaxed drop-shadow-md">{heroContent.subtitle}</p>
                        <div className="mt-12 flex justify-center gap-4">
                            <Link to={isAuthenticated ? "/dashboard" : "/signup"} className="elegant-button text-lg px-8 py-3 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]">
                                {t('getStarted')}
                            </Link>
                            {!isAuthenticated && (
                                <Link to="/signin" className="px-8 py-3 rounded-lg font-semibold text-white border-2 border-white/30 hover:bg-white/10 transition-all backdrop-blur-sm">
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
                    <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-[var(--accent)] opacity-5 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 rounded-full bg-blue-500 opacity-5 blur-3xl"></div>
                    
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-[var(--text-primary)] tracking-tight mb-4">{t('studentTestimonials')}</h2>
                             <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 to-[var(--accent)] mx-auto rounded-full"></div>
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
