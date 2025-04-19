import { getAuth, clerkClient } from '@clerk/nextjs/server';
import prisma from './prisma';

export async function getOrCreateUser(request: Request) {
  const { userId } = getAuth(request);
  if (!userId) return null;

  // Try to find the user in our Prisma database
  let user = await prisma.user.findUnique({ where: { clerkId: userId } });
  if (!user) {
    // Get the clerk client instance and cast it to fix type errors
    const client = (await clerkClient()) as unknown as { users: { getUser: (id: string) => Promise<any> } };
    // Fetch user details from Clerk
    const clerkUser = await client.users.getUser(userId);
    const email = clerkUser.emailAddresses && clerkUser.emailAddresses.length > 0
      ? clerkUser.emailAddresses[0]?.emailAddress
      : `unknown-${userId}@example.com`;
    const name = clerkUser.firstName || null;

    // Create new user record in Prisma
    user = await prisma.user.create({
      data: {
        clerkId: userId,
        email,
        name,
      },
    });
  }
  return user;
} 