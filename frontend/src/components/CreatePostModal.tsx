import { useState } from "react";
import { createPost } from "../api/api";



export default function CreatePostModal({ onClose }: { onClose: () => void }) {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("caption", caption);
    if (image) formData.append("image", image);

    await createPost(formData);
    onClose();
  };

  return (
    <div className="modal">
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="What's on your mind?"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <input 
        title="Post"
        type="file" onChange={(e) => setImage(e.target.files?.[0] || null)} />
        <button type="submit">Post</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
}
