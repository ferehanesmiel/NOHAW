
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import UserDashboardPage from './pages/UserDashboardPage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import ProfilePage from './pages/ProfilePage';
import AboutUsPage from './pages/AboutUsPage';
import SupportPage from './pages/SupportPage';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { CourseProvider } from './contexts/CourseContext';
import ProtectedRoute from './components/ProtectedRoute';
import { UserRole } from './types';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CourseProvider>
          <HashRouter>
            <div className="bg-slate-50 min-h-screen">
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
            </div>
          </HashRouter>
        </CourseProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
