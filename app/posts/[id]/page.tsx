import { notFound } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import UpvoteButton from '@/components/UpvoteButton';

async function getPost(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts/${id}`);
  if (!res.ok) return null;
  return res.json();
}

export default async function PostPage({
  params
}: {
  params: { id: string }
}) {
  const post = await getPost(params.id);
  const { userId } = await auth();

  if (!post) return notFound();

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <div className="flex items-center gap-4 mb-6">
        <UpvoteButton 
          postId={post.id} 
          initialUpvotes={post.upvotes}
          initialHasUpvoted={post.upvotedBy.some(
            (u: any) => u.clerkUserId === userId
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
  );
}