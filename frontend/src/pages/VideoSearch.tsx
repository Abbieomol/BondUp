import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/App.css";
import type { YouTubeVideo } from "../types/types";
import { YOUTUBE_API_KEY } from "../config";


// const YOUTUBE_API_KEY = "YOUTUBE_API_KEY";

export default function VideoSearch() {
  const [query, setQuery] = useState("");
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();

  const searchVideos = async () => {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(
      query
    )}&key=${YOUTUBE_API_KEY}&maxResults=9`;

    const res = await fetch(url);
    const data = await res.json();
    setVideos(data.items);
  };

  const handleShare = (video: YouTubeVideo) => {
    const link = `https://www.youtube.com/watch?v=${video.videoId}`;
    localStorage.setItem("sharedVideo", JSON.stringify({
      title: video.title,
      url: link,
    }));
    navigate("/create-post");
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Search YouTube Videos</h2>
      <div className="flex gap-2 mb-4">
        <input
          className="border p-2 rounded flex-grow"
          type="text"
          placeholder="Search for videos..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          className="bg-orange-500 text-white px-4 py-2 rounded"
          onClick={searchVideos}
        >
          Search
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {videos.map((video: YouTubeVideo) => (
          <div key={video.videoId} className="border rounded-lg p-2">
            <a
              href={`https://www.youtube.com/watch?v=${video.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={video.thumbnails.medium.url}
                alt={video.title}
                className="rounded-lg"
              />
            </a>
            <p className="mt-2 text-sm font-semibold">{video.title}</p>
            <button
              onClick={() => handleShare(video)}
              className="mt-2 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
            >
              Share as Post
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
