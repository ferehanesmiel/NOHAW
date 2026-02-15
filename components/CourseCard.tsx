
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Course } from '../types';
import { useCourse } from '../contexts/CourseContext';
import { useLanguage } from '../contexts/LanguageContext';

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
    <div className="elegant-card overflow-hidden group flex flex-col">
      <div className="relative h-48">
        <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      </div>
      <div className="p-6 flex-grow flex flex-col">
          <div className="flex justify-between items-center text-sm text-slate-500 mb-2">
              <span>By {course.teacher}</span>
              <span>{course.duration}</span>
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">{course.title}</h3>
          <p className="text-slate-600 text-sm mb-4 flex-grow">{course.description}</p>
          <div className="flex justify-between items-center mb-4">
             <span className="text-xs font-semibold text-[--accent] uppercase bg-yellow-50 px-2 py-1 rounded">{course.category}</span>
             <span className="text-sm font-bold text-yellow-500">⭐ {course.rating.toFixed(1)}</span>
          </div>
          <div className="mt-auto pt-4 border-t border-slate-200 flex items-center justify-between">
            <p className="text-xl font-bold text-slate-800">
                {course.price > 0 ? `$${course.price}` : t('free')}
            </p>
             {isEnrolled ? (
                <button onClick={() => navigate(`/courses/${course.id}`)} className="elegant-button-outline">
                    {t('goToCourse')}
                </button>
             ) : (
                <button onClick={() => onEnrollClick(course)} className="elegant-button">
                    {t('enroll')}
                </button>
             )}
          </div>
      </div>
    </div>
  );
};

export default CourseCard;
