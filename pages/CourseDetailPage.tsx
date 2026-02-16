
import * as React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BottomNav from '../components/BottomNav';
import { useCourse } from '../contexts/CourseContext';
import { Course } from '../types';
import TechNetworkArt from '../components/TechNetworkArt';

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

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <Header />
            {/* Increased top padding (pt-36) to prevent Header from covering Progress section */}
            <main className="flex-grow container mx-auto p-4 sm:p-8 pt-32">
                 <div className="max-w-5xl mx-auto">
                    {/* Course Header with Tech Art and Progress */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12 border border-slate-200">
                        <div className="h-72 w-full relative bg-slate-900">
                            <TechNetworkArt id={course.id} className="w-full h-full" theme="indigo" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent flex items-end">
                                <div className="p-8 sm:p-10 w-full">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider border border-white/10">{course.category}</span>
                                            <span className="text-slate-300 text-sm font-medium">{course.duration}</span>
                                        </div>
                                        <h1 className="text-4xl sm:text-5xl font-extrabold mb-2 text-white tracking-tight drop-shadow-lg">{course.title}</h1>
                                        <p className="text-slate-300 font-medium text-lg">Instructed by {course.teacher}</p>
                                </div>
                            </div>
                        </div>

                        <div className="px-8 py-6 bg-white relative z-10">
                            {/* Progress Bar */}
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm font-bold text-slate-500 uppercase tracking-wide">Course Progress</span>
                                    <span className="text-sm font-bold text-[--accent]">{currentProgress}%</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-3 border border-slate-200 overflow-hidden">
                                    <div 
                                        className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(99,102,241,0.5)]" 
                                        style={{ width: `${currentProgress}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Course Content Blocks - Single Column Layout */}
                    <div className="space-y-16">
                        {course.content?.map((block, index) => (
                            <div 
                                key={block.id}
                                ref={el => { contentRefs.current[block.id] = el; }}
                                className="scroll-mt-32 animate-fade-in-up"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {block.type === 'text' && (
                                    <div className="prose prose-lg max-w-none text-slate-700 leading-relaxed bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                                        <div className="whitespace-pre-wrap">{block.value}</div>
                                    </div>
                                )}
                                
                                {block.type === 'image' && (
                                    <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200">
                                        <img 
                                            src={block.value} 
                                            alt="course content" 
                                            className="w-full h-auto object-cover"
                                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=Content+Image+Unavailable'; }}
                                        />
                                    </div>
                                )}
                                
                                {/* 
                                    Updated Video Block: 
                                    - Removed iframe preview.
                                    - Styled like a testimonial card (glassy/neon/tech background).
                                    - Focuses on the "Click Key".
                                */}
                                {block.type === 'video' && (
                                    <div className="relative h-64 w-full rounded-2xl overflow-hidden shadow-xl group border border-blue-500/30">
                                        {/* Background Tech Art */}
                                        <div className="absolute inset-0 bg-slate-900">
                                            <TechNetworkArt id={block.id} theme="blue" className="w-full h-full opacity-80" />
                                        </div>
                                        
                                        {/* Dark overlay */}
                                        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"></div>

                                        {/* Content Centered */}
                                        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center z-10">
                                            <div className="w-16 h-16 rounded-full bg-blue-600/20 flex items-center justify-center mb-6 ring-2 ring-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.4)] animate-pulse">
                                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            
                                            <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-md">Video Module Resource</h3>
                                            <p className="text-blue-100 mb-8 max-w-lg">
                                                Access the external video content securely using the access key below.
                                            </p>
                                            
                                            {/* Cyberpunk Click Key */}
                                            <a 
                                                href={block.value} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-mono font-bold text-white transition-all duration-300 bg-blue-600 rounded-lg group-hover:bg-blue-500 group-hover:scale-105 shadow-[0_0_20px_rgba(37,99,235,0.6)] ring-1 ring-white/20"
                                            >
                                                <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
                                                <span className="relative flex items-center gap-3">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11.536 16.207l-1.414 1.414a1 1 0 01-1.414 0l-1.414-1.414a1 1 0 010-1.414l1.414-1.414a1 1 0 011.414 0l1.414 1.414 3.328-3.328A6 6 0 0115 7z" />
                                                    </svg>
                                                    ACCESS_VIDEO_KEY
                                                </span>
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 pt-10 border-t border-slate-200 text-center">
                        <button 
                            onClick={handleProgressUpdate} 
                            className={`
                                relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 
                                ${currentProgress < 100 ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg hover:shadow-indigo-500/50' : 'bg-slate-800 hover:bg-slate-700'}
                                rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                            `}
                        >
                            {currentProgress < 100 ? 'Complete Lesson' : 'Reset Progress'}
                        </button>
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
