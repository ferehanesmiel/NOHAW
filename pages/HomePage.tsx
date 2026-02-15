
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CourseCard from '../components/CourseCard';
import { useLanguage } from '../contexts/LanguageContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Course, HeroContent, NewsArticle, Testimonial } from '../types';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../contexts/AuthContext';

const mockCourses: Course[] = [
    { id: '1', title: 'Modern Web Development', description: 'Build dynamic, responsive websites with the latest frameworks and technologies.', category: 'Development', imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60', teacher: 'Alex Doe', duration: '12 Hours', rating: 4.8, price: 50 },
    { id: '2', title: 'UI/UX Design Principles', description: 'Learn the fundamentals of creating beautiful and user-friendly digital products.', category: 'Design', imageUrl: 'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60', teacher: 'Jane Smith', duration: '8 Hours', rating: 4.9, price: 30 },
    { id: '3', title: 'Cloud Computing Essentials', description: 'Understand and leverage the power of cloud infrastructure and services.', category: 'Cloud', imageUrl: 'https://images.unsplash.com/photo-1546900703-cf06143d1239?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60', teacher: 'Sam Wilson', duration: '10 Hours', rating: 4.7, price: 0 },
];

const mockNews: NewsArticle[] = [
    { id: '1', title: 'New Course Launch: Advanced TypeScript', content: 'Explore the full potential of TypeScript with our new advanced course, covering generics, decorators, and more.', imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60', date: '2024-07-20' },
    { id: '2', title: 'Summer Scholarship Program Announced', content: 'We are excited to announce our summer scholarship program for aspiring developers. Apply now!', imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60', date: '2024-07-15' },
];

const mockTestimonials: Testimonial[] = [
    { id: '1', author: 'Sarah Johnson', role: 'Web Developer', quote: 'This platform transformed my career. The hands-on projects and expert instructors were invaluable.', imageUrl: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { id: '2', author: 'Michael Chen', role: 'UX Designer', quote: 'The UI/UX course was brilliant. I learned so much and was able to build a fantastic portfolio.', imageUrl: 'https://randomuser.me/api/portraits/men/32.jpg' },
];

const NewsCard: React.FC<{article: NewsArticle}> = ({ article }) => (
    <div className="elegant-card overflow-hidden">
        <img src={article.imageUrl} alt={article.title} className="w-full h-40 object-cover" />
        <div className="p-6">
            <p className="text-sm text-slate-500 mb-2">{new Date(article.date).toLocaleDateString()}</p>
            <h3 className="font-semibold text-lg text-slate-800 mb-2">{article.title}</h3>
            <p className="text-slate-600 text-sm">{article.content}</p>
        </div>
    </div>
);

const TestimonialCard: React.FC<{testimonial: Testimonial}> = ({ testimonial }) => (
    <div className="elegant-card p-6 text-center">
        <img src={testimonial.imageUrl} alt={testimonial.author} className="w-20 h-20 rounded-full mx-auto mb-4" />
        <p className="text-slate-600 italic">"{testimonial.quote}"</p>
        <p className="font-semibold text-slate-800 mt-4">{testimonial.author}</p>
        <p className="text-sm text-slate-500">{testimonial.role}</p>
    </div>
);

const HomePage: React.FC = () => {
    const { t } = useLanguage();
    const { isAuthenticated } = useAuth();
    const [courses] = useLocalStorage<Course[]>('courses', mockCourses);
    const [news] = useLocalStorage<NewsArticle[]>('news', mockNews);
    const [testimonials] = useLocalStorage<Testimonial[]>('testimonials', mockTestimonials);
    const [heroContent] = useLocalStorage<HeroContent>('heroContent', {
      title: 'Design Your Future.',
      subtitle: 'Discover curated courses in technology and design, crafted to elevate your skills and professional life.',
      backgroundImageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80',
    });

    return (
        <div className="bg-[--bg-primary]">
            <Header />
            <main className="pt-20">
                {/* Hero Section */}
                <div className="relative bg-slate-800 text-slate-800 overflow-hidden">
                     <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: `url('${heroContent.backgroundImageUrl}')`}}></div>
                    <div className="absolute inset-0 bg-white opacity-80"></div>
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 relative text-center z-10">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">{heroContent.title}</h1>
                        <p className="mt-6 max-w-3xl mx-auto text-lg text-slate-600">{heroContent.subtitle}</p>
                        <div className="mt-10"><Link to={isAuthenticated ? "/dashboard" : "/signup"} className="elegant-button text-lg">{t('getStarted')}</Link></div>
                    </div>
                </div>

                {/* Courses Section */}
                <div className="py-24 bg-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center"><h2 className="text-4xl font-bold text-slate-800 tracking-tight">{t('featuredCourses')}</h2></div>
                        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">{courses.slice(0,3).map((course) => (<CourseCard key={course.id} course={course} />))}</div>
                    </div>
                </div>

                {/* Testimonials Section */}
                <div className="py-24 bg-slate-50">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center"><h2 className="text-4xl font-bold text-slate-800 tracking-tight">{t('studentTestimonials')}</h2></div>
                        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto">{testimonials.slice(0,2).map((testimonial) => (<TestimonialCard key={testimonial.id} testimonial={testimonial} />))}</div>
                    </div>
                </div>

                {/* News Section */}
                <div className="py-24 bg-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center"><h2 className="text-4xl font-bold text-slate-800 tracking-tight">{t('latestNews')}</h2></div>
                        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto">{news.slice(0,2).map((article) => (<NewsCard key={article.id} article={article} />))}</div>
                    </div>
                </div>
            </main>
            <div className="pb-16 md:pb-0"></div>
            <Footer />
            <BottomNav />
        </div>
    );
};

export default HomePage;
