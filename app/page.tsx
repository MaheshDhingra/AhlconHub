import Link from 'next/link';
import prisma from '@/lib/prisma';
import CreatePostForm from '@/components/CreatePostForm';

async function getPosts() {
  return await prisma.post.findMany({
    include: {
      user: {
        select: {
          name: true,
          imageUrl: true
        }
      },
      upvotes: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}

export default async function Home() {
  const posts = await getPosts();

  return (
    <div className="max-w-4xl mx-auto p-4">
      <CreatePostForm />
      <h1 className="text-2xl font-bold mb-8">Recent Posts</h1>
      <div className="space-y-6">
        {posts.map(post => (
          <div key={post.id} className="border rounded-lg p-4 shadow-sm">
          </div>
        ))}
      </div>
    </div>
  );
}