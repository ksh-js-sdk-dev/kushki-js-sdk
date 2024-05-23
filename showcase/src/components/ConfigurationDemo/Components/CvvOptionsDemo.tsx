import { OptionsCvv } from "../../../shared/enums/OptionsCvv.ts";

export interface ICvvOptionsDemoProps {
  inputOption: string;
  setInputOption: React.Dispatch<React.SetStateAction<OptionsCvv>>;
}

const CvvOptionsDemo = ({
  inputOption,
  setInputOption
}: ICvvOptionsDemoProps) => {
  return (
    <div className="mui-select select-container">
      <select
        className={
          inputOption
            ? "select-example select-label-selected"
            : "select-example select-label-empty"
        }
        onChange={(e) => {
          setInputOption(e.target.value as OptionsCvv);
        }}
        value={inputOption}
      >
        <option>{OptionsCvv.REQUIRED}</option>
        <option>{OptionsCvv.OPTIONAL}</option>
        <option>{OptionsCvv.OMIT}</option>
      </select>
      {inputOption && (
        <label className={"label-input-configuration"}>
          {"Opciones Campo Cvv"}
        </label>
      )}
    </div>
  );
};

export default CvvOptionsDemo;
