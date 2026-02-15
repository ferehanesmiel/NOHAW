
import React, { createContext, useState, useContext, PropsWithChildren } from 'react';
import { User, UserRole } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

type AuthContextType = {
  user: User | null;
  signIn: (email: string, password?: string, isGoogleSignIn?: boolean) => boolean;
  signUp: (email: string, password: string, username: string) => boolean;
  signOut: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  updateUser: (username: string) => void;
  changePassword: (currentPassword: string, newPassword: string) => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAIL = 'esmielferehan@gmail.com';
const ADMIN_PASS = 'esmielferehan@123';

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useLocalStorage<User | null>('user', null);
  const [users, setUsers] = useLocalStorage<User[]>('users_db', [
    { id: '1', email: ADMIN_EMAIL, password: ADMIN_PASS, username: 'Admin User', role: UserRole.ADMIN }
  ]);

  const signIn = (email: string, password?: string, isGoogleSignIn = false): boolean => {
    if (isGoogleSignIn) {
      const googleUser: User = { id: 'google_user', email: 'user@google.com', username: 'Google User', role: UserRole.USER };
      setUser(googleUser);
      return true;
    }

    if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
      setUser(users[0]);
      return true;
    }

    const foundUser = users.find(u => u.email === email && u.password === password);
    if(foundUser) {
      setUser(foundUser);
      return true;
    }

    return false;
  };

  const signUp = (email: string, password: string, username: string): boolean => {
    const existingUser = users.find(u => u.email === email);
    if(existingUser) {
        return false; // User already exists
    }
    const newUser: User = {
        id: Date.now().toString(),
        email,
        password,
        username,
        role: UserRole.USER,
    };
    setUsers([...users, newUser]);
    setUser(newUser);
    return true;
  };
  
  const updateUser = (username: string) => {
    if (user) {
      const updatedUser = { ...user, username };
      setUser(updatedUser);
      setUsers(currentUsers => currentUsers.map(u => u.id === user.id ? updatedUser : u));
    }
  };

  const changePassword = (currentPassword: string, newPassword: string): boolean => {
    if (!user || user.password !== currentPassword) {
      return false;
    }
    
    const updatedUser = { ...user, password: newPassword };
    setUser(updatedUser);
    setUsers(currentUsers => currentUsers.map(u => u.id === user.id ? updatedUser : u));
    return true;
  };

  const signOut = () => {
    setUser(null);
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === UserRole.ADMIN;

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut, isAuthenticated, isAdmin, updateUser, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
