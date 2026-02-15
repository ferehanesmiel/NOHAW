
import React from 'react';
import { Course } from '../types';

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <div className="elegant-card overflow-hidden group">
      <div className="relative h-48">
        <img src={course.imageUrl} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      </div>
      <div className="p-6">
          <div className="flex justify-between items-center text-sm text-slate-500 mb-2">
              <span>By {course.teacher}</span>
              <span>{course.duration}</span>
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">{course.title}</h3>
          <p className="text-slate-600 text-sm mb-4">{course.description}</p>
          <div className="flex justify-between items-center">
             <span className="text-xs font-semibold text-[--accent] uppercase bg-yellow-50 px-2 py-1 rounded">{course.category}</span>
             <span className="text-sm font-bold text-yellow-500">⭐ {course.rating.toFixed(1)}</span>
          </div>
      </div>
    </div>
  );
};

export default CourseCard;
