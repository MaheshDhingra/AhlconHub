import Link from 'next/link';
import prisma from '@/lib/prisma';

async function getPosts() {
  return await prisma.post.findMany({
    include: {
      user: {
        select: {
          name: true,
          imageUrl: true
        }
      },
      upvotedBy: {
        select: {
          clerkUserId: true
        }
      }
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
      <h1 className="text-2xl font-bold mb-8">Recent Posts</h1>
      <div className="space-y-6">
        {posts.map(post => (
          <div key={post.id} className="border rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <Link 
                href={`/posts/${post.id}`}
                className="hover:underline"
              >
                <h2 className="text-xl font-semibold">{post.title}</h2>
              </Link>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">
                  {post.upvotes} upvotes
                </span>
              </div>
            </div>
            <p className="text-gray-700 mb-4 line-clamp-3">
              {post.description}
            </p>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                {post.user.imageUrl && (
                  <img
                    src={post.user.imageUrl}
                    alt={post.user.name || 'User'}
                    className="w-6 h-6 rounded-full"
                  />
                )}
                <span className="text-gray-500">
                  {post.user.name}
                </span>
              </div>
              <Link
                href={`/posts/${post.id}`}
                className="text-blue-600 hover:underline"
              >
                View post →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}