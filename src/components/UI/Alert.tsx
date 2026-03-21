import { useAlert } from "../../hooks/AlertContext";

const ALERT_TYPES: Record<
  string,
  { bgColor: string; textColor: string; icon: JSX.Element }
> = {
  success: {
    bgColor: "bg-green-100",
    textColor: "text-green-800",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 shrink-0 stroke-current"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  error: {
    bgColor: "bg-red-100",
    textColor: "text-red-800",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 shrink-0 stroke-current"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  info: {
    bgColor: "bg-blue-100",
    textColor: "text-blue-800",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        className="h-6 w-6 shrink-0 stroke-current"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  warning: {
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-800",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        className="h-6 w-6 shrink-0 stroke-current"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
};

// Default alert style for unknown types
const DEFAULT_ALERT = {
  bgColor: "bg-gray-100",
  textColor: "text-gray-800",
  icon: <></>,
};

const Alert: React.FC = () => {
  const { alert } = useAlert();
  const { bgColor, textColor, icon } = ALERT_TYPES[alert.type] || DEFAULT_ALERT;

  return (
    <div
      className={`fixed top-2 left-1/2 transform -translate-x-1/2 w-3/4 md:w-2/3 z-50 p-3 rounded-md shadow-md flex items-center ${bgColor} ${textColor}`}
    >
      {icon}
      <span className="ml-2">{alert.message}</span>
    </div>
  );
};

export default Alert;
