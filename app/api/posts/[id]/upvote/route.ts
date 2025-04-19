import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const { userId } = getAuth(request);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id: params.id },
      include: { upvotedBy: true },
    });
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    const alreadyUpvoted = post.upvotedBy.some((user: { clerkId: string }) => user.clerkId === userId);
    let updatedPost;

    if (alreadyUpvoted) {
      updatedPost = await prisma.post.update({
        where: { id: params.id },
        data: {
          upvotedBy: {
            disconnect: { clerkId: userId }
          }
        },
        include: { upvotedBy: true },
      });
    } else {
      updatedPost = await prisma.post.update({
        where: { id: params.id },
        data: {
          upvotedBy: {
            connect: { clerkId: userId }
          }
        },
        include: { upvotedBy: true },
      });
    }

    return NextResponse.json({ upvotes: updatedPost.upvotedBy.length });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', details: error }, { status: 500 });
  }
} 