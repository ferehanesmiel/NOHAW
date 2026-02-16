
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Course } from '../types';
import { useCourse } from '../contexts/CourseContext';
import { useLanguage } from '../contexts/LanguageContext';
import TechNetworkArt from './TechNetworkArt';

interface CourseCardProps {
  course: Course;
  onEnrollClick: (course: Course) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onEnrollClick }) => {
  const { t } = useLanguage();
  const { enrollments } = useCourse();
  const navigate = useNavigate();
  const isEnrolled = enrollments.includes(course.id);
  
  return (
    <div className="elegant-card overflow-hidden group flex flex-col h-full">
      <div className="relative h-48 overflow-hidden bg-slate-900">
        <TechNetworkArt id={course.id} className="w-full h-full group-hover:scale-105 transition-transform duration-700" />
        
        {isEnrolled && (
             <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md z-10">
                 {t('enrolled')}
             </div>
        )}
      </div>
      <div className="p-6 flex-grow flex flex-col">
          <div className="flex justify-between items-center text-sm text-slate-500 mb-2">
              <div className="flex items-center">
                  <span className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold mr-2 text-slate-600">
                    {course.teacher.charAt(0)}
                  </span>
                  <span>{course.teacher}</span>
              </div>
              <span>{course.duration}</span>
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2 leading-tight">{course.title}</h3>
          <p className="text-slate-600 text-sm mb-4 flex-grow line-clamp-3">{course.description}</p>
          <div className="flex justify-between items-center mb-4">
             <span className="text-xs font-semibold text-[--accent] uppercase bg-purple-50 px-2 py-1 rounded border border-purple-100">{course.category}</span>
             <div className="flex items-center text-amber-400">
                 <span className="text-sm font-bold mr-1">{course.rating.toFixed(1)}</span>
                 <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
             </div>
          </div>
          <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xl font-bold text-slate-800">
                {course.price > 0 ? `$${course.price}` : t('free')}
            </p>
             {isEnrolled ? (
                <button onClick={() => navigate(`/courses/${course.id}`)} className="elegant-button-outline px-4 py-2 text-sm">
                    {t('goToCourse')}
                </button>
             ) : (
                <button onClick={() => onEnrollClick(course)} className="elegant-button px-4 py-2 text-sm shadow-md">
                    {t('enroll')}
                </button>
             )}
          </div>
      </div>
    </div>
  );
};

export default CourseCard;
