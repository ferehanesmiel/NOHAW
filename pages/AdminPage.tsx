
import * as React from 'react';
import { useDropzone } from 'react-dropzone';
import { DragDropContext, Droppable, Draggable, DropResult, DroppableProps } from 'react-beautiful-dnd';
import { Course, User, UserRole, HeroContent, NewsArticle, Testimonial, ContentBlock } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useCourse } from '../contexts/CourseContext';
import Header from '../components/Header';
import { EditIcon, DeleteIcon } from '../components/icons';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { mockNews, mockTestimonials } from '../utils/mockData';

type AdminTab = 'courses' | 'users' | 'hero' | 'news' | 'testimonials';

// Fix for React 18 Strict Mode with react-beautiful-dnd
export const StrictModeDroppable = ({ children, ...props }: DroppableProps) => {
  const [enabled, setEnabled] = React.useState(false);
  React.useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);
  if (!enabled) {
    return null;
  }
  return <Droppable {...props}>{children}</Droppable>;
};

const AdminPage: React.FC = () => {
    const { t } = useLanguage();
    const { users, updateUserDetails, deleteUser } = useAuth();
    const { courses, setCourses } = useCourse();
    const [news, setNews] = useLocalStorage<NewsArticle[]>('news', mockNews);
    const [testimonials, setTestimonials] = useLocalStorage<Testimonial[]>('testimonials', mockTestimonials);
    const [heroContent, setHeroContent] = useLocalStorage<HeroContent>('heroContent', {
      title: 'Design Your Future.',
      subtitle: 'Discover curated courses in technology and design, crafted to elevate your skills and professional life.',
      backgroundImageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80',
      signInImageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
      signUpImageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60'
    });
    
    const [isCourseModalOpen, setIsCourseModalOpen] = React.useState(false);
    const [isUserModalOpen, setIsUserModalOpen] = React.useState(false);
    const [isNewsModalOpen, setIsNewsModalOpen] = React.useState(false);
    const [isTestimonialModalOpen, setIsTestimonialModalOpen] = React.useState(false);

    const [currentCourse, setCurrentCourse] = React.useState<Partial<Course> | null>(null);
    const [currentUser, setCurrentUser] = React.useState<Partial<User> | null>(null);
    const [currentNews, setCurrentNews] = React.useState<Partial<NewsArticle> | null>(null);
    const [currentTestimonial, setCurrentTestimonial] = React.useState<Partial<Testimonial> | null>(null);
    
    const [activeTab, setActiveTab] = React.useState<AdminTab>('courses');
    const [heroSaveStatus, setHeroSaveStatus] = React.useState('');

    // FIX: Define callbacks properly at the top level to avoid hook violations
    const onCourseImageDrop = React.useCallback((acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if(event.target && typeof event.target.result === 'string') {
            setCurrentCourse((prev: any) => ({...prev, imageUrl: event.target.result}));
        }
      };
      if(file) reader.readAsDataURL(file);
    }, []);

    const onNewsImageDrop = React.useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        const reader = new FileReader();
        reader.onload = (event) => {
          if(event.target && typeof event.target.result === 'string') {
              setCurrentNews((prev: any) => ({...prev, imageUrl: event.target.result}));
          }
        };
        if(file) reader.readAsDataURL(file);
    }, []);

    const onTestimonialImageDrop = React.useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        const reader = new FileReader();
        reader.onload = (event) => {
          if(event.target && typeof event.target.result === 'string') {
              setCurrentTestimonial((prev: any) => ({...prev, imageUrl: event.target.result}));
          }
        };
        if(file) reader.readAsDataURL(file);
    }, []);


    React.useEffect(() => {
        if(heroSaveStatus) { const timer = setTimeout(() => setHeroSaveStatus(''), 2000); return () => clearTimeout(timer); }
    }, [heroSaveStatus]);

    // Modal openers
    const openCourseModal = (c?: Course) => { setCurrentCourse(c || { title: '', description: '', category: '', imageUrl: '', teacher: '', duration: '', rating: 0, price: 0, content: [] }); setIsCourseModalOpen(true); };
    const openUserModal = (u: User) => { setCurrentUser(u); setIsUserModalOpen(true); };
    const openNewsModal = (n?: NewsArticle) => { setCurrentNews(n || { title: '', content: '', imageUrl: '', date: new Date().toISOString().split('T')[0] }); setIsNewsModalOpen(true); };
    const openTestimonialModal = (t?: Testimonial) => { setCurrentTestimonial(t || { author: '', role: '', quote: '', imageUrl: '' }); setIsTestimonialModalOpen(true); };

    // Handlers
    const handleSaveCourse = (e: React.FormEvent) => { 
        e.preventDefault(); 
        if (!currentCourse) return; 
        
        // Ensure numbers are actually numbers before saving
        const courseToSave = {
            ...currentCourse,
            price: Number(currentCourse.price),
            rating: Number(currentCourse.rating)
        };

        if (currentCourse.id) { 
            setCourses(courses.map(c => c.id === currentCourse!.id ? courseToSave as Course : c)); 
        } else { 
            setCourses([...courses, { ...courseToSave, id: Date.now().toString() } as Course]); 
        } 
        setIsCourseModalOpen(false); 
    };

    const handleSaveUser = (e: React.FormEvent) => { e.preventDefault(); if(!currentUser?.id) return; updateUserDetails(currentUser.id, currentUser); setIsUserModalOpen(false); };
    const handleSaveNews = (e: React.FormEvent) => { e.preventDefault(); if(!currentNews) return; if (currentNews.id) { setNews(news.map(n => n.id === currentNews.id ? currentNews as NewsArticle : n)); } else { setNews([...news, { ...currentNews, id: Date.now().toString() } as NewsArticle]); } setIsNewsModalOpen(false); };
    const handleSaveTestimonial = (e: React.FormEvent) => { e.preventDefault(); if(!currentTestimonial) return; if(currentTestimonial.id) { setTestimonials(testimonials.map(t => t.id === currentTestimonial.id ? currentTestimonial as Testimonial : t)); } else { setTestimonials([...testimonials, { ...currentTestimonial, id: Date.now().toString() } as Testimonial]); } setIsTestimonialModalOpen(false); };
    
    const handleDeleteCourse = (id: string) => { if(window.confirm('Are you sure?')) setCourses(courses.filter(c => c.id !== id)); };
    const handleDeleteUser = (id: string) => { if(window.confirm('Are you sure?')) deleteUser(id); };
    const handleDeleteNews = (id: string) => { if(window.confirm('Are you sure?')) setNews(news.filter(n => n.id !== id)); };
    const handleDeleteTestimonial = (id: string) => { if(window.confirm('Are you sure?')) setTestimonials(testimonials.filter(t => t.id !== id)); };
    
    const handleHeroChange = (field: keyof HeroContent, value: string) => { setHeroContent(p => ({ ...p, [field]: value })); };
    
    const onHeroImageDrop = React.useCallback((acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = (event) => { if(event.target?.result) setHeroContent(p => ({...p, backgroundImageUrl: event.target.result as string})) };
      if(file) reader.readAsDataURL(file);
    }, [setHeroContent]);

    const onSignInImageDrop = React.useCallback((acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = (event) => { if(event.target?.result) setHeroContent(p => ({...p, signInImageUrl: event.target.result as string})) };
      if(file) reader.readAsDataURL(file);
    }, [setHeroContent]);

    const onSignUpImageDrop = React.useCallback((acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = (event) => { if(event.target?.result) setHeroContent(p => ({...p, signUpImageUrl: event.target.result as string})) };
      if(file) reader.readAsDataURL(file);
    }, [setHeroContent]);

    const heroDropzone = useDropzone({ onDrop: onHeroImageDrop, accept: {'image/*':[]} });
    const signInDropzone = useDropzone({ onDrop: onSignInImageDrop, accept: {'image/*':[]} });
    const signUpDropzone = useDropzone({ onDrop: onSignUpImageDrop, accept: {'image/*':[]} });
    
    const TabButton: React.FC<{tab: AdminTab, label: string}> = ({ tab, label }) => ( <button onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tab ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-200'}`}>{label}</button> );

    return (
        <div className="bg-slate-100 min-h-screen">
            <Header />
            <main className="container mx-auto p-4 sm:p-8 pt-28">
                <h1 className="text-3xl font-bold text-slate-800 mb-6">{t('adminDashboard')}</h1>
                <div className="bg-white p-4 rounded-lg shadow mb-8">
                    <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
                        <TabButton tab="courses" label={t('courseManagement')} />
                        <TabButton tab="users" label={t('userManagement')} />
                        <TabButton tab="news" label={t('newsManagement')} />
                        <TabButton tab="testimonials" label={t('testimonialManagement')} />
                        <TabButton tab="hero" label="Hero & Images" />
                    </div>
                    <div className="pt-6">
                        {activeTab === 'courses' && ( <div><div className="flex justify-end mb-4"><button onClick={() => openCourseModal()} className="elegant-button">{t('addCourse')}</button></div><div className="overflow-x-auto"><table className="min-w-full divide-y divide-slate-200"><thead className="bg-slate-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Image</th><th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">{t('title')}</th><th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">{t('teacher')}</th><th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">{t('price')}</th><th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">{t('actions')}</th></tr></thead><tbody className="bg-white divide-y divide-slate-200">{courses.length > 0 ? courses.map(course => (<tr key={course.id} className="hover:bg-slate-50 transition-colors"><td className="px-6 py-4"><img src={course.imageUrl} alt={course.title} className="w-16 h-10 object-cover rounded"/></td><td className="px-6 py-4 text-sm text-slate-900">{course.title}</td><td className="px-6 py-4 text-sm text-slate-500">{course.teacher}</td><td className="px-6 py-4 text-sm text-slate-500">{Number(course.price) > 0 ? `$${course.price}`: t('free')}</td><td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center"><button onClick={() => openCourseModal(course)} className="text-[--accent] hover:text-[--accent-hover]"><EditIcon/></button><button onClick={() => handleDeleteCourse(course.id)} className="text-red-600 hover:text-red-800 ml-4"><DeleteIcon/></button></td></tr>)) : (<tr><td colSpan={5} className="text-center py-8 text-slate-500">No courses found. Add a new one to get started.</td></tr>)}</tbody></table></div></div> )}
                        {activeTab === 'users' && ( <div className="overflow-x-auto"><table className="min-w-full divide-y divide-slate-200"><thead className="bg-slate-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">{t('username')}</th><th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">{t('email')}</th><th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">{t('role')}</th><th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">{t('actions')}</th></tr></thead><tbody className="bg-white divide-y divide-slate-200">{users.length > 0 ? users.map(user => (<tr key={user.id} className="hover:bg-slate-50 transition-colors"><td className="px-6 py-4 text-sm text-slate-900">{user.username}</td><td className="px-6 py-4 text-sm text-slate-500">{user.email}</td><td className="px-6 py-4 text-sm text-slate-500">{user.role}</td><td className="px-6 py-4 flex items-center"><button onClick={() => openUserModal(user)} className="text-[--accent] hover:text-[--accent-hover]"><EditIcon/></button><button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-800 ml-4"><DeleteIcon/></button></td></tr>)) : (<tr><td colSpan={4} className="text-center py-8 text-slate-500">No users found.</td></tr>)}</tbody></table></div> )}
                        {activeTab === 'news' && ( <div><div className="flex justify-end mb-4"><button onClick={() => openNewsModal()} className="elegant-button">{t('addNews')}</button></div><div className="overflow-x-auto"><table className="min-w-full divide-y divide-slate-200"><thead className="bg-slate-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Image</th><th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">{t('title')}</th><th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">{t('date')}</th><th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">{t('actions')}</th></tr></thead><tbody className="bg-white divide-y divide-slate-200">{news.length > 0 ? news.map(article => (<tr key={article.id} className="hover:bg-slate-50 transition-colors"><td className="px-6 py-4"><img src={article.imageUrl} alt={article.title} className="w-16 h-10 object-cover rounded"/></td><td className="px-6 py-4 text-sm text-slate-900">{article.title}</td><td className="px-6 py-4 text-sm text-slate-500">{article.date}</td><td className="px-6 py-4 flex items-center"><button onClick={() => openNewsModal(article)} className="text-[--accent] hover:text-[--accent-hover]"><EditIcon/></button><button onClick={() => handleDeleteNews(article.id)} className="text-red-600 hover:text-red-800 ml-4"><DeleteIcon/></button></td></tr>)) : (<tr><td colSpan={4} className="text-center py-8 text-slate-500">No news articles found.</td></tr>)}</tbody></table></div></div> )}
                        {activeTab === 'testimonials' && ( <div><div className="flex justify-end mb-4"><button onClick={() => openTestimonialModal()} className="elegant-button">{t('addTestimonial')}</button></div><div className="overflow-x-auto"><table className="min-w-full divide-y divide-slate-200"><thead className="bg-slate-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Image</th><th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">{t('author')}</th><th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">{t('quote')}</th><th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">{t('actions')}</th></tr></thead><tbody className="bg-white divide-y divide-slate-200">{testimonials.length > 0 ? testimonials.map(testimonial => (<tr key={testimonial.id} className="hover:bg-slate-50 transition-colors"><td className="px-6 py-4"><img src={testimonial.imageUrl} alt={testimonial.author} className="w-10 h-10 object-cover rounded-full"/></td><td className="px-6 py-4 text-sm text-slate-900">{testimonial.author}</td><td className="px-6 py-4 text-sm text-slate-500 truncate max-w-sm">{testimonial.quote}</td><td className="px-6 py-4 flex items-center"><button onClick={() => openTestimonialModal(testimonial)} className="text-[--accent] hover:text-[--accent-hover]"><EditIcon/></button><button onClick={() => handleDeleteTestimonial(testimonial.id)} className="text-red-600 hover:text-red-800 ml-4"><DeleteIcon/></button></td></tr>)) : (<tr><td colSpan={4} className="text-center py-8 text-slate-500">No testimonials found.</td></tr>)}</tbody></table></div></div> )}
                        {activeTab === 'hero' && ( 
                            <div className="max-w-2xl mx-auto">
                                <form onSubmit={(e) => {e.preventDefault(); setHeroSaveStatus('Saved!');}}>
                                    <div className="mb-6">
                                        <h3 className="text-lg font-bold text-slate-800 mb-2">Home Page Hero</h3>
                                        <div className="mb-4"><label htmlFor="heroTitle" className="block text-sm font-medium text-slate-700">{t('title')}</label><input type="text" id="heroTitle" value={heroContent.title} onChange={e => handleHeroChange('title', e.target.value)} className="mt-1 block w-full elegant-input" /></div>
                                        <div className="mb-4"><label htmlFor="heroSubtitle" className="block text-sm font-medium text-slate-700">{t('subtitle')}</label><textarea id="heroSubtitle" value={heroContent.subtitle} onChange={e => handleHeroChange('subtitle', e.target.value)} rows={3} className="mt-1 block w-full elegant-input"></textarea></div>
                                        <div><label className="block text-sm font-medium text-slate-700">{t('backgroundImage')}</label><div {...heroDropzone.getRootProps()} className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md cursor-pointer ${heroDropzone.isDragActive ? 'border-[--accent] bg-yellow-50' : ''}`}><input {...heroDropzone.getInputProps()} /><div className="space-y-1 text-center">{heroContent.backgroundImageUrl ? <img src={heroContent.backgroundImageUrl} alt="Preview" className="mx-auto h-24 w-auto"/> : <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>}<p className="text-sm text-slate-600">{t('dropImage')}</p></div></div></div>
                                    </div>
                                    
                                    <div className="border-t border-slate-200 my-6 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-800 mb-2">Sign In Page Image</h3>
                                            <div {...signInDropzone.getRootProps()} className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md cursor-pointer ${signInDropzone.isDragActive ? 'border-[--accent] bg-yellow-50' : ''}`}>
                                                <input {...signInDropzone.getInputProps()} />
                                                <div className="space-y-1 text-center">
                                                    {heroContent.signInImageUrl ? <img src={heroContent.signInImageUrl} alt="Sign In Preview" className="mx-auto h-24 w-auto object-cover"/> : <span className="text-slate-400">No Image</span>}
                                                    <p className="text-xs text-slate-600">Drop Sign In Image</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-800 mb-2">Sign Up Page Image</h3>
                                            <div {...signUpDropzone.getRootProps()} className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md cursor-pointer ${signUpDropzone.isDragActive ? 'border-[--accent] bg-yellow-50' : ''}`}>
                                                <input {...signUpDropzone.getInputProps()} />
                                                <div className="space-y-1 text-center">
                                                    {heroContent.signUpImageUrl ? <img src={heroContent.signUpImageUrl} alt="Sign Up Preview" className="mx-auto h-24 w-auto object-cover"/> : <span className="text-slate-400">No Image</span>}
                                                    <p className="text-xs text-slate-600">Drop Sign Up Image</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end items-center mt-4"><span className="text-sm text-slate-500 mr-4">{heroSaveStatus}</span><button type="submit" className="elegant-button">{t('save')}</button></div>
                                </form>
                            </div> 
                        )}
                    </div>
                </div>
            </main>
            {isCourseModalOpen && currentCourse && <CourseModal course={currentCourse} onClose={() => setIsCourseModalOpen(false)} onSave={handleSaveCourse} onImageDrop={onCourseImageDrop} setCourse={setCurrentCourse} />}
            {isUserModalOpen && currentUser && <UserModal user={currentUser} onClose={() => setIsUserModalOpen(false)} onSave={handleSaveUser} setUser={setCurrentUser} />}
            {isNewsModalOpen && currentNews && <NewsModal article={currentNews} onClose={() => setIsNewsModalOpen(false)} onSave={handleSaveNews} onImageDrop={onNewsImageDrop} setArticle={setCurrentNews} />}
            {isTestimonialModalOpen && currentTestimonial && <TestimonialModal testimonial={currentTestimonial} onClose={() => setIsTestimonialModalOpen(false)} onSave={handleSaveTestimonial} onImageDrop={onTestimonialImageDrop} setTestimonial={setCurrentTestimonial} />}
        </div>
    );
};

const Dropzone: React.FC<{onDrop: (files: File[]) => void, imageUrl?: string | null}> = ({ onDrop, imageUrl }) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: {'image/*': []} });
    const { t } = useLanguage();
    return ( <div {...getRootProps()} className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md cursor-pointer ${isDragActive ? 'border-[--accent] bg-yellow-50' : ''}`}><input {...getInputProps()} /><div className="space-y-1 text-center">{imageUrl ? <img src={imageUrl} alt="Preview" className="mx-auto h-24 w-auto object-contain"/> : <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>}<p className="text-sm text-slate-600">{t('dropImage')}</p></div></div> );
}

const ContentBlockItem: React.FC<{
  block: ContentBlock;
  index: number;
  updateBlock: (id: string, value: string) => void;
  deleteBlock: (id: string) => void;
}> = ({ block, index, updateBlock, deleteBlock }) => {
  const { t } = useLanguage();

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateBlock(block.id, e.target.value);
  };
  
  const onBlockImageDrop = React.useCallback((acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if(event.target && typeof event.target.result === 'string') {
          updateBlock(block.id, event.target.result);
        }
      };
      if(file) reader.readAsDataURL(file);
    }, [block.id, updateBlock]);
  const { getRootProps, getInputProps } = useDropzone({ onDrop: onBlockImageDrop, accept: {'image/*':[]} });

  return (
    <Draggable draggableId={block.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="p-4 mb-2 bg-slate-50 rounded-lg border border-slate-200"
        >
          <div className="flex items-center justify-between mb-2">
             <div className="flex items-center">
                <span {...provided.dragHandleProps} className="cursor-grab text-slate-400 mr-2">☰</span>
                <span className="font-medium text-slate-700 capitalize">{block.type} Block</span>
             </div>
            <button type="button" onClick={() => deleteBlock(block.id)} className="text-red-500 hover:text-red-700 text-sm">{t('delete')}</button>
          </div>

          {block.type === 'text' && (
            <textarea value={block.value} onChange={handleValueChange} rows={4} className="elegant-input w-full" placeholder="Enter text content..."/>
          )}
          {block.type === 'video' && (
            <input type="text" value={block.value} onChange={handleValueChange} className="elegant-input w-full" placeholder="Enter video URL (e.g., YouTube embed link)"/>
          )}
          {block.type === 'image' && (
             <div {...getRootProps()} className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-md cursor-pointer hover:bg-slate-100">
                <input {...getInputProps()} />
                <div className="space-y-1 text-center">
                    {block.value ? 
                        <img src={block.value} alt="Content preview" className="mx-auto h-24 w-auto object-contain"/> :
                        <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                    }
                    <p className="text-sm text-slate-600">{t('dropImage')}</p>
                </div>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};

const CourseModal: React.FC<{course: Partial<Course>, onClose: ()=>void, onSave: (e: React.FormEvent)=>void, onImageDrop: (f:File[])=>void, setCourse: React.Dispatch<React.SetStateAction<Partial<Course> | null>>}> = ({ course, onClose, onSave, onImageDrop, setCourse }) => {
    const { t } = useLanguage();
    
    // FIX: Parse numbers correctly for price and rating to prevent string-math crashes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setCourse(prev => {
            if (!prev) return null;
            return {
                ...prev,
                [name]: type === 'number' ? parseFloat(value) || 0 : value
            };
        });
    };
    
    const contentBlocks = course.content || [];

    const addBlock = (type: 'text' | 'image' | 'video') => {
        const newBlock: ContentBlock = { id: `block-${Date.now()}`, type, value: '' };
        setCourse(prev => prev ? ({ ...prev, content: [...(prev.content || []), newBlock] }) : null);
    };

    const updateBlock = (id: string, value: string) => {
        setCourse(prev => prev ? ({ ...prev, content: (prev.content || []).map(b => b.id === id ? { ...b, value } : b) }) : null);
    };

    const deleteBlock = (id: string) => {
        setCourse(prev => prev ? ({ ...prev, content: (prev.content || []).filter(b => b.id !== id) }) : null);
    };

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        const items = Array.from(contentBlocks);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setCourse(prev => prev ? ({...prev, content: items}) : null);
    };

    return (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-lg p-6 sm:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"><h2 className="text-2xl font-bold mb-6 text-slate-800">{course.id ? t('editCourse') : t('addCourse')}</h2><form onSubmit={onSave}><div className="space-y-4"><div><label className="block text-sm font-semibold text-slate-700 mb-1">{t('title')}</label><input name="title" value={course.title} onChange={handleChange} className="elegant-input"/></div><div><label className="block text-sm font-semibold text-slate-700 mb-1">{t('description')}</label><textarea name="description" value={course.description} onChange={handleChange} className="elegant-input"/></div><div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-semibold text-slate-700 mb-1">{t('category')}</label><input name="category" value={course.category} onChange={handleChange} className="elegant-input"/></div><div><label className="block text-sm font-semibold text-slate-700 mb-1">{t('teacher')}</label><input name="teacher" value={course.teacher} onChange={handleChange} className="elegant-input"/></div></div><div className="grid grid-cols-3 gap-4"><div><label className="block text-sm font-semibold text-slate-700 mb-1">{t('duration')}</label><input name="duration" value={course.duration} onChange={handleChange} className="elegant-input"/></div><div><label className="block text-sm font-semibold text-slate-700 mb-1">{t('rating')}</label><input name="rating" type="number" step="0.1" value={course.rating} onChange={handleChange} className="elegant-input"/></div><div><label className="block text-sm font-semibold text-slate-700 mb-1">{t('price')}</label><input name="price" type="number" value={course.price} onChange={handleChange} className="elegant-input"/></div></div><div><label className="block text-sm font-semibold text-slate-700 mb-1">{t('imageUrl')}</label><Dropzone onDrop={onImageDrop} imageUrl={course.imageUrl} /></div></div>
    
    <div className="mt-6 pt-4 border-t border-slate-200"><h3 className="text-lg font-medium text-slate-800 mb-2">{t('contentBlocks')}</h3>
    {/* Use StrictModeDroppable instead of Droppable */}
    <DragDropContext onDragEnd={onDragEnd}><StrictModeDroppable droppableId="content-blocks">{(provided) => (<div {...provided.droppableProps} ref={provided.innerRef}>{contentBlocks.length > 0 ? contentBlocks.map((block, index) => (<ContentBlockItem key={block.id} block={block} index={index} updateBlock={updateBlock} deleteBlock={deleteBlock} />)) : <p className="text-sm text-slate-500 text-center py-4">No content yet. Add a block to get started.</p>}{provided.placeholder}</div>)}</StrictModeDroppable></DragDropContext><div className="flex items-center space-x-2 mt-4"><button type="button" onClick={() => addBlock('text')} className="elegant-button-outline text-sm">{t('addTextBlock')}</button><button type="button" onClick={() => addBlock('image')} className="elegant-button-outline text-sm">{t('addImageBlock')}</button><button type="button" onClick={() => addBlock('video')} className="elegant-button-outline text-sm">{t('addVideoBlock')}</button></div></div>

    <div className="flex justify-end space-x-4 pt-6"><button type="button" onClick={onClose} className="elegant-button-outline">{t('cancel')}</button><button type="submit" className="elegant-button">{t('save')}</button></div></form></div></div>)
}
const UserModal: React.FC<{user: Partial<User>, onClose: ()=>void, onSave: (e: React.FormEvent)=>void, setUser: (u: any)=>void}> = ({ user, onClose, onSave, setUser }) => {
    const { t } = useLanguage();
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setUser((prev: User) => ({...prev, [e.target.name]: e.target.value}));
    return (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-lg p-6 sm:p-8 w-full max-w-md"><h2 className="text-2xl font-bold mb-6 text-slate-800">{t('editUser')}</h2><form onSubmit={onSave} className="space-y-4"><div><label className="block text-sm font-semibold text-slate-700 mb-1">{t('username')}</label><input name="username" value={user.username} onChange={handleChange} className="elegant-input"/></div><div><label className="block text-sm font-semibold text-slate-700 mb-1">{t('email')}</label><input value={user.email} className="elegant-input bg-slate-200" readOnly/></div><div><label className="block text-sm font-semibold text-slate-700 mb-1">{t('role')}</label><select name="role" value={user.role} onChange={handleChange} className="elegant-input"><option value={UserRole.USER}>USER</option><option value={UserRole.ADMIN}>ADMIN</option></select></div><div className="flex justify-end space-x-4 pt-4"><button type="button" onClick={onClose} className="elegant-button-outline">{t('cancel')}</button><button type="submit" className="elegant-button">{t('save')}</button></div></form></div></div>)
}
const NewsModal: React.FC<{article: Partial<NewsArticle>, onClose: ()=>void, onSave: (e: React.FormEvent)=>void, onImageDrop: (f:File[])=>void, setArticle: (a: any)=>void}> = ({ article, onClose, onSave, onImageDrop, setArticle }) => {
    const { t } = useLanguage();
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setArticle((prev: NewsArticle) => ({...prev, [e.target.name]: e.target.value}));
    return (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-lg p-6 sm:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"><h2 className="text-2xl font-bold mb-6 text-slate-800">{article.id ? t('editNews') : t('addNews')}</h2><form onSubmit={onSave} className="space-y-4"><div><label className="block text-sm font-semibold text-slate-700 mb-1">{t('title')}</label><input name="title" value={article.title} onChange={handleChange} className="elegant-input"/></div><div><label className="block text-sm font-semibold text-slate-700 mb-1">{t('content')}</label><textarea name="content" value={article.content} onChange={handleChange} rows={5} className="elegant-input"/></div><div><label className="block text-sm font-semibold text-slate-700 mb-1">{t('date')}</label><input name="date" type="date" value={article.date} onChange={handleChange} className="elegant-input"/></div><div><label className="block text-sm font-semibold text-slate-700 mb-1">{t('imageUrl')}</label><Dropzone onDrop={onImageDrop} imageUrl={article.imageUrl} /></div><div className="flex justify-end space-x-4 pt-4"><button type="button" onClick={onClose} className="elegant-button-outline">{t('cancel')}</button><button type="submit" className="elegant-button">{t('save')}</button></div></form></div></div>)
}
const TestimonialModal: React.FC<{testimonial: Partial<Testimonial>, onClose: ()=>void, onSave: (e: React.FormEvent)=>void, onImageDrop: (f:File[])=>void, setTestimonial: (t: any)=>void}> = ({ testimonial, onClose, onSave, onImageDrop, setTestimonial }) => {
    const { t } = useLanguage();
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setTestimonial((prev: Testimonial) => ({...prev, [e.target.name]: e.target.value}));
    return (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-lg p-6 sm:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"><h2 className="text-2xl font-bold mb-6 text-slate-800">{testimonial.id ? t('editTestimonial') : t('addTestimonial')}</h2><form onSubmit={onSave} className="space-y-4"><div><label className="block text-sm font-semibold text-slate-700 mb-1">{t('author')}</label><input name="author" value={testimonial.author} onChange={handleChange} className="elegant-input"/></div><div><label className="block text-sm font-semibold text-slate-700 mb-1">{t('role')}</label><input name="role" value={testimonial.role} onChange={handleChange} className="elegant-input"/></div><div><label className="block text-sm font-semibold text-slate-700 mb-1">{t('quote')}</label><textarea name="quote" value={testimonial.quote} onChange={handleChange} rows={4} className="elegant-input"/></div><div><label className="block text-sm font-semibold text-slate-700 mb-1">{t('imageUrl')}</label><Dropzone onDrop={onImageDrop} imageUrl={testimonial.imageUrl} /></div><div className="flex justify-end space-x-4 pt-4"><button type="button" onClick={onClose} className="elegant-button-outline">{t('cancel')}</button><button type="submit" className="elegant-button">{t('save')}</button></div></form></div></div>)
}


export default AdminPage;
