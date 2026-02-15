
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

import Header from '../components/Header';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Course, User, UserRole, ContentBlock, HeroContent } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { EditIcon, DeleteIcon } from '../components/icons';

type AdminTab = 'courses' | 'users' | 'hero';

const AdminPage: React.FC = () => {
    const { t } = useLanguage();
    const [courses, setCourses] = useLocalStorage<Course[]>('courses', []);
    const [users] = useLocalStorage<User[]>('users_db', []);
    const [heroContent, setHeroContent] = useLocalStorage<HeroContent>('heroContent', {
      title: 'Innovate. Learn. Create.',
      subtitle: 'Step into the future of technology with our industry-leading courses. Your journey to mastery starts now.'
    });
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCourse, setCurrentCourse] = useState<Partial<Course> | null>(null);
    const [activeTab, setActiveTab] = useState<AdminTab>('courses');

    const openModal = (course?: Course) => {
        setCurrentCourse(course || { title: '', description: '', category: '', imageUrl: '', content: [] });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentCourse(null);
    };
    
    const onDrop = useCallback((acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if(event.target && typeof event.target.result === 'string') {
          setCurrentCourse(prev => prev ? {...prev, imageUrl: event.target.result as string} : null);
        }
      };
      reader.readAsDataURL(file);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: {'image/*':[]} });

    const handleSaveCourse = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentCourse) return;

        if (currentCourse.id) {
            setCourses(courses.map(c => c.id === currentCourse!.id ? currentCourse as Course : c));
        } else {
            setCourses([...courses, { ...currentCourse, id: Date.now().toString() } as Course]);
        }
        closeModal();
    };
    
    const handleDeleteCourse = (id: string) => {
        if(window.confirm('Are you sure you want to delete this course?')){
            setCourses(courses.filter(c => c.id !== id));
        }
    };

    const handleSaveHero = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Hero content saved!');
    };
    
    const addContentBlock = (type: 'text' | 'image' | 'video') => {
        if (!currentCourse) return;
        const newBlock: ContentBlock = { id: `block-${Date.now()}`, type, value: '' };
        const content = currentCourse.content ? [...currentCourse.content, newBlock] : [newBlock];
        setCurrentCourse({ ...currentCourse, content });
    };
    
    const handleContentBlockChange = (id: string, value: string) => {
        if (!currentCourse || !currentCourse.content) return;
        const updatedContent = currentCourse.content.map(block => block.id === id ? { ...block, value } : block);
        setCurrentCourse({ ...currentCourse, content: updatedContent });
    };
    
    const onDragEnd = (result: DropResult) => {
        if (!result.destination || !currentCourse || !currentCourse.content) return;
        const items = Array.from(currentCourse.content);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setCurrentCourse({ ...currentCourse, content: items });
    };

    const TabButton: React.FC<{tab: AdminTab, label: string}> = ({ tab, label }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tab ? 'bg-cyan-500 text-white' : 'text-slate-500 hover:bg-slate-200'}`}
        >
            {label}
        </button>
    );

    return (
        <div className="bg-slate-100 min-h-screen">
            <Header />
            <main className="container mx-auto p-8 pt-28">
                <h1 className="text-3xl font-bold text-slate-800 mb-6">{t('adminDashboard')}</h1>
                
                <div className="flex space-x-2 mb-8 border-b border-slate-300">
                    <TabButton tab="courses" label={t('courseManagement')} />
                    <TabButton tab="users" label={t('userManagement')} />
                    <TabButton tab="hero" label={t('heroManagement')} />
                </div>

                {activeTab === 'courses' && (
                    <div>
                        <div className="flex justify-end items-center mb-6">
                            <button 
                                onClick={() => openModal()}
                                className="tech-glow-button font-semibold py-2 px-6 rounded-lg text-white">
                                {t('addCourse')}
                            </button>
                        </div>
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            {courses.length > 0 ? (
                                <table className="min-w-full divide-y divide-slate-200">
                                    <thead className="bg-slate-800">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">{t('title')}</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">{t('category')}</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">{t('actions')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-slate-200">
                                        {courses.map(course => (
                                            <tr key={course.id}>
                                                <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-slate-900">{course.title}</div></td>
                                                <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-cyan-100 text-cyan-800">{course.category}</span></td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button onClick={() => openModal(course)} className="text-cyan-600 hover:text-cyan-900 flex items-center"><EditIcon/> {t('edit')}</button>
                                                    <button onClick={() => handleDeleteCourse(course.id)} className="text-red-600 hover:text-red-900 ml-4 flex items-center"><DeleteIcon/> {t('delete')}</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (<p className="text-center py-12 text-slate-500">{t('noCourses')}</p>)}
                        </div>
                    </div>
                )}
                {/* Other tabs remain the same */}
            </main>

            {isModalOpen && currentCourse && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                    <div className="bg-slate-800 text-white rounded-lg p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-700">
                        <h2 className="text-2xl font-bold mb-6">{currentCourse.id ? t('editCourse') : t('addCourse')}</h2>
                        <form onSubmit={handleSaveCourse} className="space-y-4">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-slate-300">{t('title')}</label>
                                <input type="text" id="title" value={currentCourse.title} onChange={e => setCurrentCourse({...currentCourse, title: e.target.value})} className="mt-1 block w-full tech-input rounded-md shadow-sm py-2 px-3 sm:text-sm" />
                            </div>
                             <div>
                                <label htmlFor="category" className="block text-sm font-medium text-slate-300">{t('category')}</label>
                                <input type="text" id="category" value={currentCourse.category} onChange={e => setCurrentCourse({...currentCourse, category: e.target.value})} className="mt-1 block w-full tech-input rounded-md shadow-sm py-2 px-3 sm:text-sm" />
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-slate-300">{t('description')}</label>
                                <textarea id="description" value={currentCourse.description} onChange={e => setCurrentCourse({...currentCourse, description: e.target.value})} rows={3} className="mt-1 block w-full tech-input rounded-md shadow-sm py-2 px-3 sm:text-sm"></textarea>
                            </div>
                            
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-300">{t('imageUrl')}</label>
                                <div {...getRootProps()} className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-600 border-dashed rounded-md cursor-pointer ${isDragActive ? 'border-cyan-500 bg-slate-700' : ''}`}>
                                  <input {...getInputProps()} />
                                  <div className="space-y-1 text-center">
                                    {currentCourse.imageUrl ? <img src={currentCourse.imageUrl} alt="Preview" className="mx-auto h-24 w-auto"/> : <svg className="mx-auto h-12 w-12 text-slate-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path></svg>}
                                    <p className="text-sm text-slate-400">{t('dropImage')}</p>
                                  </div>
                                </div>
                            </div>
                            
                            <h3 className="text-lg font-medium text-slate-200 mt-6 mb-4">{t('contentBlocks')}</h3>
                            {/* ... Drag and Drop Context ... */}
                            
                            <div className="flex justify-end space-x-4 mt-8">
                                <button type="button" onClick={closeModal} className="bg-slate-600 text-slate-50 font-semibold py-2 px-4 rounded-lg hover:bg-slate-700">{t('cancel')}</button>
                                <button type="submit" className="tech-glow-button text-white font-semibold py-2 px-4 rounded-lg">{t('save')}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPage;
