
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
                                
                                {block.type === 'video' && (
                                    <div className="relative rounded-2xl overflow-hidden bg-slate-900 shadow-2xl ring-1 ring-white/10 group">
                                        {/* Background Art for Video Container */}
                                        <div className="absolute inset-0 opacity-20">
                                             <TechNetworkArt id={block.id} theme="blue" />
                                        </div>
                                        
                                        <div className="relative z-10 p-1 bg-gradient-to-b from-white/10 to-transparent">
                                            <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden bg-black shadow-inner">
                                                <iframe 
                                                    src={block.value} 
                                                    title="Course Video" 
                                                    frameBorder="0" 
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                                    allowFullScreen 
                                                    className="w-full h-full"
                                                ></iframe>
                                            </div>
                                        </div>

                                        <div className="relative z-10 p-4 flex justify-between items-center bg-slate-900/80 backdrop-blur-sm border-t border-white/5">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                                <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Video Module</span>
                                            </div>
                                            
                                            {/* Beautiful "Cyberpunk Key" URL Button */}
                                            <a 
                                                href={block.value} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="group/btn relative inline-flex items-center justify-center px-6 py-2 overflow-hidden font-mono font-medium tracking-tighter text-white bg-slate-800 rounded-lg group hover:bg-slate-700 transition-all duration-300 border border-slate-600 hover:border-blue-400 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                                            >
                                                <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-blue-500 rounded-full group-hover/btn:w-56 group-hover/btn:h-56 opacity-10"></span>
                                                <span className="relative flex items-center gap-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400 group-hover/btn:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                    </svg>
                                                    OPEN_SOURCE_LINK
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
