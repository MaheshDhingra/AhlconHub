import { getAuth, clerkClient } from '@clerk/nextjs/server';
import prisma from './prisma';

export async function getOrCreateUser(request: Request) {
  const { userId } = getAuth(request);
  if (!userId) return null;

  // Try to find the user in our Prisma database
  let user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) {
    // Get the clerk client instance
    const client = await clerkClient();
    // Fetch user details from Clerk
    const clerkUser = await client.users.getUser(userId);
    const email = clerkUser.emailAddresses && clerkUser.emailAddresses.length > 0 ? clerkUser.emailAddresses[0]?.emailAddress : null;
    const name = clerkUser.firstName || null;

    // Create new user record in Prisma
    user = await prisma.user.create({
      data: {
        clerkId: userId,
        email: email || `unknown-${userId}@example.com`,
        name,
      },
    });
  }
  return user;
} 