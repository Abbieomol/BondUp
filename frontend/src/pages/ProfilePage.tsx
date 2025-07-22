import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { backend_api } from "../api";
import type { Post } from "../types/types";
import "../styles/App.css";

type EditableDetails = {
  username: string;
  email: string;
  name?: string;
  bio?: string;
  contact?: string;
  gender?: string;
  professionalInfo?: string;
};

const ProfilePage = ({ handleLogout }: { handleLogout: () => void }) => {
  const [editableDetails, setEditableDetails] = useState<EditableDetails>({
    username: "",
    email: "",
    name: "",
    bio: "",
    contact: "",
    gender: "",
    professionalInfo: "",
  });

  const [posts, setPosts] = useState<Post[]>([]);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch(`${backend_api}profile/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      setEditableDetails({
        username: data.username || "",
        email: data.email || "",
        name: data.name || "",
        bio: data.bio || "",
        contact: data.contact || "",
        gender: data.gender || "",
        professionalInfo: data.professional_info || "", // Match backend key
      });
    } catch (error) {
      console.error("Failed to load profile", error);
    }
  }, [accessToken]);

  const fetchUserPosts = useCallback(async () => {
    try {
      const res = await fetch(`${backend_api}posts/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error("Failed to fetch posts", error);
    }
  }, [accessToken]);

  const fetchFollowStats = useCallback(async () => {
    try {
      const res = await fetch(`${backend_api}follow-stats/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await res.json();
      setFollowers(data.followers);
      setFollowing(data.following);
    } catch (error) {
      console.error("Error fetching follow stats", error);
    }
  }, [accessToken]);

  useEffect(() => {
    fetchProfile();
    fetchUserPosts();
    fetchFollowStats();
  }, [fetchProfile, fetchUserPosts, fetchFollowStats]);

  const handleSave = async () => {
    try {
      const res = await fetch(`${backend_api}update-profile/`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...editableDetails,
          professional_info: editableDetails.professionalInfo, // Backend key consistency
        }),
      });

      if (res.ok) {
        alert("Profile updated!");
      } else {
        alert("Failed to update profile.");
      }
    } catch (error) {
      console.error("Save error", error);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account?")) return;

    try {
      const res = await fetch(`${backend_api}delete-account/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (res.ok) {
        localStorage.clear();
        navigate("/signup");
      } else {
        alert("Failed to delete account.");
      }
    } catch (error) {
      console.error("Delete error", error);
    }
  };

  return (
    <div className="profile-page">
      <Sidebar />
      <div className="main-content">
        <h2>Your Profile</h2>

        <div className="profile-details">
          <label>
            Username:
            <input
              type="text"
              value={editableDetails.username}
              onChange={(e) =>
                setEditableDetails({ ...editableDetails, username: e.target.value })
              }
              required
            />
          </label>

          <label>
            Email:
            <input
              type="email"
              value={editableDetails.email}
              onChange={(e) =>
                setEditableDetails({ ...editableDetails, email: e.target.value })
              }
              required
            />
          </label>

          <label>
            Name:
            <input
              type="text"
              value={editableDetails.name}
              onChange={(e) =>
                setEditableDetails({ ...editableDetails, name: e.target.value })
              }
            />
          </label>

          <label>
            Bio:
            <textarea
              value={editableDetails.bio}
              onChange={(e) =>
                setEditableDetails({ ...editableDetails, bio: e.target.value })
              }
            />
          </label>

          <label>
            Contact:
            <input
              type="text"
              value={editableDetails.contact}
              onChange={(e) =>
                setEditableDetails({ ...editableDetails, contact: e.target.value })
              }
            />
          </label>

          <label>
            Gender:
            <input
              type="text"
              value={editableDetails.gender}
              onChange={(e) =>
                setEditableDetails({ ...editableDetails, gender: e.target.value })
              }
            />
          </label>

          <label>
            Professional Info:
            <textarea
              value={editableDetails.professionalInfo}
              onChange={(e) =>
                setEditableDetails({ ...editableDetails, professionalInfo: e.target.value })
              }
            />
          </label>

          <div className="follower-stats">
            <span>Followers: {followers}</span>
            <span>Following: {following}</span>
          </div>

          <div className="profile-actions">
            <button onClick={handleSave}>Save Changes</button>
            <button onClick={handleLogout}>Log Out</button>
          </div>

          <div className="danger-zone">
            <button className="delete-account" onClick={handleDeleteAccount}>
              Delete Account
            </button>
          </div>
        </div>

        <h3>Your Posts</h3>
        <div className="post-grid">
          {posts.map((post) => (
            <div className="post-card" key={post.id}>
              {post.image && (
                <img src={post.image} alt="Post" className="post-image" />
              )}
              <p>{post.caption}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
