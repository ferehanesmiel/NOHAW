
import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Course, User, UserRole, HeroContent, NewsArticle, Testimonial } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useCourse } from '../contexts/CourseContext';
import Header from '../components/Header';
import { EditIcon, DeleteIcon } from '../components/icons';
import { useLocalStorage } from '../hooks/useLocalStorage';

type AdminTab = 'courses' | 'users' | 'hero' | 'news' | 'testimonials';

const AdminPage: React.FC = () => {
    const { t } = useLanguage();
    const { users, updateUserDetails, deleteUser } = useAuth();
    const { courses, setCourses } = useCourse();
    const [news, setNews] = useLocalStorage<NewsArticle[]>('news', []);
    const [testimonials, setTestimonials] = useLocalStorage<Testimonial[]>('testimonials', []);
    const [heroContent, setHeroContent] = useLocalStorage<HeroContent>('heroContent', {
      title: 'Design Your Future.',
      subtitle: 'Discover curated courses in technology and design, crafted to elevate your skills and professional life.',
      backgroundImageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80'
    });
    
    const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
    const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);

    const [currentCourse, setCurrentCourse] = useState<Partial<Course> | null>(null);
    const [currentUser, setCurrentUser] = useState<Partial<User> | null>(null);
    const [currentNews, setCurrentNews] = useState<Partial<NewsArticle> | null>(null);
    const [currentTestimonial, setCurrentTestimonial] = useState<Partial<Testimonial> | null>(null);
    
    const [activeTab, setActiveTab] = useState<AdminTab>('courses');
    const [heroSaveStatus, setHeroSaveStatus] = useState('');
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if(event.target && typeof event.target.result === 'string') {
          setUploadedImageUrl(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }, []);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: {'image/*':[]} });
    
    useEffect(() => {
        if(heroSaveStatus) { const timer = setTimeout(() => setHeroSaveStatus(''), 2000); return () => clearTimeout(timer); }
    }, [heroContent, heroSaveStatus]);

    // Modal openers
    const openCourseModal = (c?: Course) => { setUploadedImageUrl(null); setCurrentCourse(c || { title: '', description: '', category: '', imageUrl: '', teacher: '', duration: '', rating: 0, price: 0 }); setIsCourseModalOpen(true); };
    const openUserModal = (u: User) => { setCurrentUser(u); setIsUserModalOpen(true); };
    const openNewsModal = (n?: NewsArticle) => { setUploadedImageUrl(null); setCurrentNews(n || { title: '', content: '', imageUrl: '', date: new Date().toISOString().split('T')[0] }); setIsNewsModalOpen(true); };
    const openTestimonialModal = (t?: Testimonial) => { setUploadedImageUrl(null); setCurrentTestimonial(t || { author: '', role: '', quote: '', imageUrl: '' }); setIsTestimonialModalOpen(true); };

    // Handlers
    const handleSaveCourse = (e: React.FormEvent) => { e.preventDefault(); if (!currentCourse) return; const finalCourse = { ...currentCourse, imageUrl: uploadedImageUrl || currentCourse.imageUrl }; if (finalCourse.id) { setCourses(courses.map(c => c.id === finalCourse.id ? finalCourse as Course : c)); } else { setCourses([...courses, { ...finalCourse, id: Date.now().toString() } as Course]); } setIsCourseModalOpen(false); };
    const handleSaveUser = (e: React.FormEvent) => { e.preventDefault(); if(!currentUser?.id) return; updateUserDetails(currentUser.id, currentUser); setIsUserModalOpen(false); };
    const handleSaveNews = (e: React.FormEvent) => { e.preventDefault(); if(!currentNews) return; const finalNews = { ...currentNews, imageUrl: uploadedImageUrl || currentNews.imageUrl }; if (finalNews.id) { setNews(news.map(n => n.id === finalNews.id ? finalNews as NewsArticle : n)); } else { setNews([...news, { ...finalNews, id: Date.now().toString() } as NewsArticle]); } setIsNewsModalOpen(false); };
    const handleSaveTestimonial = (e: React.FormEvent) => { e.preventDefault(); if(!currentTestimonial) return; const finalTestimonial = { ...currentTestimonial, imageUrl: uploadedImageUrl || currentTestimonial.imageUrl }; if(finalTestimonial.id) { setTestimonials(testimonials.map(t => t.id === finalTestimonial.id ? finalTestimonial as Testimonial : t)); } else { setTestimonials([...testimonials, { ...finalTestimonial, id: Date.now().toString() } as Testimonial]); } setIsTestimonialModalOpen(false); };
    
    const handleHeroChange = (field: keyof HeroContent, value: string) => { setHeroContent(p => ({ ...p, [field]: value })); setHeroSaveStatus('Saving...'); setTimeout(() => setHeroSaveStatus('Saved!'), 1000); };
    
    const TabButton: React.FC<{tab: AdminTab, label: string}> = ({ tab, label }) => ( <button onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tab ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-200'}`}>{label}</button> );

    return (
        <div className="bg-slate-100 min-h-screen">
            <Header />
            <main className="container mx-auto p-4 sm:p-8 pt-28">
                <h1 className="text-3xl font-bold text-slate-800 mb-6">{t('adminDashboard')}</h1>
                <div className="bg-white p-4 rounded-lg shadow mb-8">
                    <div className="flex flex-wrap space-x-2 border-b border-slate-200 pb-4">
                        <TabButton tab="courses" label={t('courseManagement')} />
                        <TabButton tab="users" label={t('userManagement')} />
                        <TabButton tab="news" label={t('newsManagement')} />
                        <TabButton tab="testimonials" label={t('testimonialManagement')} />
                        <TabButton tab="hero" label={t('heroManagement')} />
                    </div>
                    <div className="pt-6">
                        {/* Tables rendered here based on activeTab */}
                        {activeTab === 'courses' && (<div><div className="flex justify-end mb-4"><button onClick={() => openCourseModal()} className="elegant-button">{t('addCourse')}</button></div><div className="overflow-x-auto"><table className="min-w-full divide-y">...</table></div></div>)}
                        {activeTab === 'users' && (<div><div className="overflow-x-auto"><table className="min-w-full divide-y">...</table></div></div>)}
                        {activeTab === 'news' && (<div><div className="flex justify-end mb-4"><button onClick={() => openNewsModal()} className="elegant-button">{t('addNews')}</button></div><div className="overflow-x-auto"><table className="min-w-full divide-y">...</table></div></div>)}
                        {activeTab === 'testimonials' && (<div><div className="flex justify-end mb-4"><button onClick={() => openTestimonialModal()} className="elegant-button">{t('addTestimonial')}</button></div><div className="overflow-x-auto"><table className="min-w-full divide-y">...</table></div></div>)}
                        {activeTab === 'hero' && ( <div className="max-w-xl mx-auto"><form>...</form></div> )}
                    </div>
                </div>
            </main>
            {/* Modals here */}
        </div>
    );
};
export default AdminPage;
