
export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  teacher: string;
  duration: string;
  rating: number;
  price: number; // 0 for free
  content?: ContentBlock[];
}

export enum Language {
  EN = 'en',
  AM = 'am',
  OM = 'om',
  TI = 'ti',
}

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  password?: string;
  profilePictureUrl?: string;
  bio?: string;
}

export type ContentBlock = {
  id: string;
  type: 'text' | 'image' | 'video';
  value: string;
};

export interface HeroContent {
  title: string;
  subtitle: string;
  backgroundImageUrl: string;
  signInImageUrl?: string;
  signUpImageUrl?: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  date: string;
}

export interface Testimonial {
  id: string;
  author: string;
  role: string;
  quote: string;
  imageUrl: string;
}
