export type PostType =
  | 'COMPLAINT'
  | 'DISCUSSION'
  | 'QUESTION'
  | 'ANNOUNCEMENT';

export interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  upvotes: number;
  type: PostType;
  createdAt: Date;
}