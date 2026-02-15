
import * as React from 'react';
import { Course } from '../types';
import { useAuth } from './AuthContext';
import { db } from '../firebase';
import { 
    collection, 
    getDocs, 
    doc, 
    setDoc, 
    updateDoc, 
    arrayUnion, 
    getDoc,
    onSnapshot
} from 'firebase/firestore';

type CourseContextType = {
  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>; // kept for AdminPage compatibility, though in real app we'd use DB methods
  enrollments: string[]; // for current user
  progress: { [courseId: string]: number }; // for current user
  enroll: (courseId: string) => Promise<void>;
  updateProgress: (courseId: string, newProgress: number) => Promise<void>;
  refreshCourses: () => void;
};

const CourseContext = React.createContext<CourseContextType | undefined>(undefined);

export const CourseProvider = ({ children }: React.PropsWithChildren) => {
    const { user } = useAuth();
    const [courses, setCourses] = React.useState<Course[]>([]);
    const [enrollments, setEnrollments] = React.useState<string[]>([]);
    const [progress, setProgress] = React.useState<{ [courseId: string]: number }>({});

    // Fetch Courses Realtime
    React.useEffect(() => {
        const unsubscribe = onSnapshot(
            collection(db, 'courses'), 
            (snapshot) => {
                const courseList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
                setCourses(courseList);
            },
            (error) => {
                console.error("Error fetching courses:", error);
            }
        );
        return unsubscribe;
    }, []);

    // Fetch User Enrollments & Progress
    React.useEffect(() => {
        if (!user) {
            setEnrollments([]);
            setProgress({});
            return;
        }

        const userRef = doc(db, 'users', user.id);
        const unsubscribe = onSnapshot(
            userRef, 
            (docSnap) => {
                 if (docSnap.exists()) {
                     const data = docSnap.data();
                     setEnrollments(data.enrolledCourses || []);
                     setProgress(data.courseProgress || {});
                 }
            },
            (error) => {
                console.error("Error fetching user data:", error);
            }
        );

        return unsubscribe;
    }, [user]);

    const enroll = async (courseId: string) => {
        if (!user) return;
        
        // Optimistic UI update
        setEnrollments(prev => [...prev, courseId]);

        const userRef = doc(db, 'users', user.id);
        try {
            await updateDoc(userRef, {
                enrolledCourses: arrayUnion(courseId)
            });
        } catch (error) {
             console.error("Error enrolling course:", error);
        }
    };

    const updateProgress = async (courseId: string, newProgress: number) => {
        if (!user) return;

        // Optimistic UI update
        setProgress(prev => ({...prev, [courseId]: newProgress}));

        const userRef = doc(db, 'users', user.id);
        try {
            await updateDoc(userRef, {
                [`courseProgress.${courseId}`]: newProgress
            });
        } catch (error) {
             console.error("Error updating progress:", error);
        }
    };

    const refreshCourses = async () => {
         try {
             const snapshot = await getDocs(collection(db, 'courses'));
             const courseList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
             setCourses(courseList);
         } catch (error) {
             console.error("Refresh failed:", error);
         }
    };

    return (
        <CourseContext.Provider value={{ courses, setCourses, enrollments, progress, enroll, updateProgress, refreshCourses }}>
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
