import { currentUser } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

export const checkUser = async () => {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) return null;

    // Check for existing user
    const existingUser = await db.user.findUnique({
      where: { clerkUserId: clerkUser.id },
    });

    if (existingUser) return existingUser;

    // Validate required email
    const primaryEmail = clerkUser.emailAddresses.find(
      (email) => email.id === clerkUser.primaryEmailAddressId
    )?.emailAddress;

    if (!primaryEmail) {
      throw new Error('No valid email found for Clerk user');
    }

    // Create new user
    const newUser = await db.user.create({
      data: {
        clerkUserId: clerkUser.id,
        email: primaryEmail,
        name: [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' '),
        imageUrl: clerkUser.imageUrl,
      },
    });

    return newUser;
  } catch (error) {
    console.error('User synchronization error:', error);
    return null;
  }
};