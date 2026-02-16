
import * as React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { CourseProvider } from './contexts/CourseContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import { UserRole } from './types';
import { LogoIcon } from './components/icons';

// Lazy load pages to reduce initial bundle size for mobile performance
const HomePage = React.lazy(() => import('./pages/HomePage'));
const AdminPage = React.lazy(() => import('./pages/AdminPage'));
const UserDashboardPage = React.lazy(() => import('./pages/UserDashboardPage'));
const CoursesPage = React.lazy(() => import('./pages/CoursesPage'));
const CourseDetailPage = React.lazy(() => import('./pages/CourseDetailPage'));
const SignInPage = React.lazy(() => import('./pages/SignInPage'));
const SignUpPage = React.lazy(() => import('./pages/SignUpPage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const AboutUsPage = React.lazy(() => import('./pages/AboutUsPage'));
const SupportPage = React.lazy(() => import('./pages/SupportPage'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-slate-50">
    <div className="flex flex-col items-center animate-pulse">
        <div className="scale-150 mb-8">
            <LogoIcon />
        </div>
        <div className="h-1.5 w-32 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-[--accent] w-1/2 animate-[shimmer_1s_infinite]"></div>
        </div>
    </div>
  </div>
);

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CourseProvider>
          <ThemeProvider>
            <HashRouter>
              <React.Suspense fallback={<LoadingFallback />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/courses" element={<CoursesPage />} />
                  <Route path="/signin" element={<SignInPage />} />
                  <Route path="/signup" element={<SignUpPage />} />
                  <Route path="/about-us" element={<AboutUsPage />} />
                  <Route path="/support" element={<SupportPage />} />

                  <Route 
                    path="/admin" 
                    element={
                      <ProtectedRoute roles={[UserRole.ADMIN]}>
                        <AdminPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/dashboard" 
                    element={
                      <ProtectedRoute>
                        <UserDashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route 
                    path="/profile" 
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route 
                    path="/courses/:courseId"
                    element={
                      <ProtectedRoute>
                        <CourseDetailPage />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </React.Suspense>
            </HashRouter>
          </ThemeProvider>
        </CourseProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;