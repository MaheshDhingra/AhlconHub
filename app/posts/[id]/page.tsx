import { notFound } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import UpvoteButton from '@/components/UpvoteButton';
import CommentForm from '@/components/CommentForm';
import Comment from '@/components/Comment';
import prisma from '@/lib/prisma';

async function getPost(id: string) {
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      user: true,
      upvotes: true,
      comments: {
        where: { parentId: null },
        include: {
          user: true,
          replies: {
            include: {
              user: true,
              replies: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });
  return post;
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const post = await getPost(id);
  const { userId } = await auth();

  if (!post) return notFound();

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Post Content Section */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <div className="flex items-center gap-4 mb-6">
          <UpvoteButton 
            postId={post.id} 
            initialUpvotes={post.upvotes.length}
            initialHasUpvoted={post.upvotes.some(
              (upvote) => upvote.clerkUserId === userId
            )}
          />
          <span className="text-gray-600">
            Posted by {post.user.name} • {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>
        <p className="text-lg text-gray-800 whitespace-pre-wrap">
          {post.description}
        </p>
      </div>

      {/* Comments Section */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Comments</h2>
        <CommentForm postId={post.id} />
        
        <div className="mt-6">
          {post.comments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              postId={post.id}
            />
          ))}
        </div>
      </section>
    </div>
  );
}