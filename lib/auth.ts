import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * @param clerkUser 
 *                  
 */
export async function syncUserFromClerk(clerkUser: { id: string; username: string; email?: string }) {
  try {
    let user = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkId: clerkUser.id,
          username: clerkUser.username,
          email: clerkUser.email,
        },
      });
    } else {
      user = await prisma.user.update({
        where: { clerkId: clerkUser.id },
        data: {
          username: clerkUser.username,
          email: clerkUser.email,
        },
      });
    }

    return user;
  } catch (error) {
    console.error("Error syncing user from Clerk:", error);
    throw error;
  }
}