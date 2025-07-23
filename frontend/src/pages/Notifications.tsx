import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import type { User } from "../types/types";

type Props = {
  user: User;
  onLogout: () => void;
};

type Notification = {
  id: number;
  actor____username?: string;
  message: string;
  created_at: string;
  is_self?: boolean;
};

export default function Notifications({ user, onLogout }: Props) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/notifications/", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setNotifications(data);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
        setError("Could not load notifications.");
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="notifications-page">
      <Navbar user={user} onLogout={onLogout} />
      <Sidebar />
      <div className="notifications-list p-4">
        <h2 className="text-xl font-semibold mb-4">Notifications</h2>

        {error && <p className="text-red-500">{error}</p>}

        {notifications.length === 0 && !error ? (
          <p>No notifications yet.</p>
        ) : (
          <ul className="space-y-4">
            {notifications.map((n) => (
              <li key={n.id} className="notification-card bg-gray-100 p-4 rounded shadow-sm">
                <p className="font-medium">{n.message}</p>
                <small className="text-gray-500">{new Date(n.created_at).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
