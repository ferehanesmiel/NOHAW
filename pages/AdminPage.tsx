
import * as React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult, DroppableProps } from 'react-beautiful-dnd';
import { Course, User, UserRole, HeroContent, NewsArticle, Testimonial, ContentBlock } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useCourse } from '../contexts/CourseContext';
import Header from '../components/Header';
import { EditIcon, DeleteIcon } from '../components/icons';
import { db } from '../firebase';
import { collection, doc, setDoc, deleteDoc, onSnapshot, getDoc } from 'firebase/firestore';

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
    const { updateUserDetails } = useAuth(); 
    const { courses } = useCourse(); 
    
    // Local state for non-context collections
    const [users, setUsers] = React.useState<User[]>([]);
    const [news, setNews] = React.useState<NewsArticle[]>([]);
    const [testimonials, setTestimonials] = React.useState<Testimonial[]>([]);
    const [heroContent, setHeroContent] = React.useState<HeroContent>({
      title: 'Design Your Future.',
      subtitle: 'Discover curated courses...',
      backgroundImageUrl: '',
      signInImageUrl: '',
      signUpImageUrl: ''
    });

    // Modals
    const [isCourseModalOpen, setIsCourseModalOpen] = React.useState(false);
    const [isUserModalOpen, setIsUserModalOpen] = React.useState(false);
    const [isNewsModalOpen, setIsNewsModalOpen] = React.useState(false);
    const [isTestimonialModalOpen, setIsTestimonialModalOpen] = React.useState(false);

    // Editing State
    const [currentCourse, setCurrentCourse] = React.useState<Partial<Course> | null>(null);
    const [currentUser, setCurrentUser] = React.useState<Partial<User> | null>(null);
    const [currentNews, setCurrentNews] = React.useState<Partial<NewsArticle> | null>(null);
    const [currentTestimonial, setCurrentTestimonial] = React.useState<Partial<Testimonial> | null>(null);
    
    const [activeTab, setActiveTab] = React.useState<AdminTab>('courses');
    const [heroSaveStatus, setHeroSaveStatus] = React.useState('');

    // Realtime Listeners
    React.useEffect(() => {
        // Users
        const unsubUsers = onSnapshot(collection(db, 'users'), 
            (snap) => setUsers(snap.docs.map(d => ({id:d.id, ...d.data()} as User))),
            (error) => console.error("Error fetching users:", error)
        );

        // News
        const unsubNews = onSnapshot(collection(db, 'news'), 
            (snap) => setNews(snap.docs.map(d => ({id:d.id, ...d.data()} as NewsArticle))),
            (error) => console.error("Error fetching news:", error)
        );

        // Testimonials
        const unsubTestimonials = onSnapshot(collection(db, 'testimonials'), 
            (snap) => setTestimonials(snap.docs.map(d => ({id:d.id, ...d.data()} as Testimonial))),
            (error) => console.error("Error fetching testimonials:", error)
        );
        
        // Fetch Hero (One-time fetch for settings)
        const fetchHero = async () => {
            try {
                const docSnap = await getDoc(doc(db, 'settings', 'hero'));
                if(docSnap.exists()) {
                    setHeroContent(docSnap.data() as HeroContent);
                }
            } catch (error) {
                console.error("Error fetching hero content:", error);
            }
        };
        fetchHero();

        return () => { unsubUsers(); unsubNews(); unsubTestimonials(); };
    }, []);

    // --- Save Handlers (Direct Firestore Writes) ---

    const handleSaveCourse = async (e: React.FormEvent) => { 
        e.preventDefault(); 
        if (!currentCourse) return; 
        const id = currentCourse.id || Date.now().toString();
        const courseData = { 
            ...currentCourse, 
            price: Number(currentCourse.price), 
            rating: Number(currentCourse.rating), 
            id 
        };
        
        try {
            await setDoc(doc(db, 'courses', id), courseData);
            setIsCourseModalOpen(false); 
        } catch (error) {
            console.error("Error saving course:", error);
            alert("Error saving course. Please check your connection.");
        }
    };

    const handleSaveUser = async (e: React.FormEvent) => { 
        e.preventDefault(); 
        if(!currentUser?.id) return; 
        try {
            await updateUserDetails(currentUser.id, currentUser); 
            setIsUserModalOpen(false); 
        } catch (error) {
            console.error("Error saving user:", error);
            alert("Error updating user.");
        }
    };

    const handleSaveNews = async (e: React.FormEvent) => { 
        e.preventDefault(); 
        if(!currentNews) return; 
        const id = currentNews.id || Date.now().toString();
        try {
            await setDoc(doc(db, 'news', id), { ...currentNews, id });
            setIsNewsModalOpen(false); 
        } catch (error) {
            console.error("Error saving news:", error);
            alert("Error saving news article.");
        }
    };

    const handleSaveTestimonial = async (e: React.FormEvent) => { 
        e.preventDefault(); 
        if(!currentTestimonial) return; 
        const id = currentTestimonial.id || Date.now().toString();
        try {
            await setDoc(doc(db, 'testimonials', id), { ...currentTestimonial, id });
            setIsTestimonialModalOpen(false); 
        } catch (error) {
            console.error("Error saving testimonial:", error);
            alert("Error saving testimonial.");
        }
    };

    const handleSaveHero = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await setDoc(doc(db, 'settings', 'hero'), heroContent);
            setHeroSaveStatus('Saved!');
            setTimeout(() => setHeroSaveStatus(''), 2000);
        } catch (error) {
            console.error("Error saving hero settings:", error);
            setHeroSaveStatus('Error!');
        }
    };
    
    const handleDelete = async (collectionName: string, id: string) => { 
        if(window.confirm('Are you sure you want to delete this item?')) {
            try {
                await deleteDoc(doc(db, collectionName, id));
            } catch (error) {
                console.error("Error deleting item:", error);
                alert("Error deleting item.");
            }
        }
    };
    
    const openCourseModal = (c?: Course) => { setCurrentCourse(c || { title: '', description: '', category: '', imageUrl: '', teacher: '', duration: '', rating: 0, price: 0, content: [] }); setIsCourseModalOpen(true); };
    const openUserModal = (u: User) => { setCurrentUser(u); setIsUserModalOpen(true); };
    const openNewsModal = (n?: NewsArticle) => { setCurrentNews(n || { title: '', content: '', imageUrl: '', date: new Date().toISOString().split('T')[0] }); setIsNewsModalOpen(true); };
    const openTestimonialModal = (t?: Testimonial) => { setCurrentTestimonial(t || { author: '', role: '', quote: '', imageUrl: '' }); setIsTestimonialModalOpen(true); };
    
    const TabButton: React.FC<{tab: AdminTab, label: string}> = ({ tab, label }) => ( <button onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tab ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-200'}`}>{label}</button> );

    return (
        <div className="bg-slate-100 min-h-screen">
            <Header />
            <main className="container mx-auto p-4 sm:p-8 pt-28">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-slate-800">{t('adminDashboard')}</h1>
                    <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full font-medium border border-emerald-200">
                        Live Database Connected
                    </span>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow mb-8">
                    <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-4">
                        <TabButton tab="courses" label={t('courseManagement')} />
                        <TabButton tab="users" label={t('userManagement')} />
                        <TabButton tab="news" label={t('newsManagement')} />
                        <TabButton tab="testimonials" label={t('testimonialManagement')} />
                        <TabButton tab="hero" label="Hero & Images" />
                    </div>
                    <div className="pt-6">
                        {activeTab === 'courses' && ( <div><div className="flex justify-end mb-4"><button onClick={() => openCourseModal()} className="elegant-button">{t('addCourse')}</button></div><div className="overflow-x-auto"><table className="min-w-full divide-y divide-slate-200"><thead className="bg-slate-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Image</th><th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">{t('title')}</th><th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">{t('teacher')}</th><th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">{t('price')}</th><th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">{t('actions')}</th></tr></thead><tbody className="bg-white divide-y divide-slate-200">{courses.length > 0 ? courses.map(course => (<tr key={course.id} className="hover:bg-slate-50 transition-colors"><td className="px-6 py-4"><img src={course.imageUrl} alt={course.title} className="w-16 h-10 object-cover rounded"/></td><td className="px-6 py-4 text-sm text-slate-900">{course.title}</td><td className="px-6 py-4 text-sm text-slate-500">{course.teacher}</td><td className="px-6 py-4 text-sm text-slate-500">{Number(course.price) > 0 ? `$${course.price}`: t('free')}</td><td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center"><button onClick={() => openCourseModal(course)} className="text-[--accent] hover:text-[--accent-hover]"><EditIcon/></button><button onClick={() => handleDelete('courses', course.id)} className="text-red-600 hover:text-red-800 ml-4"><DeleteIcon/></button></td></tr>)) : (<tr><td colSpan={5} className="text-center py-8 text-slate-500">No courses found.</td></tr>)}</tbody></table></div></div> )}
                        {activeTab === 'users' && ( <div className="overflow-x-auto"><table className="min-w-full divide-y divide-slate-200"><thead className="bg-slate-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">{t('username')}</th><th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">{t('email')}</th><th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">{t('role')}</th><th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">{t('actions')}</th></tr></thead><tbody className="bg-white divide-y divide-slate-200">{users.length > 0 ? users.map(user => (<tr key={user.id} className="hover:bg-slate-50 transition-colors"><td className="px-6 py-4 text-sm text-slate-900">{user.username}</td><td className="px-6 py-4 text-sm text-slate-500">{user.email}</td><td className="px-6 py-4 text-sm text-slate-500">{user.role}</td><td className="px-6 py-4 flex items-center"><button onClick={() => openUserModal(user)} className="text-[--accent] hover:text-[--accent-hover]"><EditIcon/></button><button onClick={() => handleDelete('users', user.id)} className="text-red-600 hover:text-red-800 ml-4"><DeleteIcon/></button></td></tr>)) : (<tr><td colSpan={4} className="text-center py-8 text-slate-500">No users found.</td></tr>)}</tbody></table></div> )}
                        {activeTab === 'news' && ( <div><div className="flex justify-end mb-4"><button onClick={() => openNewsModal()} className="elegant-button">{t('addNews')}</button></div><div className="overflow-x-auto"><table className="min-w-full divide-y divide-slate-200"><thead className="bg-slate-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Image</th><th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">{t('title')}</th><th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">{t('date')}</th><th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">{t('actions')}</th></tr></thead><tbody className="bg-white divide-y divide-slate-200">{news.length > 0 ? news.map(article => (<tr key={article.id} className="hover:bg-slate-50 transition-colors"><td className="px-6 py-4"><img src={article.imageUrl} alt={article.title} className="w-16 h-10 object-cover rounded"/></td><td className="px-6 py-4 text-sm text-slate-900">{article.title}</td><td className="px-6 py-4 text-sm text-slate-500">{article.date}</td><td className="px-6 py-4 flex items-center"><button onClick={() => openNewsModal(article)} className="text-[--accent] hover:text-[--accent-hover]"><EditIcon/></button><button onClick={() => handleDelete('news', article.id)} className="text-red-600 hover:text-red-800 ml-4"><DeleteIcon/></button></td></tr>)) : (<tr><td colSpan={4} className="text-center py-8 text-slate-500">No news articles found.</td></tr>)}</tbody></table></div></div> )}
                        {activeTab === 'testimonials' && ( <div><div className="flex justify-end mb-4"><button onClick={() => openTestimonialModal()} className="elegant-button">{t('addTestimonial')}</button></div><div className="overflow-x-auto"><table className="min-w-full divide-y divide-slate-200"><thead className="bg-slate-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Image</th><th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">{t('author')}</th><th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">{t('quote')}</th><th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">{t('actions')}</th></tr></thead><tbody className="bg-white divide-y divide-slate-200">{testimonials.length > 0 ? testimonials.map(testimonial => (<tr key={testimonial.id} className="hover:bg-slate-50 transition-colors"><td className="px-6 py-4"><img src={testimonial.imageUrl} alt={testimonial.author} className="w-10 h-10 object-cover rounded-full"/></td><td className="px-6 py-4 text-sm text-slate-900">{testimonial.author}</td><td className="px-6 py-4 text-sm text-slate-500 truncate max-w-sm">{testimonial.quote}</td><td className="px-6 py-4 flex items-center"><button onClick={() => openTestimonialModal(testimonial)} className="text-[--accent] hover:text-[--accent-hover]"><EditIcon/></button><button onClick={() => handleDelete('testimonials', testimonial.id)} className="text-red-600 hover:text-red-800 ml-4"><DeleteIcon/></button></td></tr>)) : (<tr><td colSpan={4} className="text-center py-8 text-slate-500">No testimonials found.</td></tr>)}</tbody></table></div></div> )}
                        {activeTab === 'hero' && ( 
                            <div className="max-w-2xl mx-auto">
                                <form onSubmit={handleSaveHero}>
                                    <div className="mb-6">
                                        <h3 className="text-lg font-bold text-slate-800 mb-2">Home Page Hero</h3>
                                        <div className="mb-4"><label htmlFor="heroTitle" className="block text-sm font-medium text-slate-700">{t('title')}</label><input type="text" id="heroTitle" value={heroContent.title} onChange={e => setHeroContent(p => ({...p, title: e.target.value}))} className="mt-1 block w-full elegant-input" /></div>
                                        <div className="mb-4"><label htmlFor="heroSubtitle" className="block text-sm font-medium text-slate-700">{t('subtitle')}</label><textarea id="heroSubtitle" value={heroContent.subtitle} onChange={e => setHeroContent(p => ({...p, subtitle: e.target.value}))} rows={3} className="mt-1 block w-full elegant-input"></textarea></div>
                                        
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-slate-700">{t('backgroundImage')} URL</label>
                                            <input 
                                                type="text" 
                                                value={heroContent.backgroundImageUrl} 
                                                onChange={e => setHeroContent(p => ({...p, backgroundImageUrl: e.target.value}))} 
                                                className="mt-1 block w-full elegant-input" 
                                                placeholder="https://example.com/background.jpg"
                                            />
                                            {heroContent.backgroundImageUrl && (
                                                <div className="mt-2 relative h-32 w-full overflow-hidden rounded-md border border-slate-200">
                                                    <img src={heroContent.backgroundImageUrl} alt="Preview" className="w-full h-full object-cover"/>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="border-t border-slate-200 my-6 pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-800 mb-2">Sign In Page Image URL</h3>
                                            <input 
                                                type="text" 
                                                value={heroContent.signInImageUrl || ''} 
                                                onChange={e => setHeroContent(p => ({...p, signInImageUrl: e.target.value}))} 
                                                className="mt-1 block w-full elegant-input" 
                                                placeholder="https://example.com/signin.jpg"
                                            />
                                            {heroContent.signInImageUrl && <img src={heroContent.signInImageUrl} alt="Preview" className="mt-2 h-32 w-full object-cover rounded-md"/>}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-800 mb-2">Sign Up Page Image URL</h3>
                                            <input 
                                                type="text" 
                                                value={heroContent.signUpImageUrl || ''} 
                                                onChange={e => setHeroContent(p => ({...p, signUpImageUrl: e.target.value}))} 
                                                className="mt-1 block w-full elegant-input" 
                                                placeholder="https://example.com/signup.jpg"
                                            />
                                            {heroContent.signUpImageUrl && <img src={heroContent.signUpImageUrl} alt="Preview" className="mt-2 h-32 w-full object-cover rounded-md"/>}
                                        </div>
                                    </div>

                                    <div className="flex justify-end items-center mt-4"><span className="text-sm text-slate-500 mr-4">{heroSaveStatus}</span><button type="submit" className="elegant-button">{t('save')}</button></div>
                                </form>
                            </div> 
                        )}
                    </div>
                </div>
            </main>
            {isCourseModalOpen && currentCourse && <CourseModal course={currentCourse} onClose={() => setIsCourseModalOpen(false)} onSave={handleSaveCourse} setCourse={setCurrentCourse} />}
            {isUserModalOpen && currentUser && <UserModal user={currentUser} onClose={() => setIsUserModalOpen(false)} onSave={handleSaveUser} setUser={setCurrentUser} />}
            {isNewsModalOpen && currentNews && <NewsModal article={currentNews} onClose={() => setIsNewsModalOpen(false)} onSave={handleSaveNews} setArticle={setCurrentNews} />}
            {isTestimonialModalOpen && currentTestimonial && <TestimonialModal testimonial={currentTestimonial} onClose={() => setIsTestimonialModalOpen(false)} onSave={handleSaveTestimonial} setTestimonial={setCurrentTestimonial} />}
        </div>
    );
};

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
             <div className="space-y-2">
                <input type="text" value={block.value} onChange={handleValueChange} className="elegant-input w-full" placeholder="Enter image URL (https://...)"/>
                {block.value && <img src={block.value} alt="Preview" className="h-32 object-contain rounded border border-slate-200"/>}
             </div>
          )}
        </div>
      )}
    </Draggable>
  );
};

const CourseModal: React.FC<{course: Partial<Course>, onClose: ()=>void, onSave: (e: React.FormEvent)=>void, setCourse: React.Dispatch<React.SetStateAction<Partial<Course> | null>>}> = ({ course, onClose, onSave, setCourse }) => {
    const { t } = useLanguage();
    
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

    return (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-lg p-6 sm:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"><h2 className="text-2xl font-bold mb-6 text-slate-800">{course.id ? t('editCourse') : t('addCourse')}</h2><form onSubmit={onSave}><div className="space-y-4"><div><label className="block text-sm font-semibold text-slate-700 mb-1">{t('title')}</label><input name="title" value={course.title} onChange={handleChange} className="elegant-input"/></div><div><label className="block text-sm font-semibold text-slate-700 mb-1">{t('description')}</label><textarea name="description" value={course.description} onChange={handleChange} className="elegant-input"/></div><div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-semibold text-slate-700 mb-1">{t('category')}</label><input name="category" value={course.category} onChange={handleChange} className="elegant-input"/></div><div><label className="block text-sm font-semibold text-slate-700 mb-1">{t('teacher')}</label><input name="teacher" value={course.teacher} onChange={handleChange} className="elegant-input"/></div></div><div className="grid grid-cols-3 gap-4"><div><label className="block text-sm font-semibold text-slate-700 mb-1">{t('duration')}</label><input name="duration" value={course.duration} onChange={handleChange} className="elegant-input"/></div><div><label className="block text-sm font-semibold text-slate-700 mb-1">{t('rating')}</label><input name="rating" type="number" step="0.1" value={course.rating} onChange={handleChange} className="elegant-input"/></div><div><label className="block text-sm font-semibold text-slate-700 mb-1">{t('price')}</label><input name="price" type="number" value={course.price} onChange={handleChange} className="elegant-input"/></div></div>
    <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">{t('imageUrl')}</label>
        <input name="imageUrl" value={course.imageUrl} onChange={handleChange} className="elegant-input" placeholder="https://..."/>
        {course.imageUrl && <img src={course.imageUrl} alt="Preview" className="mt-2 h-20 object-cover rounded"/>}
    </div>
    </div>
    
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
const NewsModal: React.FC<{article: Partial<NewsArticle>, onClose: ()=>void, onSave: (e: React.FormEvent)=>void, setArticle: (a: any)=>void}> = ({ article, onClose, onSave, setArticle }) => {
    const { t } = useLanguage();
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setArticle((prev: NewsArticle) => ({...prev, [e.target.name]: e.target.value}));
    return (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-lg p-6 sm:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"><h2 className="text-2xl font-bold mb-6 text-slate-800">{article.id ? t('editNews') : t('addNews')}</h2><form onSubmit={onSave} className="space-y-4"><div><label className="block text-sm font-semibold text-slate-700 mb-1">{t('title')}</label><input name="title" value={article.title} onChange={handleChange} className="elegant-input"/></div><div><label className="block text-sm font-semibold text-slate-700 mb-1">{t('content')}</label><textarea name="content" value={article.content} onChange={handleChange} rows={5} className="elegant-input"/></div><div><label className="block text-sm font-semibold text-slate-700 mb-1">{t('date')}</label><input name="date" type="date" value={article.date} onChange={handleChange} className="elegant-input"/></div>
    <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">{t('imageUrl')}</label>
        <input name="imageUrl" value={article.imageUrl} onChange={handleChange} className="elegant-input" placeholder="https://..."/>
        {article.imageUrl && <img src={article.imageUrl} alt="Preview" className="mt-2 h-20 object-cover rounded"/>}
    </div>
    <div className="flex justify-end space-x-4 pt-4"><button type="button" onClick={onClose} className="elegant-button-outline">{t('cancel')}</button><button type="submit" className="elegant-button">{t('save')}</button></div></form></div></div>)
}
const TestimonialModal: React.FC<{testimonial: Partial<Testimonial>, onClose: ()=>void, onSave: (e: React.FormEvent)=>void, setTestimonial: (t: any)=>void}> = ({ testimonial, onClose, onSave, setTestimonial }) => {
    const { t } = useLanguage();
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setTestimonial((prev: Testimonial) => ({...prev, [e.target.name]: e.target.value}));
    return (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"><div className="bg-white rounded-lg p-6 sm:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"><h2 className="text-2xl font-bold mb-6 text-slate-800">{testimonial.id ? t('editTestimonial') : t('addTestimonial')}</h2><form onSubmit={onSave} className="space-y-4"><div><label className="block text-sm font-semibold text-slate-700 mb-1">{t('author')}</label><input name="author" value={testimonial.author} onChange={handleChange} className="elegant-input"/></div><div><label className="block text-sm font-semibold text-slate-700 mb-1">{t('role')}</label><input name="role" value={testimonial.role} onChange={handleChange} className="elegant-input"/></div><div><label className="block text-sm font-semibold text-slate-700 mb-1">{t('quote')}</label><textarea name="quote" value={testimonial.quote} onChange={handleChange} rows={4} className="elegant-input"/></div>
    <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">{t('imageUrl')}</label>
        <input name="imageUrl" value={testimonial.imageUrl} onChange={handleChange} className="elegant-input" placeholder="https://..."/>
        {testimonial.imageUrl && <img src={testimonial.imageUrl} alt="Preview" className="mt-2 h-20 object-cover rounded"/>}
    </div>
    <div className="flex justify-end space-x-4 pt-4"><button type="button" onClick={onClose} className="elegant-button-outline">{t('cancel')}</button><button type="submit" className="elegant-button">{t('save')}</button></div></form></div></div>)
}


export default AdminPage;
