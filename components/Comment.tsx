'use client';

import { useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import CommentForm from './CommentForm';

export default function CommentComponent({
  comment,
  postId,
  level = 0,
}: {
  comment: any;
  postId: string;
  level?: number;
}) {
  const { isSignedIn } = useAuth();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replies, setReplies] = useState(comment.replies || []);

  const marginLeft = level * 32; // 32px per nesting level

  return (
    <div 
      className="mb-4"
      style={{ marginLeft: `${marginLeft}px` }}
    >
      <div className="border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-medium">{comment.user.name}</span>
          <span className="text-sm text-gray-500">
            {new Date(comment.createdAt).toLocaleDateString()}
          </span>
        </div>
        <p className="text-gray-800">{comment.content}</p>
        
        {isSignedIn && (
          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="text-blue-600 text-sm mt-2 hover:underline"
          >
            Reply
          </button>
        )}
      </div>

      {showReplyForm && (
        <div className="mt-2">
          <CommentForm 
            postId={postId}
            parentId={comment.id}
            onSuccess={(newReply) => {
              setReplies([...replies, newReply]);
              setShowReplyForm(false);
            }}
          />
        </div>
      )}

      {replies.map((reply: any) => (
        <Comment
          key={reply.id}
          comment={reply}
          postId={postId}
          level={level + 1}
        />
      ))}
    </div>
  );
}