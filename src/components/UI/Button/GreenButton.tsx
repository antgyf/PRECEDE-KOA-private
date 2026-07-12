import { ButtonProps } from "../../../models/UI/UI";

const GreenButton: React.FC<ButtonProps> = ({
  logo,
  buttonText,
  onButtonClick,
}) => {
  return (
    <button
      className="btn bg-primary min-w-10 border-0 m-2 hover:bg-primary-hover leading-snug text-center max-md:w-full max-md:m-0 max-md:text-base max-md:whitespace-normal max-md:break-keep"
      onClick={onButtonClick}
    >
      {logo}
      <span className="text-white font-bold">{buttonText}</span>
    </button>
  );
};

export default GreenButton;
