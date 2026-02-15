
import * as React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BottomNav from '../components/BottomNav';
import { useCourse } from '../contexts/CourseContext';
import { Course } from '../types';

const CourseDetailPage: React.FC = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const { courses, enrollments, progress, updateProgress } = useCourse();
    
    const [course, setCourse] = React.useState<Course | undefined>(undefined);
    const [isLoading, setIsLoading] = React.useState(true);
    const contentRefs = React.useRef<{ [key: string]: HTMLDivElement | null }>({});

    React.useEffect(() => {
        if (courseId) {
            const foundCourse = courses.find(c => c.id === courseId);
            setCourse(foundCourse);
        }
        setIsLoading(false);
    }, [courseId, courses]);

    // Redirect if user is not enrolled (and the course exists)
    if (!isLoading && course && !enrollments.includes(course.id)) {
        return <Navigate to="/dashboard" replace />;
    }
    
    // Handle case where course is not found
    if (!isLoading && !course) {
        return <Navigate to="/courses" replace />;
    }

    if (isLoading || !course) {
        return <div>Loading...</div>
    }

    const currentProgress = progress[course.id] || 0;

    const handleProgressUpdate = () => {
        const newProgress = currentProgress < 100 ? 100 : 0;
        updateProgress(course.id, newProgress);
    }

    const scrollToBlock = (blockId: string) => {
        contentRefs.current[blockId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-100">
            <Header />
            <main className="flex-grow container mx-auto p-4 sm:p-8 pt-28">
                 <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
                    {/* Sidebar */}
                    {course.content && course.content.length > 0 && (
                        <aside className="lg:w-1/4 lg:sticky top-28 self-start">
                            <div className="bg-white rounded-lg shadow-md p-4">
                                <h3 className="font-bold text-lg mb-4 text-slate-800">Course Navigation</h3>
                                <ul className="space-y-2">
                                    {course.content.map((block, index) => (
                                    <li key={block.id}>
                                        <button 
                                        onClick={() => scrollToBlock(block.id)}
                                        className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                                        >
                                        {`${index + 1}. ${block.type.charAt(0).toUpperCase() + block.type.slice(1)}`}
                                        </button>
                                    </li>
                                    ))}
                                </ul>
                            </div>
                        </aside>
                    )}

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Course Header */}
                        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                            <h1 className="text-4xl font-bold text-slate-800 mb-2">{course.title}</h1>
                            <p className="text-slate-600">By {course.teacher}</p>

                            {/* Progress Bar */}
                            <div className="mt-6">
                                <div className="flex justify-between mb-1">
                                    <span className="text-base font-medium text-slate-700">Your Progress</span>
                                    <span className="text-sm font-medium text-slate-700">{currentProgress}%</span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-2.5">
                                    <div className="bg-[--accent] h-2.5 rounded-full" style={{ width: `${currentProgress}%` }}></div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Course Content */}
                        <div className="bg-white rounded-lg shadow-md p-8">
                            <h2 className="text-2xl font-bold text-slate-800 mb-6">Course Content</h2>
                            <div className="space-y-8 prose max-w-none">
                                {course.content?.map(block => (
                                    <div 
                                        key={block.id}
                                        // FIX: The ref callback function must not return a value. The original implementation implicitly returned the result of the assignment.
                                        ref={el => { contentRefs.current[block.id] = el; }}
                                        className="p-4 border-l-4 border-slate-200"
                                    >
                                        {block.type === 'text' && <p className="text-slate-700">{block.value}</p>}
                                        {block.type === 'image' && <img src={block.value} alt="course content" className="rounded-md shadow-sm" />}
                                        {block.type === 'video' && (
                                            <div className="aspect-w-16 aspect-h-9 not-prose">
                                                <iframe src={block.value} title="Course Video" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full rounded-md shadow-sm"></iframe>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 text-center">
                                <button onClick={handleProgressUpdate} className="elegant-button">
                                    {currentProgress < 100 ? 'Mark as Complete' : 'Reset Progress'}
                                </button>
                            </div>
                        </div>
                    </div>
                 </div>
            </main>
            <div className="pb-16 md:pb-0"></div>
            <Footer />
            <BottomNav />
        </div>
    );
};

export default CourseDetailPage;