"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function PostPage() {
  const params = useParams();
  const id = params?.id as string;
  const [post, setPost] = useState<{ title: string; content: string; comments: { id: string; content: string }[] } | null>(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<{ id: string; content: string }[]>([]);

  useEffect(() => {
    async function fetchPost() {
      const res = await fetch(`/api/posts/${id}`);
      const data = await res.json();
      setPost(data);
      setComments(data.comments);
    }
    fetchPost();
  }, [id]);

  async function handleAddComment() {
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId: id, content: comment }),
    });
    const newComment = await res.json();
    setComments((prev) => [...prev, newComment]);
    setComment("");
  }

  if (!post) return <p>Loading...</p>;

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <h1 className="text-3xl font-bold">{post.title}</h1>
        </CardHeader>
        <CardContent>
          <p>{post.content}</p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Comments</h2>
        {comments.map((c) => (
          <Card key={c.id}>
            <CardContent>
              <p>{c.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center space-x-4">
        <Input
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Button onClick={handleAddComment}>Post</Button>
      </div>
    </div>
  );
}