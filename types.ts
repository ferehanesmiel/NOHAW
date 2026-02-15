
export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
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
}

export type ContentBlock = {
  id: string;
  type: 'text' | 'image' | 'video';
  value: string;
};

export interface HeroContent {
  title: string;
  subtitle: string;
}
