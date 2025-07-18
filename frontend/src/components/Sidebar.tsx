import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import "../styles/App.css"

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      
      <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

     
      <div className={`sidebar ${isOpen ? "open" : "collapsed"}`}>
        <Link to="/dashboard">🏠Home</Link>
        <Link to="/profile">👤Profile</Link>
        <Link to="/create-post">➕Create Post</Link>
        <Link to="/notifications">🔔Notifications</Link>
      </div>
    </>
  );
};

export default Sidebar;
