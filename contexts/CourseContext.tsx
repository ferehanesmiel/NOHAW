
import React, { createContext, useContext, PropsWithChildren, useState } from 'react';
import { Course } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useAuth } from './AuthContext';

const mockCourses: Course[] = [
    { id: '1', title: 'Modern Web Development', description: 'Build dynamic, responsive websites with the latest frameworks and technologies.', category: 'Development', imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60', teacher: 'Alex Doe', duration: '12 Hours', rating: 4.8, price: 50, content: [{id: 'c1', type: 'text', value: 'Welcome to Modern Web Development!'}] },
    { id: '2', title: 'UI/UX Design Principles', description: 'Learn the fundamentals of creating beautiful and user-friendly digital products.', category: 'Design', imageUrl: 'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60', teacher: 'Jane Smith', duration: '8 Hours', rating: 4.9, price: 30, content: [{id: 'c2', type: 'text', value: 'Introduction to UI/UX Design.'}] },
    { id: '3', title: 'Cloud Computing Essentials', description: 'Understand and leverage the power of cloud infrastructure and services.', category: 'Cloud', imageUrl: 'https://images.unsplash.com/photo-1546900703-cf06143d1239?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60', teacher: 'Sam Wilson', duration: '10 Hours', rating: 4.7, price: 0, content: [{id: 'c3', type: 'text', value: 'What is Cloud Computing?'}] },
];

type Enrollments = { [userId: string]: string[] }; // userId -> courseId[]
type Progress = { [userId: string]: { [courseId: string]: number } }; // userId -> courseId -> percentage

type CourseContextType = {
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  enrollments: string[]; // for current user
  progress: { [courseId: string]: number }; // for current user
  enroll: (courseId: string) => void;
  updateProgress: (courseId: string, newProgress: number) => void;
};

const CourseContext = createContext<CourseContextType | undefined>(undefined);

export const CourseProvider = ({ children }: PropsWithChildren) => {
    const { user } = useAuth();
    const [courses, setCourses] = useLocalStorage<Course[]>('courses', mockCourses);
    const [allEnrollments, setAllEnrollments] = useLocalStorage<Enrollments>('enrollments', {});
    const [allProgress, setAllProgress] = useLocalStorage<Progress>('progress', {});

    const enroll = (courseId: string) => {
        if (!user) return;
        setAllEnrollments(prev => {
            const userEnrollments = prev[user.id] || [];
            if (!userEnrollments.includes(courseId)) {
                return { ...prev, [user.id]: [...userEnrollments, courseId] };
            }
            return prev;
        });
    };

    const updateProgress = (courseId: string, newProgress: number) => {
        if (!user) return;
        setAllProgress(prev => {
            const userProgress = prev[user.id] || {};
            return {
                ...prev,
                [user.id]: { ...userProgress, [courseId]: newProgress },
            };
        });
    };

    const userEnrollments = user ? allEnrollments[user.id] || [] : [];
    const userProgress = user ? allProgress[user.id] || {} : {};

    return (
        <CourseContext.Provider value={{ courses, setCourses, enrollments: userEnrollments, progress: userProgress, enroll, updateProgress }}>
            {children}
        </CourseContext.Provider>
    );
};

export const useCourse = (): CourseContextType => {
    const context = useContext(CourseContext);
    if (!context) {
        throw new Error('useCourse must be used within a CourseProvider');
    }
    return context;
};
