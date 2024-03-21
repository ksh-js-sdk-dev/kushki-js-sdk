import InputMask from "react-input-mask";

export interface IInputConfigurationDemoProps {
  disableInputPrev: boolean;
  valueInput: string;
  setInputOption: React.Dispatch<React.SetStateAction<string>>;
  label: string;
  mask?: string;
}

const InputConfigurationDemo = ({
  disableInputPrev,
  valueInput,
  setInputOption,
  label,
  mask
}: IInputConfigurationDemoProps) => {
  return (
    <>
      <div className="mui-textfield mui-textfield--float-label div-container">
        <InputMask
          mask={mask ?? "*".repeat(100)}
          maskChar={null}
          onChange={(e) => {
            setInputOption(e.target.value);
          }}
          disabled={disableInputPrev}
          value={valueInput}
        >
          {
            // @ts-ignore:next-line
            (inputProps: any) => (
              <input
                {...inputProps}
                className={"input-configuration"}
                type="text"
                disabled={disableInputPrev}
                value={valueInput}
              />
            )
          }
        </InputMask>
        <label className={"label-input-configuration"}>{label}</label>
      </div>
    </>
  );
};

export default InputConfigurationDemo;
