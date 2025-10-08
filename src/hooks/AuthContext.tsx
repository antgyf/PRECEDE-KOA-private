import api from "../api/api";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface User {
  name: string;
  id: number;
}

interface AuthContextProps {
  user: User | null;
  isSurgeon: boolean;
  logout: () => void;
  toggleIsSurgeon: () => void;
  login: (username: string, id: number) => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Load user from localStorage (if exists) when app loads
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [isSurgeon, setIsSurgeon] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/${isSurgeon ? "surgeons" : "researchers"}/me`, { withCredentials: true });
        const userData = { id: res.data.id, name: res.data.username };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      } catch (error) {
        console.warn("No logged-in user");
        setUser(null);
        localStorage.removeItem("user");
      }
    };
    fetchUser();
  }, [isSurgeon]);

  const toggleIsSurgeon = () => setIsSurgeon(!isSurgeon);

  const login = (username: string, id: number) => {
    const userData = { name: username, id };
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };


  const logout = async () => {
    try {
      await api.post(
        `/${isSurgeon ? "surgeons" : "researchers"}/logout`,
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setUser(null);
      localStorage.removeItem("user");
    }
  };


  return (
    <AuthContext.Provider
      value={{ user, isSurgeon, login, logout, toggleIsSurgeon }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthProvider;
