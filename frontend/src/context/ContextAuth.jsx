import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const Context = ({ children }) => {
  const [user, setUser] = useState(null);

  const baseUrl = "https://stackwave-h1x0.onrender.com";

  const checkAuth = async () => {
    try {
      const response = await axios.get(`${baseUrl}/users/me`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUser({ id: response.data._id, name: response.data.username });
    } catch (error) {
      setUser(null);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default Context;
