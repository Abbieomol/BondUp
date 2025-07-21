import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import type { Post } from "../types/types";
import "../styles/App.css";
import PostCard from "../components/PostCard";

const Dashboard = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchPosts = async () => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/posts/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      } else {
        console.error("Failed to fetch posts");
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLike = async (postId: number) => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/posts/${postId}/like/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ value: "like" }),
      });

      if (res.ok) fetchPosts();
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleDislike = async (postId: number) => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/posts/${postId}/like/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ value: "dislike" }),
      });

      if (res.ok) fetchPosts();
    } catch (error) {
      console.error("Error disliking post:", error);
    }
  };

  const handleComment = async (postId: number, text: string) => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/posts/${postId}/comment/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ text }),
      });

      if (res.ok) fetchPosts();
    } catch (error) {
      console.error("Error commenting on post:", error);
    }
  };

  const handleDelete = async (postId: number) => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/posts/${postId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.ok) fetchPosts();
      else console.error("Failed to delete post");
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div className="page-layout">
      <Sidebar />
      <div className="main-content">
        <h2>Feed</h2>
        <div className="post-feed">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={handleLike}
              onDislike={handleDislike}
              onComment={handleComment}
              onDelete={handleDelete} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
