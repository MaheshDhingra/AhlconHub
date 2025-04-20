import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const post = await prisma.post.findUnique({
      where: { id: params.id },
      include: {
        user: true,
        upvotedBy: {
          select: {
            clerkUserId: true,
            name: true,
            imageUrl: true
          }
        },
      },
    });

    if (!post) return NextResponse.json(
      { error: 'Post not found' }, 
      { status: 404 }
    );

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

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

    const user = await prisma.user.findUnique({
      where: { clerkUserId },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const existingVote = await prisma.post.findFirst({
      where: {
        id: params.id,
        upvotedBy: {
          some: { clerkUserId }
        }
      }
    });

    if (existingVote) {
      return NextResponse.json(
        { error: 'Already upvoted' },
        { status: 400 }
      );
    }

    const updatedPost = await prisma.post.update({
      where: { id: params.id },
      data: {
        upvotes: { increment: 1 },
        upvotedBy: {
          connect: { clerkUserId: clerkUserId }
        }
      },
      include: {
        upvotedBy: {
          select: {
            clerkUserId: true
          }
        }
      }
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}