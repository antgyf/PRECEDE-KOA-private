import BrownButton from "../../UI/Button/BrownButton";

interface AddPatientButtonProps {
  onButtonClick: () => void;
}

const AddPatientButton: React.FC<AddPatientButtonProps> = ({
  onButtonClick,
}) => {
  return (
    <BrownButton
      logo={
        <svg
          width="15"
          height="15"
          viewBox="0 0 6 7"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2.47727 6.40341V0.778409H3.43182V6.40341H2.47727ZM0.142046 4.06818V3.11364H5.76705V4.06818H0.142046Z"
            fill="white"
          />
        </svg>
      }
      buttonText={"Add new patient"}
      onButtonClick={onButtonClick}
    />
  );
};

export default AddPatientButton;
