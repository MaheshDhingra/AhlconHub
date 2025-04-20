import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import prisma from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Validate the post ID format
    if (!uuidv4.validate(params.id)) {
      return NextResponse.json(
        { error: 'Invalid post ID format' },
        { status: 400 }
      );
    }

    // Check authentication
    const { userId: clerkUserId } = auth();
    if (!clerkUserId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify the post exists
    const postExists = await prisma.post.findUnique({
      where: { id: params.id }
    });
    if (!postExists) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Check for existing upvote
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

    // Transaction for upvote creation and post update
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
    console.error('Error in POST /api/posts/[id]:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}