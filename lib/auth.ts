import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

export const getOrCreateUser = async () => {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return null;
    }

    // Check if user exists in database
    const existingUser = await db.user.findUnique({
      where: {
        id: clerkUser.id, 
      },
    });

    if (existingUser) {
      return existingUser;
    }

    // Create new user if not exists
    const newUser = await db.user.create({
      data: {
        id: clerkUser.id, // Directly use Clerk's user ID
        email: clerkUser.emailAddresses[0]?.emailAddress,
        username: clerkUser.username || null,
        name: [clerkUser.firstName, clerkUser.lastName].join(' ').trim(),
        imageUrl: clerkUser.imageUrl,
      },
    });

    return newUser;

  } catch (error) {
    console.error('Error in getOrCreateUser:', error);
    return null;
  }
};