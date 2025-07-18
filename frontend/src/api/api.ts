const BASE_URL = "http://127.0.0.1:8000/api";

const getToken = (): string | null => localStorage.getItem("accessToken");

const getAuthHeaders = (): HeadersInit => {
  const token = getToken();
  return token
    ? { Authorization: `Bearer ${token}` }
    : {};
};

const api = {
  login: async (username: string, password: string) => {
    const response = await fetch(`${BASE_URL}/token/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) throw new Error("Login failed");
    return response.json(); // { access, refresh }
  },

  fetchPosts: async () => {
    const headers = getAuthHeaders();
    const response = await fetch(`${BASE_URL}/posts/`, { headers });
    if (!response.ok) {
      if (response.status === 401) throw new Error("Unauthorized");
      throw new Error("Failed to fetch posts");
    }
    return response.json();
  },

  createPost: async (formData: FormData) => {
    const headers = getAuthHeaders();
    const response = await fetch(`${BASE_URL}/posts/create/`, {
      method: "POST",
      headers,
      body: formData,
    });
    if (!response.ok) {
      if (response.status === 401) throw new Error("Unauthorized");
      throw new Error("Post creation failed");
    }
    return response.json();
  },
};

export default api;
