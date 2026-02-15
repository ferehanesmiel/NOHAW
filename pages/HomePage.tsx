
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
        <div className="relative h-full w-full rounded-lg shadow-lg transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
            {/* Front Face */}
            <div className="absolute inset-0 bg-[var(--bg-primary)] rounded-lg overflow-hidden [backface-visibility:hidden]">
                <img src={article.imageUrl} alt={article.title} className="w-full h-1/2 object-cover" />
                <div className="p-6">
                    <p className="text-sm text-[var(--text-secondary)] mb-2">{new Date(article.date).toLocaleDateString()}</p>
                    <h3 className="font-semibold text-lg text-[var(--text-primary)] mb-2">{article.title}</h3>
                </div>
            </div>
            {/* Back Face */}
            <div className="absolute inset-0 bg-[var(--bg-primary)] rounded-lg p-6 flex flex-col justify-between [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <div>
                    <h3 className="font-semibold text-lg text-[var(--text-primary)] mb-2">Summary</h3>
                    <p className="text-[var(--text-secondary)] text-sm">{article.content}</p>
                </div>
                <button className="elegant-button-outline mt-4 self-start text-sm">Read More</button>
            </div>
        </div>
    </div>
);

const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({ testimonial }) => (
    <div className="group h-64 [perspective:1000px]">
        <div className="relative h-full w-full rounded-lg shadow-lg transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
            {/* Front Face */}
            <div className="absolute inset-0 bg-[var(--bg-primary)] rounded-lg p-6 text-center flex flex-col justify-center items-center [backface-visibility:hidden]">
                <img src={testimonial.imageUrl} alt={testimonial.author} className="w-20 h-20 rounded-full mx-auto mb-4" />
                <p className="font-semibold text-[var(--text-primary)] mt-4">{testimonial.author}</p>
                <p className="text-sm text-[var(--text-secondary)]">{testimonial.role}</p>
            </div>
            {/* Back Face */}
            <div className="absolute inset-0 bg-[var(--bg-primary)] rounded-lg p-8 text-center flex flex-col justify-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <p className="text-[var(--text-secondary)] italic">"{testimonial.quote}"</p>
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
                <div className="relative text-slate-800 overflow-hidden">
                     <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: `url('${heroContent.backgroundImageUrl}')`}}></div>
                    <div className="absolute inset-0 hero-overlay"></div>
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 relative text-center z-10">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">{heroContent.title}</h1>
                        <p className="mt-6 max-w-3xl mx-auto text-lg">{heroContent.subtitle}</p>
                        <div className="mt-10"><Link to={isAuthenticated ? "/dashboard" : "/signup"} className="elegant-button text-lg">{t('getStarted')}</Link></div>
                    </div>
                </div>

                {/* Courses Section */}
                <div className="py-24 bg-[var(--bg-primary)]">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center"><h2 className="text-4xl font-bold text-[var(--text-primary)] tracking-tight">{t('featuredCourses')}</h2></div>
                        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">{courses.slice(0,3).map((course) => (<CourseCard key={course.id} course={course} onEnrollClick={handleEnrollClick} />))}</div>
                    </div>
                </div>

                {/* Testimonials Section */}
                <div className="py-24 bg-[var(--bg-secondary)]">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center"><h2 className="text-4xl font-bold text-[var(--text-primary)] tracking-tight">{t('studentTestimonials')}</h2></div>
                        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-2 max-w-5xl mx-auto">{testimonials.slice(0,2).map((testimonial) => (<TestimonialCard key={testimonial.id} testimonial={testimonial} />))}</div>
                    </div>
                </div>

                {/* News Section */}
                <div className="py-24 bg-[var(--bg-primary)]">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center"><h2 className="text-4xl font-bold text-[var(--text-primary)] tracking-tight">{t('latestNews')}</h2></div>
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