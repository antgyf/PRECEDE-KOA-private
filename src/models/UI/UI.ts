export interface ButtonProps {
  logo?: React.ReactNode;
  buttonText: string;
  onButtonClick?: () => void;
  disabled?: boolean;
}
