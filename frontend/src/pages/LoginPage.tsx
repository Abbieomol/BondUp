import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "../types/types";
import { backend_api } from "../api";

type Props = {
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

function LoginPage({ setUser }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Step 1: Get tokens
      const tokenResponse = await fetch(`${backend_api}token/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!tokenResponse.ok) {
        throw new Error("Token fetch failed");
      }
      const tokenData = await tokenResponse.json();
      const { access, refresh } = tokenData;

      // Step 2: Use access token to get user data
      const userResponse = await fetch(`${backend_api}login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify({ username, password }),
      });

      if (!userResponse.ok) {
        throw new Error("User fetch failed");
      }

      const userData = await userResponse.json();
      const user: User = userData.user;

      // Save tokens and user to localStorage
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("user", JSON.stringify(user));

      // Set user in global state
      setUser(user);

      // Redirect to home or dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="login-page">
      <form onSubmit={handleLogin} className="login-form">
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Log In</button>
      </form>
    </div>
  );
}

export default LoginPage;
