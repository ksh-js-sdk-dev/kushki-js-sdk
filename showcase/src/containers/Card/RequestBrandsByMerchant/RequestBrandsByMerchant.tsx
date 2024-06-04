import { ContainerDemo } from "../../../components/ContainerDemo/ContainerDemo.tsx";
import InputConfigurationDemo from "../../../components/ConfigurationDemo/Components/InputConfigurationDemo.tsx";
import CardNumberHelper from "../../../components/CardNumberHelper/CardNumberHelper.tsx";
import { ResponseBox } from "../../../components/ResponseBox/ResponseBox.tsx";
import { useEffect, useState } from "react";
import { IKushki, init } from "Kushki";
import {
  GetBrandsByMerchantResponse,
  requestBrandsByMerchant
} from "Kushki/Card";

export const RequestBrandsByMerchant = () => {
  const [merchantId, setMerchantId] = useState<string>("");
  const [disableButton, setDisableButton] = useState<boolean>(false);
  const [response, setResponse] = useState<string>("");

  const onGetBrandsByMerchant = async () => {
    setDisableButton(true);
    setResponse("");

    try {
      const kushkiInstance: IKushki = await init({
        inTest: true,
        publicCredentialId: merchantId
      });

      const response: GetBrandsByMerchantResponse[] =
        await requestBrandsByMerchant(kushkiInstance);

      setResponse(JSON.stringify(response));
    } catch (error: any) {
      setResponse(error.message);
    } finally {
      setDisableButton(false);
    }
  };

  useEffect(() => {
    if (merchantId) setDisableButton(false);
    else setDisableButton(true);
  }, [merchantId]);

  return (
    <ContainerDemo>
      <div className={"items-content"}>
        <h3 className={"title-demo"}>Request Brands by Merchant</h3>
        <InputConfigurationDemo
          disableInputPrev={false}
          setInputOption={setMerchantId}
          valueInput={merchantId}
          label={"Merchant ID"}
        />
        <CardNumberHelper
          displayHostedFields={true}
          cardNumberHelper={"fb1155b79d114e03954be689f3af2ad2"}
        />
        <button
          className={
            "mui-btn mui-btn--primary mui-btn--small button-border action-button"
          }
          disabled={disableButton}
          onClick={onGetBrandsByMerchant}
        >
          getBrandsByMerchant
        </button>
      </div>

      {response && <ResponseBox response={response} />}
    </ContainerDemo>
  );
};
