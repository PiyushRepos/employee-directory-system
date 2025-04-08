import { createContext, useContext, useEffect, useState } from "react";
import axios from "../../axios";

export const userContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  function loginUser(userData) {
    setUser(userData);
  }

  function logoutUser() {
    setUser(null);
  }

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    async function fetchUser() {
      try {
        const { data } = await axios.get("/api/me");
        setUser(data.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  if (loading) return null;

  return (
    <userContext.Provider
      value={{ user, loginUser, logoutUser, isAdmin, isAuthenticated }}
    >
      {children}
    </userContext.Provider>
  );
};

export const useUser = () => useContext(userContext);
