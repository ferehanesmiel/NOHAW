
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CourseCard from '../components/CourseCard';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Course } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import BottomNav from '../components/BottomNav';

const CoursesPage: React.FC = () => {
    const { t } = useLanguage();
    const [courses] = useLocalStorage<Course[]>('courses', []);

    return (
        <div className="bg-white min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow pt-20"> {/* Offset for fixed header */}
                <div className="py-12 bg-slate-50">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h1 className="text-4xl font-bold text-slate-800 tracking-tight">{t('allCourses')}</h1>
                        </div>
                        {courses.length > 0 ? (
                            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {courses.map((course) => (
                                    <CourseCard key={course.id} course={course} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-center py-12 text-slate-500">{t('noCoursesAvailable')}</p>
                        )}
                    </div>
                </div>
            </main>
            <div className="pb-16 md:pb-0"></div> {/* Spacer for bottom nav */}
            <Footer />
            <BottomNav />
        </div>
    );
};

export default CoursesPage;
