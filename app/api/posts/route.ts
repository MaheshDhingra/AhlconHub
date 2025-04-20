import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { userId: clerkUserId } = await auth();
    
    if (!clerkUserId) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, description } = body;

    // Validate required fields
    if (!title?.trim() || !description?.trim()) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }

    // Get or create user
    const user = await prisma.user.upsert({
      where: { clerkUserId },
      create: {
        clerkUserId,
        email: "", // Add email handling if needed
        name: "Anonymous",
      },
      update: {},
    });

    // Create post
    const post = await prisma.post.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        userId: clerkUserId,
      },
    });

    return NextResponse.json(post, { status: 201 });

  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: true,
        upvotes: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    
    return NextResponse.json(posts);
    
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}