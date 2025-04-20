import { Post as PrismaPost, User as PrismaUser } from '@prisma/client';

declare module '@prisma/client' {
  interface Post extends PrismaPost {
    upvotedBy: PrismaUser[];
  }
  
  interface User extends PrismaUser {
    upvotedPosts: PrismaPost[];
  }
}