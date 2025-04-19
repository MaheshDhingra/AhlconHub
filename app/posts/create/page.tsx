/* use client */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PostCreatePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [type, setType] = useState("DISCUSSION");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content || !type) {
      setError("All required fields must be filled.");
      return;
    }

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          imageUrl: imageUrl || null,
          type,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong.");
      } else {
        router.push("/home");
      }
    } catch (err) {
      setError("Error submitting post. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <h1 className="text-2xl font-bold">Create a New Post</h1>
        </CardHeader>
        <CardContent>
          {error && (
            <div
              className="mb-4 text-red-500"
              role="alert"
              aria-live="assertive"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setError("");
                }}
                placeholder="Enter the title of your post"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  setError("");
                }}
                placeholder="Write the content of your post here..."
                rows={6}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL (optional)</Label>
              <Input
                id="imageUrl"
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Enter an image URL (optional)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Post Type</Label>
              <Select value={type} onValueChange={(value) => setType(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a post type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="COMPLAINT">Complaint</SelectItem>
                  <SelectItem value="DISCUSSION">Discussion</SelectItem>
                  <SelectItem value="QUESTION">Question</SelectItem>
                  <SelectItem value="ANNOUNCEMENT">Announcement</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full">
              Submit Post
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
