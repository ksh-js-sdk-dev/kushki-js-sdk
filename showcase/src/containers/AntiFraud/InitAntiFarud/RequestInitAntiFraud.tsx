import { init } from "Kushki";
import { requestInitAntiFraud, SiftScienceObject } from "Kushki/AntiFraud";
import { useState } from "react";
import CardNumberHelper from "../../../components/CardNumberHelper/CardNumberHelper.tsx";
import InputConfigurationDemo from "../../../components/ConfigurationDemo/Components/InputConfigurationDemo.tsx";
import { ContainerDemo } from "../../../components/ContainerDemo/ContainerDemo.tsx";
import { ResponseBox } from "../../../components/ResponseBox/ResponseBox.tsx";

export const RequestInitAntiFraud = () => {
  const [merchantId, setMerchantId] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [disableButton, setDisableButton] = useState<boolean>(false);
  const [response, setResponse] = useState<string>("");

  const onRequestInitAntiFraud = async () => {
    setDisableButton(true);
    setResponse("");

    try {
      const kushkiInstance = await init({
        inTest: true,
        publicCredentialId: merchantId
      });

      const response: SiftScienceObject = await requestInitAntiFraud(
        kushkiInstance,
        userId
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
        <h3 className={"title-demo"}>Request Init AntiFraud</h3>
        <InputConfigurationDemo
          disableInputPrev={false}
          setInputOption={setMerchantId}
          valueInput={merchantId}
          label={"Merchant ID"}
        />
        <CardNumberHelper
          displayHostedFields={true}
          cardNumberHelper={"eda2b0b0c5f3426483a678c82cc8a5ef"}
        />
        <InputConfigurationDemo
          disableInputPrev={false}
          setInputOption={setUserId}
          valueInput={userId}
          label={"User ID"}
        />
        <button
          className={
            "mui-btn mui-btn--primary mui-btn--small button-border action-button"
          }
          disabled={disableButton}
          onClick={onRequestInitAntiFraud}
        >
          requestInitAntiFraud
        </button>
        {response && <ResponseBox response={response} />}
      </div>
    </ContainerDemo>
  );
};
