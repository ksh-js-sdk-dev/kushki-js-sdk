import { ContainerDemo } from "../../../components/ContainerDemo/ContainerDemo.tsx";
import InputConfigurationDemo from "../../../components/ConfigurationDemo/Components/InputConfigurationDemo.tsx";
import CardNumberHelper from "../../../components/CardNumberHelper/CardNumberHelper.tsx";
import { ResponseBox } from "../../../components/ResponseBox/ResponseBox.tsx";
import { useEffect, useState } from "react";
import { IKushki, init } from "Kushki";
import { initSecureDeviceToken } from "Kushki/CardSubscriptions";

export const RequestSecureDeviceToken = () => {
  const [merchantId, setMerchantId] = useState<string>("");
  const [subscriptionId, setSubscriptionId] = useState<string>("");
  const [disableButton, setDisableButton] = useState<boolean>(false);
  const [response, setResponse] = useState<string>("");

  const onInitSecureDeviceToken = async () => {
    setDisableButton(true);
    setResponse("");

    try {
      const kushkiInstance: IKushki = await init({
        inTest: true,
        publicCredentialId: merchantId
      });

      const cardSubscription = await initSecureDeviceToken(kushkiInstance, {
        selector: "cvv_id"
      });

      console.log(cardSubscription);
      setResponse("iniciado");
    } catch (error: any) {
      setResponse(error.message);
    } finally {
      setDisableButton(false);
    }
  };

  useEffect(() => {
    if (merchantId && subscriptionId) setDisableButton(false);
    else setDisableButton(true);
  }, [merchantId, subscriptionId]);

  return (
    <ContainerDemo>
      <div className={"items-content"}>
        <h3 className={"title-demo"}>Request Device Token</h3>
        <InputConfigurationDemo
          disableInputPrev={false}
          setInputOption={setMerchantId}
          valueInput={merchantId}
          label={"Merchant ID"}
        />
        <CardNumberHelper
          displayHostedFields={true}
          cardNumberHelper={"5bdbaec2020f4d118db902f5799cfc24"}
        />
        <InputConfigurationDemo
          disableInputPrev={false}
          setInputOption={setSubscriptionId}
          valueInput={subscriptionId}
          label={"Subscription ID"}
        />
        <CardNumberHelper
          displayHostedFields={true}
          cardNumberHelper={"1710517723209000"}
        />
        <button
          className={
            "mui-btn mui-btn--primary mui-btn--small button-border action-button"
          }
          disabled={disableButton}
          onClick={onInitSecureDeviceToken}
        >
          initSecureDeviceToken
        </button>
      </div>

      {response && <ResponseBox response={response} />}
      <div id="cvv_id"></div>
    </ContainerDemo>
  );
};
