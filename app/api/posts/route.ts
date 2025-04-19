import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: true,
        upvotedBy: true,
        comments: true
      },
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json({ posts });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error", details: error },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const { userId } = getAuth(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { title, content, imageUrl, type } = await request.json();
    if (!title || !content || !type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    const post = await prisma.post.create({
      data: {
        title,
        content,
        imageUrl: imageUrl || null,
        type,
        userId: userId
      },
      include: { user: true, upvotedBy: true, comments: true }
    });
    return NextResponse.json({ post });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error", details: error },
      { status: 500 }
    );
  }
}