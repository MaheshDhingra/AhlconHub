import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const post = await prisma.post.findUnique({
      where: { id: id },
      include: {
        user: true,
        upvotes: true
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
  const { id } = await params;
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const existingUpvote = await prisma.upvote.findUnique({
      where: {
        clerkUserId_postId: {
          clerkUserId,
          postId: id,
        },
      },
    });

    if (existingUpvote) {
      return NextResponse.json(
        { error: 'Already upvoted' },
        { status: 400 }
      );
    }

    const [upvote, updatedPost] = await prisma.$transaction([
      prisma.upvote.create({
        data: {
          clerkUserId,
          postId: id
        }
      }),
      prisma.post.update({
        where: { id: id },
        data: {
          upvotes: {
            connect: {
              clerkUserId_postId: {
                clerkUserId: clerkUserId,
                postId: id
              }
            }
          }
        }
      })
    ]);

    return NextResponse.json(updatedPost);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}