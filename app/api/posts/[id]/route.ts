import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check existing upvote
    const existingUpvote = await prisma.upvote.findUnique({
      where: {
        clerkUserId_postId: {
          clerkUserId,
          postId: params.id
        }
      }
    });

    if (existingUpvote) {
      return NextResponse.json(
        { error: 'Already upvoted' },
        { status: 400 }
      );
    }

    // Create upvote and update count
    const [upvote, updatedPost] = await prisma.$transaction([
      prisma.upvote.create({
        data: {
          clerkUserId,
          postId: params.id
        }
      }),
      prisma.post.update({
        where: { id: params.id },
        data: { upvotes: { increment: 1 } }
      })
    ]);

    return NextResponse.json(updatedPost);
    
  } catch (error) {
    console.error('[UPVOTE_ERROR]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}