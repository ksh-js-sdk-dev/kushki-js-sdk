import { IButtonsDefaultInfoProps } from "../ConfigurationDemo.interface.ts";

const ButtonsDefaultInfo = ({
  setDefaultOptions,
  option,
  buttonActive,
  label,
  disableButtons
}: IButtonsDefaultInfoProps) => {
  const btnActiveClass: string =
    "mui-btn mui-btn--primary mui-btn--small button-contained";
  const btnDefaultClass: string =
    "mui-btn mui-btn--primary mui-btn--small button-outlined";

  return (
    <button
      disabled={disableButtons}
      className={buttonActive[option] ? btnActiveClass : btnDefaultClass}
      onClick={() => {
        setDefaultOptions(option);
      }}
    >
      {label}
    </button>
  );
};

export default ButtonsDefaultInfo;
