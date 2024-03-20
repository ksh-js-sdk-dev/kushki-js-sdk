import { ContainerDemo } from "../../components/ContainerDemo/ContainerDemo.tsx";
import InputConfigurationDemo from "../../components/ConfigurationDemo/Components/InputConfigurationDemo.tsx";
import { useState } from "react";
import CardNumberHelper from "../../components/CardNumberHelper/CardNumberHelper.tsx";
import { init } from "Kushki";
import { ResponseBox } from "../../components/ResponseBox/ResponseBox.tsx";
import "./AntiFraud.css";
import { SecureInitRequest } from "../../../../types/secure_init_request";
import {
  requestSecureInit,
  validate3DS
} from "../../../../src/module/AntiFraud.ts";
import axios from "axios";
import { SecureInitResponse } from "../../../../types/secure_init_response";
import { ErrorResponse } from "../../../../types/error_response";
import { get } from "lodash";
import { CardTokenResponse } from "../../../../types/card_token_response";
import CurrencyConfigurationDemo from "../../components/ConfigurationDemo/Components/CurrencyConfigurationDemo.tsx";
import { Currency } from "../../../../types/card_options";

export const AntiFraud = () => {
  const [merchantId, setMerchantId] = useState<string>(
    "d6b3e17702e64d85b812c089e24a1ca1"
  );
  const [inputCurrency, setInputCurrency] = useState<
    Currency | string | undefined
  >("COP");
  const [cardNumber, setCardNumber] = useState<string>("4000000000001091");
  const [cardHolder, setCardHolder] = useState<string>("");
  const [expirationDate, setExpirationDate] = useState<string>("");
  const [securityCode, setSecurityCode] = useState<string>("");
  const [inputAmount, setInputAmount] = useState<string>("");
  const [disableButton, setDisableButton] = useState<boolean>(false);
  const [disableField, setDisableField] = useState<boolean>(true);
  const [response, setResponse] = useState<string>("");
  const [secureInitJwt, setSecureInitJwt] = useState<
    SecureInitResponse | ErrorResponse
  >({
    jwt: ""
  });
  const [cardTokenResponse, setCardTokenResponse] = useState<CardTokenResponse>(
    {
      secureId: "",
      secureService: "",
      security: {},
      settlement: 0,
      token: ""
    }
  );

  const onRequestSecureInit = async () => {
    setDisableButton(true);
    setResponse("");

    try {
      const kushkiInstance = await init({
        inTest: true,
        publicCredentialId: merchantId
      });
      const secureInitRequest: SecureInitRequest = {
        card: {
          number: cardNumber
        }
      };

      const secureInitResponse = await requestSecureInit(
        kushkiInstance,
        secureInitRequest
      );

      setResponse(JSON.stringify(secureInitResponse));
      setSecureInitJwt(secureInitResponse);
      setDisableField(false);
    } catch (error: any) {
      setResponse(error.message);
    } finally {
      setDisableButton(false);
    }
  };

  const onTokenRequest = async () => {
    setDisableButton(true);
    setResponse("");
    const dateParts = expirationDate.split("/");

    const month = dateParts[0];
    const year = dateParts[1];

    try {
      const kushkiInstance = await init({
        inTest: true,
        publicCredentialId: merchantId
      });

      const options = {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Public-Merchant-Id": kushkiInstance.getPublicCredentialId()
        }
      };

      const { data } = await axios.post(
        "https://api-uat.kushkipagos.com/card/v1/tokens",
        {
          card: {
            cvv: securityCode,
            expiryMonth: month,
            expiryYear: year,
            name: cardHolder,
            number: cardNumber
          },
          currency: inputCurrency,
          jwt: get(secureInitJwt, "jwt"),
          totalAmount: parseFloat(inputAmount)
        },
        options
      );

      setCardTokenResponse(data);
      setResponse(JSON.stringify(data));
    } catch (error: any) {
      setResponse(error.message);
    } finally {
      setDisableButton(false);
    }
  };

  const on3DSValidation = async () => {
    setDisableButton(true);
    setResponse("");
    let isValid: boolean = false;

    try {
      const kushkiInstance = await init({
        inTest: true,
        publicCredentialId: merchantId
      });

      const response = await validate3DS(kushkiInstance, cardTokenResponse);

      if (response.token) isValid = true;

      setResponse(
        JSON.stringify({
          isValid
        })
      );
    } catch (error: any) {
      setResponse(error.message);
    } finally {
      setDisableButton(false);
    }
  };

  return (
    <div>
      <ContainerDemo>
        <div className={"items-content"}>
          <h3 className={"titleDemo"}>AntiFraud Auth</h3>
          <InputConfigurationDemo
            disableInputPrev={false}
            setInputOption={setMerchantId}
            valueInput={merchantId}
            label={"Merchant ID"}
          />
          <CurrencyConfigurationDemo
            disableInputPrev={false}
            inputCurrency={inputCurrency}
            setInputCurrency={setInputCurrency}
          />
          <CardNumberHelper
            displayHostedFields={true}
            cardNumberHelper={"3bf0e1c3d732415ea0ba15cb4f47f23c"}
          />
          <InputConfigurationDemo
            disableInputPrev={false}
            setInputOption={setCardNumber}
            valueInput={cardNumber}
            label={"Numero de tarjeta"}
          />
          <InputConfigurationDemo
            disableInputPrev={disableField}
            setInputOption={setCardHolder}
            valueInput={cardHolder}
            label={"Nombre de tarjetahabiente"}
          />
          <InputConfigurationDemo
            disableInputPrev={disableField}
            setInputOption={setExpirationDate}
            valueInput={expirationDate}
            label={"Fecha de expiración"}
            mask={"99/99"}
          />
          <InputConfigurationDemo
            disableInputPrev={disableField}
            setInputOption={setSecurityCode}
            valueInput={securityCode}
            label={"CVV"}
            mask={"9999"}
          />
          <InputConfigurationDemo
            disableInputPrev={disableField}
            setInputOption={setInputAmount}
            valueInput={inputAmount}
            label={"Monto"}
            mask={"9999999"}
          />
          <button
            className={
              "mui-btn mui-btn--primary mui-btn--small button-border action-button"
            }
            disabled={disableButton}
            onClick={onRequestSecureInit}
          >
            Request Secure Init
          </button>
          <button
            className={
              "mui-btn mui-btn--primary mui-btn--small button-border action-button"
            }
            disabled={disableButton}
            onClick={onTokenRequest}
          >
            Request Token
          </button>
          <button
            className={
              "mui-btn mui-btn--primary mui-btn--small button-border action-button"
            }
            disabled={disableButton}
            onClick={on3DSValidation}
          >
            Request 3DS Valdiation
          </button>
        </div>
        {response && <ResponseBox response={response} />}
      </ContainerDemo>
    </div>
  );
};
