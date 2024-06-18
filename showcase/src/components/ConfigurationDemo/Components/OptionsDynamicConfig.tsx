import "../../Components.css";

export interface IOptionsDynamicConfig {
  label: string;
  defaultOption: string;
  optionList: string[];
  setInputOption: React.Dispatch<React.SetStateAction<string>>;
}

const OptionsDynamicConfig = ({
  label,
  defaultOption,
  setInputOption,
  optionList
}: IOptionsDynamicConfig) => {
  return (
    <div className="mui-select select-dynamic">
      <select
        className={"options-dynamic"}
        onChange={(e) => {
          setInputOption(e.target.value);
        }}
        value={defaultOption}
      >
        {optionList.map((option: string, index: number) => (
          <option key={index}>{option}</option>
        ))}
      </select>
      <label className={"options-dynamic-label"}>{label}</label>
    </div>
  );
};

export default OptionsDynamicConfig;
