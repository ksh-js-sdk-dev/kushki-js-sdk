import { ContainerDemo } from "../../../components/ContainerDemo/ContainerDemo.tsx";
import InputConfigurationDemo from "../../../components/ConfigurationDemo/Components/InputConfigurationDemo.tsx";
import { useState } from "react";
import CardNumberHelper from "../../../components/CardNumberHelper/CardNumberHelper.tsx";
import { init } from "Kushki";
import { requestBankList } from "Kushki/Transfer";
import { ResponseBox } from "../../../components/ResponseBox/ResponseBox.tsx";
import "./GetBankList.css";

export const GetBankList = () => {
  const [merchantId, setMerchantId] = useState<string>("");
  const [disableButton, setDisableButton] = useState<boolean>(false);
  const [response, setResponse] = useState<string>("");

  const onRequestBankList = async () => {
    setDisableButton(true);
    setResponse("");

    try {
      const kushkiInstance = await init({
        inTest: true,
        publicCredentialId: merchantId
      });

      const response = await requestBankList(kushkiInstance);
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
        <h3 className={"title-demo"}>Request Bank list</h3>
        <InputConfigurationDemo
          disableInputPrev={false}
          setInputOption={setMerchantId}
          valueInput={merchantId}
          label={"Merchant ID"}
        />
        <CardNumberHelper
          displayHostedFields={true}
          cardNumberHelper={"7cad8d921dcb463eb92c43c049a849b0"}
        />
        <button
          className={
            "mui-btn mui-btn--primary mui-btn--small button-border action-button"
          }
          disabled={disableButton}
          onClick={onRequestBankList}
        >
          requestBankList
        </button>
      </div>

      {response && <ResponseBox response={response} />}
    </ContainerDemo>
  );
};
