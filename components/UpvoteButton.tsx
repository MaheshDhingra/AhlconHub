'use client';

import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';

export default function UpvoteButton({
  postId,
  initialUpvotes,
  initialHasUpvoted
}: {
  postId: string;
  initialUpvotes: number;
  initialHasUpvoted: boolean;
}) {
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [hasUpvoted, setHasUpvoted] = useState(initialHasUpvoted);
  const { isSignedIn } = useAuth();

  const handleUpvote = async () => {
    if (!isSignedIn) return;

    try {
      let newUpvotes = upvotes;
      let newHasUpvoted = !hasUpvoted;

      if (newHasUpvoted) {
        newUpvotes = upvotes + 1;
      } else {
        newUpvotes = upvotes - 1;
      }

      setUpvotes(newUpvotes);
      setHasUpvoted(newHasUpvoted);

      const response = await fetch(`/api/posts/${postId}`, {
        method: 'POST'
      });

      if (!response.ok) {
        setUpvotes(prev => prev + (newHasUpvoted ? -1 : 1));
        setHasUpvoted(hasUpvoted);
      }
    } catch (error) {
      console.error('Upvote failed:', error);
      setUpvotes(prev => prev + (newHasUpvoted ? -1 : 1));
      setHasUpvoted(hasUpvoted);
    }
  };

  return (
    <button
      onClick={handleUpvote}
      disabled={!isSignedIn}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
        hasUpvoted 
          ? 'bg-blue-600 text-white cursor-default'
          : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
      } ${
        !isSignedIn ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      aria-label="Upvote post"
    >
      <span className="text-lg">▲</span>
      <span className="font-medium">{upvotes}</span>
    </button>
  );
}