import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/AuthContext";
import GreenButton from "./GreenButton";

const LogoutButton: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("login");
  };
  return <GreenButton buttonText="Logout" onButtonClick={handleLogout} />;
};

export default LogoutButton;
