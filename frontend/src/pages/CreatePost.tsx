import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ChangeEvent } from "react";
import { backend_api } from "../api";
import "../styles/App.css";

const CreatePost = () => {
  const [caption, setCaption] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const handlePost = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!accessToken || !user.id) {
      alert("You must be logged in.");
      return;
    }

    const formData = new FormData();
    formData.append("caption", caption);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      const res = await fetch(`${backend_api}posts/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (res.ok) {
        navigate("/dashboard");
      } else {
        const errorData = await res.json();
        alert(`Failed to create post: ${errorData.detail || "Unknown error"}`);
      }
    } catch (error) {
      alert("An error occurred while creating the post.");
      console.error(error);
    }
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  return (
    <div className="create-post-form">
      <h2>Create Post</h2>
      <textarea
        placeholder="What's on your mind?"
        rows={4}
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className="post-textarea"
      />
      <input
        title="Upload Post"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="post-file-input"
      />
      <button onClick={handlePost} className="post-submit-btn">
        Post
      </button>
      <button onClick={handleBack} className="back-dashboard-btn">
        Back to Dashboard
      </button>
    </div>
  );
};

export default CreatePost;
