import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/AuthContext";
import GreenButton from "./GreenButton";
import { useForm } from "../../../hooks/FormContext";

interface LogoutButtonProps {
  language?: string; // optional language prop
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ language }) => {
  const { logout } = useAuth();
  const {clearFormContext} = useForm();
  const navigate = useNavigate();
  const handleLogout = () => {
    clearFormContext();
    logout();
    navigate("login");
  };
  return <GreenButton buttonText={language === "en" ? "Logout" : language === "zh" ? "退出" : "Logout"} onButtonClick={handleLogout} />;
};

export default LogoutButton;
