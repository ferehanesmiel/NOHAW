
import React from 'react';
import { Course } from '../types';

interface CourseCardProps {
  course: Course;
  color: 'blue' | 'pink' | 'yellow'; // Kept for image variety, but not used for border
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const imageUrls: {[key: string]: string} = {
    '1': 'https://source.unsplash.com/random/400x300?coding,data',
    '2': 'https://source.unsplash.com/random/400x300?network,server',
    '3': 'https://source.unsplash.com/random/400x300?ai,robot',
  }
  const image = imageUrls[course.id] || course.imageUrl;

  return (
    <div className="tech-card rounded-2xl overflow-hidden group">
      <div className="relative h-48">
        <img src={image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors"></div>
      </div>
      <div className="p-6">
          <span className="text-xs font-semibold text-cyan-400 uppercase">{course.category}</span>
          <h3 className="text-xl font-bold text-slate-50 mt-2 mb-2">{course.title}</h3>
          <p className="text-slate-400 text-sm">{course.description}</p>
      </div>
    </div>
  );
};

export default CourseCard;
