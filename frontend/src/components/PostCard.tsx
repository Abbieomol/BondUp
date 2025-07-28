import { useEffect, useRef, useState } from "react";
import type { Post } from "../types/types";
import { MoreHorizontal } from "lucide-react";

interface PostCardProps {
  post: Post;
  currentUsername: string;
  onLike: (postId: number) => Promise<void>;
  onDislike: (postId: number) => Promise<void>;
  onComment: (postId: number, text: string) => Promise<void>;
  onDelete?: (postId: number) => Promise<void>;
  onEdit?: (postId: number, updatedData: { caption: string; image?: File | null }) => Promise<void>;
  onDeleteComment?: (commentId: number) => Promise<void>;
}

type Video = {
  id: { videoId: string };
  snippet: {
    title: string;
    thumbnails: { medium: { url: string } };
    channelTitle: string;
  };
};

export default function PostCard({
  post,
  currentUsername,
  onLike,
  onDislike,
  onComment,
  onDelete,
  onEdit,
  onDeleteComment,
}: PostCardProps) {
  const [commentText, setCommentText] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editCaption, setEditCaption] = useState(post.caption || "");
  const [editImage, setEditImage] = useState<File | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [videos, setVideos] = useState<Video[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(false);

  const fetchRelatedVideos = async (query: string) => {
    try {
      setLoadingVideos(true);
      const apiKey = "AIzaSyBb1E-d4ODYJtTg_1b6T4lxvAvouHo15wg"; 
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
          query
        )}&type=video&key=${apiKey}&maxResults=3`
      );
      const data = await res.json();
      setVideos(data.items || []);
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setLoadingVideos(false);
    }
  };

  useEffect(() => {
    if (post.caption) {
      fetchRelatedVideos(post.caption);
    }
  }, [post.caption]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      onComment(post.id, commentText.trim());
      setCommentText("");
    }
  };

  const handleEditSubmit = async () => {
    if (onEdit) {
      await onEdit(post.id, { caption: editCaption, image: editImage });
      setEditing(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (confirmDelete && onDelete) {
      await onDelete(post.id);
    }
    setShowMenu(false);
  };

  const handleDeleteComment = async (commentId: number) => {
    const confirm = window.confirm("Are you sure you want to delete this comment?");
    if (confirm && onDeleteComment) {
      await onDeleteComment(commentId);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="post-card">
      {post.image && (
        <img src={`http://127.0.0.1:8000${post.image}`} alt="Post" className="post-image" />
      )}

      <div className="post-content">
        <div className="post-header">
          {!editing && post.caption && <p className="caption">{post.caption}</p>}

          {editing && (
            <div className="edit-form">
              <input
                type="text"
                value={editCaption}
                onChange={(e) => setEditCaption(e.target.value)}
                placeholder="Edit caption"
              />
              <input
                title="Edit image"
                type="file"
                accept="image/*"
                onChange={(e) => setEditImage(e.target.files?.[0] || null)}
              />
              <button onClick={handleEditSubmit}>✅ Save</button>
              <button onClick={() => setEditing(false)}>❌ Cancel</button>
            </div>
          )}

          <div className="menu-wrapper" ref={menuRef}>
            <button
              title="More options"
              className="menu-btn"
              onClick={() => setShowMenu(!showMenu)}
            >
              <MoreHorizontal size={20} />
            </button>
            {showMenu && (
              <div className="dropdown-menu">
                <button onClick={handleDelete}>🗑 Delete</button>
                <button
                  onClick={() => {
                    setEditing(true);
                    setShowMenu(false);
                  }}
                >
                  ✏️ Edit
                </button>
              </div>
            )}
          </div>
        </div>

      
        {loadingVideos && <p>Loading related videos...</p>}
        {!loadingVideos && videos.length > 0 && (
          <div className="video-preview-list">
            {videos.map((video) => (
              <div key={video.id.videoId} className="video-preview">
                <a
                  href={`https://www.youtube.com/watch?v=${video.id.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={video.snippet.thumbnails.medium.url}
                    alt={video.snippet.title}
                    className="video-thumbnail"
                  />
                  <p className="video-title">{video.snippet.title}</p>
                </a>
              </div>
            ))}
          </div>
        )}

        <div className="post-meta">
          <span className="likes">❤️ {post.likes}</span>
          <span className="dislikes">👎 {post.dislikes}</span>
          {post.created_at && (
            <span className="created_at">
              {new Date(post.created_at).toLocaleString()}
            </span>
          )}
        </div>

        <div className="actions">
          <button onClick={() => onLike(post.id)}>👍 Like</button>
          <button onClick={() => onDislike(post.id)}>👎 Dislike</button>
        </div>

        <form onSubmit={handleSubmit} className="comment-form">
          <input
            type="text"
            value={commentText}
            placeholder="Write a comment..."
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button type="submit">Post</button>
        </form>

        <div className="comments">
          {post.comments?.map((comment) => (
            <div key={comment.id} className="comment">
              <strong>{comment.user}</strong>: {comment.text}
              {(comment.user === currentUsername || post.user_username === currentUsername) && (
                <button
                  className="delete-comment-btn"
                  title="Delete comment"
                  onClick={() => handleDeleteComment(comment.id)}
                >
                  ❌
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
