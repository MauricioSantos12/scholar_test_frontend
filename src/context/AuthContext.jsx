import { useToast } from "@chakra-ui/react";
import { createContext, useEffect, useState } from "react";
import UseFetch from "../utils/UseFetch";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const showToast = useToast();
  const { fetchData } = UseFetch()

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await fetchData({
        url: `/auth/login`,
        method: "POST",
        body: { email, password },
      });
      if (res) {
        setUser(res.user ? res.user : null);
        setToken(res.token || null);
        localStorage.setItem("token", JSON.stringify(res.token));
        localStorage.setItem("user", JSON.stringify(res.user));
        return {
          user: res.user ? res.user : null,
          token: res.token || null
        }
      }

    } catch (err) {
      console.error("Login error:", err);
      return null;
    }
    finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
    showToast({
      title: "Logout Successful",
      description: "You have been logged out.",
      status: "success",
    })

  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser) {
          setUser(parsedUser);
        }
      } catch (error) {
        console.error("Error parsing stored user data:", error);
      }
    }
    if (storedToken) {
      try {
        const parsedToken = JSON.parse(storedToken);
        if (parsedToken) {
          setToken(parsedToken);
        }
      } catch (error) {
        console.error("Error parsing stored auth data:", error);
      }
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
