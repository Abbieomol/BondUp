import { useState } from "react";
import type { Post } from "../types/types";

interface PostCardProps {
  post: Post;
  onLike: (postId: number) => Promise<void>;
  onDislike: (postId: number) => Promise<void>;
  onComment: (postId: number, text: string) => Promise<void>;
}

export default function PostCard({ post, onLike, onDislike, onComment }: PostCardProps) {
  const [commentText, setCommentText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      onComment(post.id, commentText.trim());
      setCommentText("");
    }
  };

  return (
    <div className="post-card">
      {post.image && (
        <img src={post.image} alt="Post" className="post-image" />
      )}

      <div className="post-content">
        {post.caption && <p className="caption">{post.caption}</p>}
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
              <strong>{comment.user}</strong>: {comment.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
