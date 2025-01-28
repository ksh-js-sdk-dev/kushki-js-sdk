import { ContainerDemo } from "../../../components/ContainerDemo/ContainerDemo.tsx";
import InputConfigurationDemo from "../../../components/ConfigurationDemo/Components/InputConfigurationDemo.tsx";
import CardNumberHelper from "../../../components/CardNumberHelper/CardNumberHelper.tsx";
import { ResponseBox } from "../../../components/ResponseBox/ResponseBox.tsx";
import { useEffect, useState } from "react";
import { IKushki, init } from "Kushki";
import {
  CardPayoutOptions,
  CardPayoutTokenResponse,
  Fields,
  ICardPayouts,
  initCardPayoutToken,
  InputModelEnum,
  Styles
} from "Kushki/CardPayouts";

const cardPayoutStyles: Styles = {
  container: {
    display: "flex"
  },
  focus: {
    borderColor: "#0077ff"
  },
  input: {
    "& + label": {
      background: "transparent",
      color: "transparent",
      fontFamily: "IBM Plex Sans,sans-serif",
      fontSize: "12px",
      left: "10px",
      paddingLeft: "5px",
      paddingRight: "5px",
      position: "absolute",
      top: "0px"
    },
    "&::placeholder": {
      color: "#8b9298"
    },
    "&:focus + label": {
      background: "white",
      color: "#6D7781"
    },
    "&:focus::placeholder": {
      color: "transparent"
    },
    "&:invalid + label": {
      background: "white",
      color: "#B60000"
    },
    "&:not(:placeholder-shown) + label": {
      background: "white",
      color: "#6D7781"
    },
    "&:not(:placeholder-shown):invalid + label": {
      background: "white",
      color: "#B60000"
    },
    border: "1px solid rgba(203, 213, 224, 1)",
    borderRadius: "10px",
    color: "#293036",
    fontSize: "14px",
    height: "40px",
    outline: "none",
    paddingLeft: "8px",
    width: "300px"
  },
  invalid: {
    borderColor: "#B60000"
  },
  isSubscription: {
    "& + label": {
      fontFamily: "IBM Plex Sans,sans-serif",
      fontSize: "14px",
      paddingLeft: "5px",
      paddingTop: "3px",
      position: "relative"
    },
    "&:invalid": {
      appearance: "none",
      borderRadius: "3px"
    },
    height: "15px",
    width: "15px"
  }
};

const initialFieldsValidity: Fields = {
  cardholderName: { isValid: false },
  cardNumber: { isValid: false },
  isSubscription: { isValid: false }
};

export const RequestCardPayoutToken = () => {
  const [merchantId, setMerchantId] = useState<string>("");
  const [disableInitButton, setDisableInitButton] = useState<boolean>(false);
  const [disableRequestButton, setDisableRequestButton] =
    useState<boolean>(true);
  const [response, setResponse] = useState<string>("");
  const [cardService, setCardService] = useState<ICardPayouts>();
  const [fieldsValidityDemo, setFieldsValidityDemo] = useState<Fields>(
    initialFieldsValidity
  );

  const onInitCardPayoutToken = async () => {
    setDisableInitButton(true);
    setResponse("");

    const kushkiInstance: IKushki = await init({
      inTest: true,
      publicCredentialId: merchantId
    });
    const options: CardPayoutOptions = {
      fields: {
        cardholderName: {
          label: "Nombre del tarjetahabiente",
          placeholder: "Nombre del tarjetahabiente",
          selector: "cardHolderName_id"
        },
        cardNumber: {
          label: "Número de tarjeta",
          placeholder: "Número de tarjeta",
          selector: "cardNumber_id"
        },
        isSubscription: {
          isRequired: true,
          selector: "isSubscription_id"
        }
      },
      paymentType: "EC",
      styles: cardPayoutStyles
    };

    try {
      setCardService(await initCardPayoutToken(kushkiInstance, options));
    } catch (error: any) {
      setResponse(error.message);
    } finally {
      setDisableInitButton(false);
    }
  };

  const onRequestCardPayoutToken = async () => {
    setResponse("");
    setDisableRequestButton(true);

    if (cardService)
      try {
        const token: CardPayoutTokenResponse =
          await cardService.requestCardPayoutToken();

        setResponse(JSON.stringify(token));
      } catch (error: any) {
        setResponse(error.message);
      } finally {
        setDisableRequestButton(false);
        setDisableInitButton(false);
      }
  };

  const getErrorMessage = (field: string) => {
    if (
      fieldsValidityDemo[field as keyof Fields] &&
      !fieldsValidityDemo[field as keyof Fields]?.isValid &&
      fieldsValidityDemo[field as keyof Fields]?.errorType
    ) {
      if (fieldsValidityDemo[field as keyof Fields]?.errorType === "empty")
        return "Campo Requerido";

      return "Campo Inválido";
    }

    return "";
  };

  useEffect(() => {
    if (cardService) {
      cardService.onFieldValidity((fieldEvent) => {
        if ("triggeredBy" in fieldEvent) {
          setFieldsValidityDemo(fieldEvent.fields);
        }
        if ("isFormValid" in fieldEvent) {
          setDisableRequestButton(!fieldEvent.isFormValid);
        }
      });
    }
  }, [cardService]);

  useEffect(() => {
    if (merchantId) setDisableInitButton(false);
    else setDisableInitButton(true);
  }, [merchantId]);

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
        <button
          className={
            "mui-btn mui-btn--primary mui-btn--small button-border action-button"
          }
          disabled={disableInitButton}
          onClick={onInitCardPayoutToken}
        >
          Init SecureDeviceToken
        </button>
      </div>
      <div className={"box-hosted-fields"}>
        {cardService && (
          <div className="mui--text-subhead mui-text-custom">
            Completar los campos
          </div>
        )}
        <div id="cardHolderName_id" />
        <div className={"label-hosted-field-error"}>
          {getErrorMessage(InputModelEnum.CARDHOLDER_NAME)}
        </div>
        <br />
        <div id="cardNumber_id" />
        <div className={"label-hosted-field-error"}>
          {getErrorMessage(InputModelEnum.CARD_NUMBER)}
        </div>
        <div id="isSubscription_id" />
        <div className={"label-hosted-field-error"}>
          {getErrorMessage(InputModelEnum.IS_SUBSCRIPTION)}
        </div>
        {cardService && (
          <button
            className={
              "mui-btn mui-btn--primary mui-btn--small button-border action-button"
            }
            disabled={disableRequestButton}
            onClick={onRequestCardPayoutToken}
          >
            Request DeviceToken
          </button>
        )}
      </div>
      {response && <ResponseBox response={response} />}
    </ContainerDemo>
  );
};
