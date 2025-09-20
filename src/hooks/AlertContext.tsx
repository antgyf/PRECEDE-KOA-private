import { createContext, useContext, useState, ReactNode } from "react";
import { Alert } from "../models/alert/alert";

interface AlertContextProps {
  alert: Alert; // Provide alert state
  showAlert: (message: string, type: "success" | "error" | "info") => void;
}

export const AlertContext = createContext<AlertContextProps | undefined>(
  undefined
);

const AlertProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [alert, setAlert] = useState<Alert>({
    message: "",
    type: "success",
  });

  const showAlert = (msg: string, type: "success" | "error" | "info") => {
    setAlert({ message: msg, type });
    setTimeout(() => setAlert({ message: "", type: "success" }), 3000);
  };

  return (
    <AlertContext.Provider value={{ alert, showAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

// Custom Hook to Use Alert Context
export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};

export default AlertProvider;
