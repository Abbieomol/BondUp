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
  actor____username: string;
  message: string;
  created_at: string;
  is_self: boolean;
};

export default function Notifications({ user, onLogout }: Props) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Replace with API call later
    const mockNotifications = [
      { id: 1, actor____username: "Nicole", message: "Jane liked your post", created_at: "2m ago", is_self: false },
      { id: 2, actor____username: "Tom", message: "Tom started following you", created_at: "10m ago", is_self: false },
      { id: 3, actor____username: "You", message: "You commented on Sarah's post", created_at: "1h ago", is_self: true },
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
