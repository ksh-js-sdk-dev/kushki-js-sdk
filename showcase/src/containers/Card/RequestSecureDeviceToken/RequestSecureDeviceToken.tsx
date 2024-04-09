import { ContainerDemo } from "../../../components/ContainerDemo/ContainerDemo.tsx";
import InputConfigurationDemo from "../../../components/ConfigurationDemo/Components/InputConfigurationDemo.tsx";
import CardNumberHelper from "../../../components/CardNumberHelper/CardNumberHelper.tsx";
import { ResponseBox } from "../../../components/ResponseBox/ResponseBox.tsx";
import { useEffect, useState } from "react";
import { IKushki, init } from "Kushki";
import { initSecureDeviceToken } from "Kushki/CardSubscriptions";
import { ICardSubscriptions } from "../../../../../src/repository/ICardSubscriptions.ts";
import { hostedFieldsStyles } from "../RequestCardToken/Checkout.constants.ts";

export const RequestSecureDeviceToken = () => {
  const [merchantId, setMerchantId] = useState<string>("");
  const [subscriptionId, setSubscriptionId] = useState<string>("");
  const [disableButton, setDisableButton] = useState<boolean>(false);
  const [response, setResponse] = useState<string>("");

  const [cardService, setCardService] = useState<ICardSubscriptions>();
  const onInitSecureDeviceToken = async () => {
    setDisableButton(true);
    setResponse("");

    try {
      const kushkiInstance: IKushki = await init({
        inTest: true,
        publicCredentialId: merchantId
      });

      setCardService(
        await initSecureDeviceToken(kushkiInstance, {
          body: { subscriptionId },
          fields: {
            cvv: {
              selector: "cvv_id"
            }
          },
          styles: hostedFieldsStyles
        })
      );
      setResponse("iniciado");
    } catch (error: any) {
      setResponse(error.message);
    } finally {
      setDisableButton(false);
    }
  };

  const onRequestSecureDeviceToken = async () => {
    setDisableButton(true);
    setResponse("");

    console.log(cardService?.getFormValidity());

    try {
      const token = await cardService!.requestDeviceToken();

      console.log(token);
      setResponse(token.token);
    } catch (error: any) {
      setResponse(error.message);
    } finally {
      setDisableButton(false);
    }
  };

  const onResetCvv = async () => {
    try {
      if (cardService) await cardService.reset();
    } catch (error: any) {
      console.log(error);
    }
  };

  const onFocusCvv = async () => {
    try {
      if (cardService) await cardService.focus();
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (cardService) {
      cardService.onFieldFocus((fieldEvent) => {
        console.log("focus", fieldEvent);
      });

      cardService.onFieldBlur((fieldEvent) => {
        console.log("blur", fieldEvent);
      });

      cardService.onFieldSubmit((fieldEvent) => {
        console.log("submit", fieldEvent);
      });

      cardService.onFieldValidity((fieldEvent) => {
        console.log("validity", fieldEvent);
      });
    }
  }, [cardService]);

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
        <button
          className={
            "mui-btn mui-btn--primary mui-btn--small button-border action-button"
          }
          disabled={disableButton}
          onClick={onResetCvv}
        >
          reset
        </button>
        <button
          className={
            "mui-btn mui-btn--primary mui-btn--small button-border action-button"
          }
          disabled={disableButton}
          onClick={onFocusCvv}
        >
          focus
        </button>
      </div>
      <div id="cvv_id"></div>
      {response && (
        <>
          <ResponseBox response={response} />
          <button
            className={
              "mui-btn mui-btn--primary mui-btn--small button-border action-button"
            }
            disabled={disableButton}
            onClick={onRequestSecureDeviceToken}
          >
            RequestDeviceToken
          </button>
        </>
      )}
    </ContainerDemo>
  );
};
