import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const isProtectedRoute = createRouteMatcher([
  "/posts(.*)",
  "/api/posts(.*)"
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    const { userId: clerkUserId } = auth();
    
    if (clerkUserId) {
      // Sync user with database
      await prisma.user.upsert({
        where: { clerkUserId },
        create: {
          clerkUserId,
          email: "", // Update with Clerk data if available
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