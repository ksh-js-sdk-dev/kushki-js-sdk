import { ContainerDemo } from "../../../components/ContainerDemo/ContainerDemo.tsx";
import InputConfigurationDemo from "../../../components/ConfigurationDemo/Components/InputConfigurationDemo.tsx";
import { useState } from "react";
import CardNumberHelper from "../../../components/CardNumberHelper/CardNumberHelper.tsx";
import { init } from "Kushki";
import { ResponseBox } from "../../../components/ResponseBox/ResponseBox.tsx";
import "./RequestCommissionConfiguration.css";
import CurrencyConfigurationDemo from "../../../components/ConfigurationDemo/Components/CurrencyConfigurationDemo.tsx";
import {
  CommissionConfigurationRequest,
  requestCommissionConfiguration
} from "Kushki/Merchant";
import { Currency } from "../../../../../types/card_options";

export const RequestCommissionConfiguration = () => {
  const [merchantId, setMerchantId] = useState<string>("");
  const [currency, setCurrency] = useState<Currency | string>();
  const [totalAmount, setTotalAmount] = useState<string>("");
  const [disableButton, setDisableButton] = useState<boolean>(false);
  const [response, setResponse] = useState<string>("");

  const onRequestCommissionConfiguration = async () => {
    setDisableButton(true);
    setResponse("");

    try {
      const kushkiInstance = await init({
        inTest: true,
        publicCredentialId: merchantId
      });
      const body: CommissionConfigurationRequest = {
        totalAmount: +totalAmount,
        currency: currency as Currency
      };

      const response = await requestCommissionConfiguration(
        kushkiInstance,
        body
      );
      setResponse(JSON.stringify(response));
    } catch (error: any) {
      setResponse(error.message);
    } finally {
      setDisableButton(false);
    }
  };

  return (
    <ContainerDemo>
      <div className={"items-content"}>
        <h3 className={"title-demo"}>Request Commission Configuration</h3>
        <InputConfigurationDemo
          disableInputPrev={false}
          setInputOption={setMerchantId}
          valueInput={merchantId}
          label={"Merchant ID"}
        />
        <CardNumberHelper
          displayHostedFields={true}
          cardNumberHelper={"3bf0e1c3d732415ea0ba15cb4f47f23c"}
        />
        <CurrencyConfigurationDemo
          disableInputPrev={disableButton}
          inputCurrency={currency}
          setInputCurrency={setCurrency}
        />
        <InputConfigurationDemo
          disableInputPrev={false}
          setInputOption={setTotalAmount}
          valueInput={totalAmount}
          mask={"9999999"}
          label={"Monto Total"}
        />
        <button
          className={
            "mui-btn mui-btn--primary mui-btn--small button-border action-button"
          }
          disabled={disableButton}
          onClick={onRequestCommissionConfiguration}
        >
          requestCommissionConfiguration
        </button>
      </div>

      {response && <ResponseBox response={response} />}
    </ContainerDemo>
  );
};
