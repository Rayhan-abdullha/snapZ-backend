export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum ContentStatus {
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export interface BaseEntity {
  id: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface User extends BaseEntity {
  name: string;
  email: string;
  image?: string;
  role: UserRole;
  bio?: string;
}

export interface Comment extends BaseEntity {
  message: string;
  authorId: string;
  author: User;
  postId?: string;
  videoId?: string;
  parentId?: string;
  replies?: Comment[];
}

export interface Like {
  id: string;
  userId: string;
  postId?: string;
  videoId?: string;
}

// For Admin "Blocks" (Editorial Layouts)
export interface PostBlock {
  id: string;
  type: 'heading' | 'paragraph' | 'image' | 'quote' | 'code';
  content: string;
}

export interface Post extends BaseEntity {
  title: string;
  slug: string;
  category: string;
  coverImage: string;
  status?: ContentStatus;
  content?: string;       // Used for simple user-submitted snaps
  blocks?: PostBlock[];   // Used for structured admin articles
  viewCount?: number;
  authorId: string;
  author?: User;
  _count?: {
    comments: number;
    likes: number;
  };
}

export interface Video extends BaseEntity {
  title: string;
  url: string;            // The YouTube/Vimeo/Direct link
  category: string;
  tags: string[];
  status: ContentStatus;
  isLive: boolean;        // High-priority flag for the Live TV Bar
  viewCount: number;
  authorId: string;
  author: User;
  _count?: {
    comments: number;
    likes: number;
  };
}
