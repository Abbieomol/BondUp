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
  message: string;
  created_at: string;
};

export default function Notifications({ user, onLogout }: Props) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Replace with API call later
    const mockNotifications = [
      { id: 1, message: "Jane liked your post", created_at: "2m ago" },
      { id: 2, message: "Tom started following you", created_at: "10m ago" },
      { id: 3, message: "You commented on Sarah's post", created_at: "1h ago" },
    ];
    setNotifications(mockNotifications);
  }, []);

  return (
    <div className="notifications-page">
      <Navbar user={user} onLogout={onLogout} />
      <Sidebar />
      <div className="notifications-list">
        <h2>Notifications</h2>
        {notifications.length === 0 ? (
          <p>No notifications yet.</p>
        ) : (
          <ul>
            {notifications.map((n) => (
              <li key={n.id} className="notification-card">
                <p>{n.message}</p>
                <small>{n.created_at}</small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
