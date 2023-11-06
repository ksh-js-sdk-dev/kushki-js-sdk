import { Currency } from "../../../../../types/card_options";

export interface ICurrencyConfigurationDemoProps {
  disableInputPrev: boolean;
  inputCurrency: Currency | string | undefined;
  setInputCurrency: React.Dispatch<
    React.SetStateAction<Currency | string | undefined>
  >;
}

const CurrencyConfigurationDemo = ({
  disableInputPrev,
  inputCurrency,
  setInputCurrency
}: ICurrencyConfigurationDemoProps) => {
  return (
    <div className="mui-select divContainer">
      <select
        className={
          inputCurrency
            ? "selectExample selectLabelSelected"
            : "selectExample selectLabelEmpty"
        }
        disabled={disableInputPrev}
        onChange={(e) => {
          setInputCurrency(e.target.value as Currency);
        }}
        defaultValue={""}
        value={inputCurrency}
      >
        <option value={""} disabled hidden>
          Seleccionar Moneda
        </option>
        <option value={"USD"}>USD</option>
        <option>COP</option>
        <option>CLP</option>
        <option>UF</option>
        <option>PEN</option>
        <option>MXN</option>
        <option>CRC</option>
        <option>GTQ</option>
        <option>HNL</option>
        <option>NIO</option>
        <option>BRL</option>
      </select>
      {inputCurrency && (
        <label className={"label-input-configuration"}>Moneda</label>
      )}
    </div>
  );
};

export default CurrencyConfigurationDemo;
