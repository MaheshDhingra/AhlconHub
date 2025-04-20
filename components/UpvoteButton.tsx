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
    if (!isSignedIn || hasUpvoted) return;
    
    try {
      setUpvotes(prev => prev + 1);
      setHasUpvoted(true);
      
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'POST'
      });

      if (!response.ok) {
        setUpvotes(prev => prev - 1);
        setHasUpvoted(false);
      }
    } catch (error) {
      console.error('Upvote failed:', error);
      setUpvotes(prev => prev - 1);
      setHasUpvoted(false);
    }
  };

  return (
    <button
      onClick={handleUpvote}
      disabled={hasUpvoted || !isSignedIn}
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