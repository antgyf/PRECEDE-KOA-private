import { ButtonProps } from "../../../models/UI/UI";

const BrownButton: React.FC<ButtonProps> = ({
  logo,
  buttonText,
  onButtonClick,
}) => {
  return (
    <button
      className="btn bg-accent min-w-10 border-0 my-2 hover:bg-accent-hover"
      onClick={onButtonClick}
    >
      {logo}
      <article className="prose">
        <h4 className="text-white">{buttonText}</h4>
      </article>
    </button>
  );
};

export default BrownButton;
