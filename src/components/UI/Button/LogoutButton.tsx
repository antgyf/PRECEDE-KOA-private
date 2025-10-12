import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/AuthContext";
import GreenButton from "./GreenButton";
import { useForm } from "../../../hooks/FormContext";

const LogoutButton: React.FC = () => {
  const { logout } = useAuth();
  const {clearFormContext} = useForm();
  const navigate = useNavigate();
  const handleLogout = () => {
    clearFormContext();
    logout();
    navigate("login");
  };
  return <GreenButton buttonText="Logout" onButtonClick={handleLogout} />;
};

export default LogoutButton;
