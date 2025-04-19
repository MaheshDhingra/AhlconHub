import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { userId } = getAuth(request);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { title, content, imageUrl, type } = await request.json();
    const existingPost = await prisma.post.findUnique({
      where: { id: params.id },
      include: { user: true }
    });
    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    if (existingPost.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const updatedPost = await prisma.post.update({
      where: { id: params.id },
      data: {
        title: title || existingPost.title,
        content: content || existingPost.content,
        imageUrl: imageUrl !== undefined ? imageUrl : existingPost.imageUrl,
        type: type || existingPost.type
      }
    });
    return NextResponse.json({ post: updatedPost });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error", details: error }, { status: 500 });
  }
} 