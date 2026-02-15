
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CourseCard from '../components/CourseCard';
import { useLanguage } from '../contexts/LanguageContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Course, HeroContent } from '../types';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../contexts/AuthContext';

const mockCourses: Course[] = [
    { id: '1', title: 'Python for AI', description: 'Master Python and build intelligent systems with machine learning and deep learning.', category: 'Development', imageUrl: '' },
    { id: '2', title: 'Advanced Networking', description: 'Deep dive into network protocols, security, and infrastructure management.', category: 'IT Ops', imageUrl: '' },
    { id: '3', title: 'Cloud Architecture', description: 'Design and deploy scalable, resilient applications on major cloud platforms.', category: 'Cloud', imageUrl: '' },
];

const HomePage: React.FC = () => {
    const { t } = useLanguage();
    const { isAuthenticated } = useAuth();
    const [courses] = useLocalStorage<Course[]>('courses', mockCourses);
    const [heroContent] = useLocalStorage<HeroContent>('heroContent', {
      title: 'Innovate. Learn. Create.',
      subtitle: 'Step into the future of technology with our industry-leading courses. Your journey to mastery starts now.'
    });

    return (
        <div className="bg-slate-50">
            <Header />
            <main className="pt-20"> {/* Offset for fixed header */}
                {/* Hero Section */}
                <div className="relative glowing-grid text-white overflow-hidden">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 relative text-center z-10">
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight">
                            {heroContent.title}
                        </h1>
                        <p className="mt-6 max-w-3xl mx-auto text-lg text-slate-300">
                            {heroContent.subtitle}
                        </p>
                        <div className="mt-10">
                            <Link to={isAuthenticated ? "/dashboard" : "/signup"} className="tech-glow-button font-semibold py-3 px-8 rounded-full text-lg">
                                {t('getStarted')}
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Courses Section */}
                <div className="py-24 bg-slate-100">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight">{t('featuredCourses')}</h2>
                        </div>
                        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {courses.slice(0,3).map((course, index) => (
                                <CourseCard key={course.id} course={course} color={['blue', 'pink', 'yellow'][index % 3] as 'blue' | 'pink' | 'yellow'} />
                            ))}
                        </div>
                    </div>
                </div>
            </main>
            <div className="pb-16 md:pb-0"></div> {/* Spacer for bottom nav */}
            <Footer />
            <BottomNav />
        </div>
    );
};

export default HomePage;
