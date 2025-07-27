import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import "../styles/App.css";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = () => setIsOpen(!isOpen);

  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest(".sidebar-toggle-btn")
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div
        ref={sidebarRef}
        className={`sidebar ${isOpen ? "open" : "collapsed"}`}
      >
        <Link to="/dashboard">🏠 Home</Link>
        <Link to="/profile">👤 Profile</Link>
        <Link to="/create-post">➕ Create Post</Link>
        <Link to="/notifications">🔔 Notifications</Link>
        <Link to="/settings">⚙️ Settings</Link>
        <Link to="/mood-tracker">😊 Mood Tracker</Link>
      </div>
    </>
  );
};

export default Sidebar;
