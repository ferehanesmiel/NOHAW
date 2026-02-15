
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CourseCard from '../components/CourseCard';
import PaymentModal from '../components/PaymentModal';
import { useCourse } from '../contexts/CourseContext';
import { useAuth } from '../contexts/AuthContext';
import { Course } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import BottomNav from '../components/BottomNav';

const CoursesPage: React.FC = () => {
    const { t } = useLanguage();
    const { courses, enroll } = useCourse();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

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
                                    <CourseCard key={course.id} course={course} onEnrollClick={handleEnrollClick} />
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

export default CoursesPage;
