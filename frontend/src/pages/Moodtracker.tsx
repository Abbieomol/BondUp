import { useState, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import { backend_api } from "../api";
import type { Mood } from "../types/types";
import "../styles/App.css";

export default function MoodTracker() {
  const [mood, setMood] = useState<Mood["mood"]>("");
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!mood) {
        setError("Please select your mood.");
        return;
      }

      try {
        const accessToken = localStorage.getItem("accessToken") || "";

        const res = await fetch(`${backend_api}mood-entries/`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ mood, note }),
        });

        if (res.ok) {
          const data = await res.json();
          console.log("Saved:", data);
          setSubmitted(true); 
          const error = await res.json();
          console.error("Failed:", error);
        }
      } catch (err) {
        console.error(err);
        setError("Network error. Please try again later.");
      }
    },
    [mood, note]
  );

  return (
    <div className="app-container">
      <Sidebar />
      <div className="content">
        <h2 className="title">Mood Tracker</h2>

        {error && <p className="error">{error}</p>}
        {submitted && <p className="success">Mood submitted successfully!</p>}

        <form onSubmit={handleSubmit} className="form">
          <label>
            Mood:
            <select value={mood} onChange={(e) => setMood(e.target.value as Mood["mood"])}>
              <option value="">Select</option>
              <option value="happy">😊 Happy</option>
              <option value="sad">😢 Sad</option>
              <option value="angry">😠 Angry</option>
              <option value="anxious">😟 Anxious</option>
              <option value="excited">🤩 Excited</option>
            </select>
          </label>

          <label>
            Note (optional):
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What's going on today?"
            />
          </label>

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}
