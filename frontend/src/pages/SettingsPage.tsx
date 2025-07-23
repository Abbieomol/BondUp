import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import type { UserSettings, User } from "../types/types";
import "../styles/App.css";

type Props = {
  user: User;
  onLogout: () => void;
};

const SettingsPage: React.FC<Props> = ({ user, onLogout }) => {
  const [settings, setSettings] = useState<UserSettings>({
    colorScheme: "dark",
    sidebarStyle: "compact",
    postDisplay: "grid",
  });

  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    // Fetch user settings
    fetch("http://127.0.0.1:8000/api/settings/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setSettings(data))
      .catch((err) => console.error("Error fetching settings:", err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    onLogout(); 
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetch("/api/settings/", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(settings),
    })
      .then((res) => {
        if (res.ok) setStatus("Settings updated!");
        else setStatus("Failed to update.");
      })
      .catch(() => setStatus("Error updating settings."));
  };

  return (
    <div className="app-layout">
      {user && <Navbar user={user} onLogout={handleLogout} />}
      <div className="main-content">
        <Sidebar />
        <div className="settings-container">
          <h2 className="settings-title">User Settings</h2>
          <form onSubmit={handleSubmit} className="settings-form">
            <label>
              Color Scheme:
              <select
                name="colorScheme"
                value={settings.colorScheme}
                onChange={handleChange}
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="green">Green</option>
                <option value="orange">Orange</option>
              </select>
            </label>

            <label>
              Sidebar Style:
              <select
                name="sidebarStyle"
                value={settings.sidebarStyle}
                onChange={handleChange}
              >
                <option value="compact">Compact</option>
                <option value="expanded">Expanded</option>
              </select>
            </label>

            <label>
              Post Display:
              <select
                name="postDisplay"
                value={settings.postDisplay}
                onChange={handleChange}
              >
                <option value="grid">Grid</option>
                <option value="list">List</option>
              </select>
            </label>

            <button type="submit">Save Settings</button>
            {status && <p className="status">{status}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
