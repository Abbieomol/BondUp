import type { User } from "../types/types";

interface NavbarProps {
  user: User;
  onLogout: () => void;
}

const Navbar = ({ user, onLogout }: NavbarProps) => {
  return (
    <nav className="navbar">
      <h1>BondUp</h1>
      <span>Welcome, {user.username}</span>
      <button onClick={onLogout}>Logout</button>
    </nav>
  );
};

export default Navbar;
