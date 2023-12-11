import { IButtonsDefaultInfoProps } from "../ConfigurationDemo.interface.ts";

const ButtonsDefaultInfo = ({
  setDefaultOptions,
  option,
  buttonActive,
  label,
  disableButtons
}: IButtonsDefaultInfoProps) => {
  const btnActiveClass: string =
    "mui-btn mui-btn--primary mui-btn--small button-contained config-button";
  const btnDefaultClass: string =
    "mui-btn mui-btn--small button-outlined config-button";

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
