"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Sun, Moon } from "lucide-react"; // Import icons

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState<{ id: string; title: string; content: string; imageUrl?: string }[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false); // State for dark mode
  const router = useRouter();

  useEffect(() => {
    async function fetchPosts() {
      const res = await fetch("/api/posts");
      const data = await res.json();
      setPosts(data);
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
    <div className="p-6 space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Welcome to AhlconHub</h1>
        <div className="flex items-center space-x-4">
          <Button variant="default" className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Create New Post</span>
          </Button>

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
      </header>

      <Separator />

      <div className="flex items-center space-x-4">
        <div className="relative w-full max-w-md">
          <Input
            placeholder="Search posts..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
        </div>
        <Button variant="outline">Search</Button>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <Card
              key={post.id}
              className="cursor-pointer"
              onClick={() => router.push(`/posts/${post.id}`)}
            >
              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-40 object-cover rounded-t-md"
                />
              )}
              <CardHeader>
                <h2 className="text-lg font-semibold">{post.title}</h2>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  {post.content.length > 100
                    ? `${post.content.slice(0, 100)}...`
                    : post.content}
                </p>
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