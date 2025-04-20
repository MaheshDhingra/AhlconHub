import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const isProtectedRoute = createRouteMatcher(["/posts(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    const { userId: clerkUserId } = auth();
    
    if (clerkUserId) {
      // Sync user with database
      await prisma.user.upsert({
        where: { clerkUserId },
        create: {
          clerkUserId,
          email: "", // Add email from Clerk if available
          name: "Anonymous",
        },
        update: {},
      });
    }
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};