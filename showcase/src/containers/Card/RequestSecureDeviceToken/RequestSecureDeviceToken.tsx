import { ContainerDemo } from "../../../components/ContainerDemo/ContainerDemo.tsx";
import InputConfigurationDemo from "../../../components/ConfigurationDemo/Components/InputConfigurationDemo.tsx";
import CardNumberHelper from "../../../components/CardNumberHelper/CardNumberHelper.tsx";
import { ResponseBox } from "../../../components/ResponseBox/ResponseBox.tsx";
import { useEffect, useState } from "react";
import { IKushki, init } from "Kushki";
import {
  ICardSubscriptions,
  initSecureDeviceToken,
  InputModelEnum,
  SecureDeviceTokenOptions,
  TokenResponse
} from "Kushki/Card";
import { hostedFieldsStyles } from "../RequestCardToken/Checkout.constants.ts";
import {
  fieldsErrorEmpty,
  fieldsErrorInvalid
} from "../../../shared/enums/ErrorLabels.enum.ts";

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
    setInputError("");

    const kushkiInstance: IKushki = await init({
      inTest: true,
      publicCredentialId: merchantId
    });
    const options: SecureDeviceTokenOptions = {
      fields: {
        cvv: {
          label: "CVV",
          placeholder: "CVV",
          selector: "cvv_id"
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
        const token: TokenResponse = await cardService.requestDeviceToken({
          subscriptionId: subscriptionId
        });

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
          cardNumberHelper={"eda2b0b0c5f3426483a678c82cc8a5ef"}
        />
        <InputConfigurationDemo
          disableInputPrev={false}
          setInputOption={setSubscriptionId}
          valueInput={subscriptionId}
          label={"Subscription ID"}
        />
        <CardNumberHelper
          displayHostedFields={true}
          cardNumberHelper={"1739385464013734"}
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
        {cardService && (
          <div className="mui--text-subhead mui-text-custom">
            Completar el campo
          </div>
        )}
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
      {response && <ResponseBox response={response} />}
    </ContainerDemo>
  );
};
