import { ButtonProps } from "../../../models/UI/UI";

const GreenButton: React.FC<ButtonProps> = ({
  logo,
  buttonText,
  onButtonClick,
}) => {
  return (
    <button
      className="btn bg-primary min-w-10 border-0 m-2 hover:bg-primary-hover"
      onClick={onButtonClick}
    >
      {logo}
      <article className="prose">
        <h4 className="text-white">{buttonText}</h4>
      </article>
    </button>
  );
};

export default GreenButton;
