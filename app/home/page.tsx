"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { Plus, Search, Sun, Moon } from "lucide-react"; // Import icons

// Define a type for Post
type Post = {
  id: string;
  title: string;
  content: string;
  imageUrl?: string | null;
  createdAt: string;
  upvotedBy: { clerkId: string }[];
};

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false); // State for dark mode
  const router = useRouter();

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("/api/posts");
        const data = await res.json();
        if (data.posts) setPosts(data.posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    }
    fetchPosts();
  }, []);

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Forum Posts</h1>
        <Link href="/posts/create">
          <Button>Create Post</Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {posts.map((post) => (
          <Card key={post.id} className="p-4">
            <CardHeader>
              <h2 className="text-2xl font-semibold">{post.title}</h2>
            </CardHeader>
            <CardContent>
              <p>{post.content.slice(0, 100)}...</p>
              <p className="text-sm text-gray-500">Upvotes: {post.upvotedBy.length}</p>
              <Link href={`/posts/${post.id}`}>
                <Button variant="link">View Post</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}