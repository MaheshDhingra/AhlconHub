import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

export const checkUser = async () => {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) return null;

    const existingUser = await db.user.findUnique({
      where: { clerkUserId: clerkUser.id },
    });

    if (existingUser) {return existingUser}else {
      console.log("Errror")
    }

    
    const newUser = await db.user.create({
      data: {
        clerkUserId: clerkUser.id,
      },
    });

    return newUser;
  } catch (error) {
    console.error('User synchronization error:', error);
    return null;
  }
};