
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BottomNav from '../components/BottomNav';
import PaymentModal from '../components/PaymentModal';
import { useAuth } from '../contexts/AuthContext';
import { useCourse } from '../contexts/CourseContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Course } from '../types';

const UserDashboardPage: React.FC = () => {
    const { user } = useAuth();
    const { t } = useLanguage();
    const { courses, enrollments, enroll, progress } = useCourse();
    const navigate = useNavigate();

    const [isPaymentModalOpen, setPaymentModalOpen] = React.useState(false);
    const [selectedCourse, setSelectedCourse] = React.useState<Course | null>(null);

    const handleEnrollClick = (course: Course) => {
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

    const myCourses = courses.filter(c => enrollments.includes(c.id));
    const freeCourses = courses.filter(c => c.price === 0 && !enrollments.includes(c.id));
    const premiumCourses = courses.filter(c => c.price > 0 && !enrollments.includes(c.id));

    const CourseTable: React.FC<{title: string, courses: Course[], isEnrolledTable?: boolean}> = ({ title, courses, isEnrolledTable }) => (
        <div className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">{title}</h2>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{t('title')}</th>
                                {isEnrolledTable ? (
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{t('progress')}</th>
                                ) : (
                                    <>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{t('teacher')}</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{t('price')}</th>
                                    </>
                                )}
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {courses.map(course => (
                                <tr key={course.id}>
                                    <td className="px-6 py-4 font-medium text-slate-900">{course.title}</td>
                                    {isEnrolledTable ? (
                                        <td className="px-6 py-4"><div className="w-full bg-slate-200 rounded-full h-2.5"><div className="bg-[--accent] h-2.5 rounded-full" style={{width: `${progress[course.id] || 0}%`}}></div></div></td>
                                    ) : (
                                        <>
                                            <td className="px-6 py-4 text-slate-600">{course.teacher}</td>
                                            <td className="px-6 py-4 font-semibold text-slate-800">{course.price > 0 ? `$${course.price}` : t('free')}</td>
                                        </>
                                    )}
                                    <td className="px-6 py-4 text-right">
                                        {isEnrolledTable ? (
                                            <button onClick={() => navigate(`/courses/${course.id}`)} className="elegant-button text-sm">{t('goToCourse')}</button>
                                        ) : (
                                            <button onClick={() => handleEnrollClick(course)} className="elegant-button text-sm">{t('enroll')}</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <Header />
            <main className="flex-grow container mx-auto p-4 sm:p-8 pt-28">
                <h1 className="text-3xl font-bold text-slate-800 mb-2">Welcome back, {user?.username}!</h1>
                <p className="text-slate-600 mb-8">Ready to continue your learning journey?</p>

                {myCourses.length > 0 && <CourseTable title={t('myCourses')} courses={myCourses} isEnrolledTable />}
                {premiumCourses.length > 0 && <CourseTable title={t('premiumCourses')} courses={premiumCourses} />}
                {freeCourses.length > 0 && <CourseTable title={t('freeCourses')} courses={freeCourses} />}
                
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

export default UserDashboardPage;