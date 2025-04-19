"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { Plus, Search, Sun, Moon } from "lucide-react";

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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("/api/posts");
        if (!res.ok) {
          console.error("Failed to fetch posts:", res.statusText);
          return;
        }
        const data = await res.json();
        if (Array.isArray(data)) {
          setPosts(data);
        } else {
          console.error("Unexpected API response format:", data);
        }
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
        <div className="flex items-center space-x-4">
          <Link href="/posts/create">
            <Button className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Create Post</span>
            </Button>
          </Link>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-800"
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? (
              <Sun className="w-6 h-6 text-yellow-500" />
            ) : (
              <Moon className="w-6 h-6 text-gray-800 dark:text-gray-200" />
            )}
          </button>
        </div>
      </div>

      <div className="relative mb-4">
        <Input
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
      </div>

      <Separator />

      <div className="grid grid-cols-1 gap-4 mt-4">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <Card key={post.id} className="p-4">
              <CardHeader>
                <h2 className="text-2xl font-semibold">{post.title}</h2>
              </CardHeader>
              <CardContent>
                <p>{post.content.slice(0, 100)}...</p>
                <p className="text-sm text-gray-500">
                  Upvotes: {post.upvotedBy.length}
                </p>
                <Link href={`/posts/${post.id}`}>
                  <Button variant="link">View Post</Button>
                </Link>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-gray-500">No posts found.</p>
        )}
      </div>
    </div>
  );
}
