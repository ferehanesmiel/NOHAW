
import { Course, NewsArticle, Testimonial } from '../types';

export const mockCourses: Course[] = [
    { id: '1', title: 'Modern Web Development', description: 'Build dynamic, responsive websites with the latest frameworks and technologies.', category: 'Development', imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60', teacher: 'Alex Doe', duration: '12 Hours', rating: 4.8, price: 50, content: [{id: 'c1-1', type: 'text', value: 'Welcome to Modern Web Development! This course covers the latest in frontend and backend technologies.'}, {id: 'c1-2', type: 'video', value: 'https://www.youtube.com/embed/dQw4w9WgXcQ'}] },
    { id: '2', title: 'UI/UX Design Principles', description: 'Learn the fundamentals of creating beautiful and user-friendly digital products.', category: 'Design', imageUrl: 'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60', teacher: 'Jane Smith', duration: '8 Hours', rating: 4.9, price: 30, content: [{id: 'c2-1', type: 'text', value: 'Introduction to UI/UX Design.'}, {id: 'c2-2', type: 'image', value: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60'}] },
    { id: '3', title: 'Cloud Computing Essentials', description: 'Understand and leverage the power of cloud infrastructure and services.', category: 'Cloud', imageUrl: 'https://images.unsplash.com/photo-1546900703-cf06143d1239?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60', teacher: 'Sam Wilson', duration: '10 Hours', rating: 4.7, price: 0, content: [{id: 'c3-1', type: 'text', value: 'What is Cloud Computing?'}] },
];

export const mockNews: NewsArticle[] = [
    { id: '1', title: 'New Course Launch: Advanced TypeScript', content: 'Explore the full potential of TypeScript with our new advanced course, covering generics, decorators, and more.', imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60', date: '2024-07-20' },
    { id: '2', title: 'Summer Scholarship Program Announced', content: 'We are excited to announce our summer scholarship program for aspiring developers. Apply now!', imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60', date: '2024-07-15' },
];

export const mockTestimonials: Testimonial[] = [
    { id: '1', author: 'Sarah Johnson', role: 'Web Developer', quote: 'This platform transformed my career. The hands-on projects and expert instructors were invaluable.', imageUrl: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { id: '2', author: 'Michael Chen', role: 'UX Designer', quote: 'The UI/UX course was brilliant. I learned so much and was able to build a fantastic portfolio.', imageUrl: 'https://randomuser.me/api/portraits/men/32.jpg' },
];
