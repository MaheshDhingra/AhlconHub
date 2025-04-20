import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function POST(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { content, parentId } = body;

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    // Validate parentId exists if provided
    if (parentId) {
      const parentExists = await prisma.comment.findUnique({
        where: { id: parentId }
      });
      if (!parentExists) {
        return NextResponse.json(
          { error: 'Parent comment not found' },
          { status: 404 }
        );
      }
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        postId: params.postId,
        userId: clerkUserId,
        parentId: parentId || undefined, // Use undefined instead of null
      },
      include: {
        user: true,
        replies: true,
      },
    });

    return NextResponse.json(comment, { status: 201 });

  } catch (error) {
    console.error('[COMMENTS_POST]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function GET(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const comments = await prisma.comment.findMany({
      where: {
        postId: params.postId,
        parentId: null,
      },
      include: {
        user: true,
        replies: {
          include: {
            user: true,
            replies: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(comments);
    
  } catch (error) {
    console.error('[COMMENTS_GET]', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}