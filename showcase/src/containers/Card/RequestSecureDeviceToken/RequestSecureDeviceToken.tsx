import { ContainerDemo } from "../../../components/ContainerDemo/ContainerDemo.tsx";
import InputConfigurationDemo from "../../../components/ConfigurationDemo/Components/InputConfigurationDemo.tsx";
import CardNumberHelper from "../../../components/CardNumberHelper/CardNumberHelper.tsx";
import { ResponseBox } from "../../../components/ResponseBox/ResponseBox.tsx";
import { useEffect, useState } from "react";
import { IKushki, init } from "Kushki";
import {
  ICardSubscriptions,
  initSecureDeviceToken,
  SecureDeviceTokenOptions,
  TokenResponse
} from "Kushki/Card";
import { hostedFieldsStyles } from "../RequestCardToken/Checkout.constants.ts";
import {
  fieldsErrorEmpty,
  fieldsErrorInvalid
} from "../../../shared/enums/ErrorLabels.enum.ts";
import { InputModelEnum } from "Kushki/Card";

export const RequestSecureDeviceToken = () => {
  const [merchantId, setMerchantId] = useState<string>("");
  const [subscriptionId, setSubscriptionId] = useState<string>("");
  const [disableInitButton, setDisableInitButton] = useState<boolean>(false);
  const [disableRequestButton, setDisableRequestButton] =
    useState<boolean>(true);
  const [inputError, setInputError] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [cardService, setCardService] = useState<ICardSubscriptions>();

  const onInitSecureDeviceToken = async () => {
    setDisableInitButton(true);
    setResponse("");

    const kushkiInstance: IKushki = await init({
      inTest: true,
      publicCredentialId: merchantId
    });
    const options: SecureDeviceTokenOptions = {
      body: { subscriptionId },
      fields: {
        cvv: {
          selector: "cvv_id",
          label: "CVV",
          placeholder: "CVV"
        }
      },
      styles: hostedFieldsStyles
    };
    try {
      setCardService(await initSecureDeviceToken(kushkiInstance, options));
    } catch (error: any) {
      setResponse(error.message);
    } finally {
      setDisableInitButton(false);
    }
  };

  const onRequestSecureDeviceToken = async () => {
    setResponse("");
    setDisableRequestButton(true);

    if (cardService)
      try {
        const token: TokenResponse = await cardService.requestDeviceToken();

        setResponse(token.token);
      } catch (error: any) {
        setResponse(error.message);
      } finally {
        setDisableRequestButton(false);
        setDisableInitButton(false);
      }
  };

  useEffect(() => {
    if (cardService) {
      cardService.onFieldValidity((fieldEvent) => {
        if (fieldEvent.isValid) {
          setDisableRequestButton(false);
          setInputError("");
        } else {
          setDisableRequestButton(true);
          setInputError(
            fieldEvent.errorType === "empty"
              ? fieldsErrorEmpty[InputModelEnum.CVV]
              : fieldsErrorInvalid[InputModelEnum.CVV]
          );
        }
      }, "cvv");
    }
  }, [cardService]);

  useEffect(() => {
    if (merchantId && subscriptionId) setDisableInitButton(false);
    else setDisableInitButton(true);
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
          disabled={disableInitButton}
          onClick={onInitSecureDeviceToken}
        >
          Init SecureDeviceToken
        </button>
      </div>
      <div className={"box-hosted-fields"}>
        <div id="cvv_id" />
        {inputError && (
          <div className={"label-hosted-field-error"}>{inputError}</div>
        )}
        {cardService && (
          <button
            className={
              "mui-btn mui-btn--primary mui-btn--small button-border action-button"
            }
            disabled={disableRequestButton}
            onClick={onRequestSecureDeviceToken}
          >
            Request DeviceToken
          </button>
        )}
      </div>
      {response && (
        <>
          <ResponseBox response={response} />
        </>
      )}
    </ContainerDemo>
  );
};
