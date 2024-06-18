import "../../Components.css";

export interface IRadioDynamicConfig {
  label: string;
  optionList: string[];
  setInputOption: React.Dispatch<React.SetStateAction<string>>;
}

const RadioDynamicConfig = ({
  label,
  setInputOption,
  optionList
}: IRadioDynamicConfig) => {
  return (
    <div className="mui-container-fluid radio-container">
      <label className={"options-dynamic-label"}>{label}</label>
      <div className="mui-row">
        {optionList.map((option, index) => (
          <div className="mui-col-md-6" key={index}>
            <div className="mui-radio radio-dynamic">
              <label>
                <input
                  type="radio"
                  name={label}
                  value={option}
                  onChange={(e) => setInputOption(e.target.value)}
                />
                {option}
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RadioDynamicConfig;
