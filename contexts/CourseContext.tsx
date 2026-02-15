
import * as React from 'react';
import { Course } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useAuth } from './AuthContext';
import { mockCourses } from '../utils/mockData';

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

const CourseContext = React.createContext<CourseContextType | undefined>(undefined);

export const CourseProvider = ({ children }: React.PropsWithChildren) => {
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
    const context = React.useContext(CourseContext);
    if (!context) {
        throw new Error('useCourse must be used within a CourseProvider');
    }
    return context;
};