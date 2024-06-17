import { ContainerDemo } from "../../../components/ContainerDemo/ContainerDemo.tsx";
import InputConfigurationDemo from "../../../components/ConfigurationDemo/Components/InputConfigurationDemo.tsx";
import { useState } from "react";
import CardNumberHelper from "../../../components/CardNumberHelper/CardNumberHelper.tsx";
import { IKushki, init } from "Kushki";
import { ResponseBox } from "../../../components/ResponseBox/ResponseBox.tsx";
import "./Validation3DS.css";
import {
  requestSecureInit,
  requestValidate3DS,
  SecureInitRequest,
  SecureInitResponse
} from "Kushki/AntiFraud";
import axios from "axios";
import { CardTokenResponse, Currency, TokenResponse } from "Kushki/Card";
import CurrencyConfigurationDemo from "../../../components/ConfigurationDemo/Components/CurrencyConfigurationDemo.tsx";
import { PathEnum } from "../../../../../src/infrastructure/PathEnum.ts";

export const Validation3DS = () => {
  const [merchantId, setMerchantId] = useState<string>("");
  const [inputCurrency, setInputCurrency] = useState<
    Currency | string | undefined
  >("COP");
  const [cardNumber, setCardNumber] = useState<string>("");
  const [cardHolder, setCardHolder] = useState<string>("");
  const [expirationDate, setExpirationDate] = useState<string>("");
  const [securityCode, setSecurityCode] = useState<string>("");
  const [inputAmount, setInputAmount] = useState<string>("");
  const [disableButton, setDisableButton] = useState<boolean>(false);
  const [disableField, setDisableField] = useState<boolean>(true);
  const [response, setResponse] = useState<string>("");
  const [secureInitJwt, setSecureInitJwt] = useState<SecureInitResponse>({
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

  function initFormFields() {
    setDisableButton(true);
    setResponse("");
  }

  const onRequestSecureInit = async () => {
    initFormFields();

    try {
      const kushkiInstance: IKushki = await init({
        inTest: true,
        publicCredentialId: merchantId
      });
      const secureInitRequest: SecureInitRequest = {
        card: {
          number: cardNumber
        }
      };

      const secureInitResponse: SecureInitResponse = await requestSecureInit(
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

  const onRequestToken = async () => {
    initFormFields();
    const dateParts = expirationDate.split("/");

    const month = dateParts[0];
    const year = dateParts[1];

    try {
      const kushkiInstance: IKushki = await init({
        inTest: true,
        publicCredentialId: merchantId
      });

      console.log(kushkiInstance);

      const options = {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Public-Merchant-Id": kushkiInstance.getPublicCredentialId()
        }
      };

      const { data } = await axios.post(
        `${kushkiInstance.getBaseUrl()}${PathEnum.card_token}`,
        {
          card: {
            cvv: securityCode,
            expiryMonth: month,
            expiryYear: year,
            name: cardHolder,
            number: cardNumber
          },
          currency: inputCurrency,
          jwt: secureInitJwt.jwt,
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

  const onHandle3DSValidation = async () => {
    initFormFields();
    let threeDSisValid: boolean = false;

    try {
      const kushkiInstance = await init({
        inTest: true,
        publicCredentialId: merchantId
      });

      const response: TokenResponse = await requestValidate3DS(
        kushkiInstance,
        cardTokenResponse
      );

      if (response.token) threeDSisValid = true;

      setResponse(
        JSON.stringify({
          isValid: threeDSisValid
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
          <h3 className={"title-demo"}>AntiFraud Auth</h3>
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
            disableInputPrev={false}
            inputCurrency={inputCurrency}
            setInputCurrency={setInputCurrency}
          />
          <InputConfigurationDemo
            disableInputPrev={false}
            setInputOption={setCardNumber}
            valueInput={cardNumber}
            label={"Número de tarjeta"}
          />
          <InputConfigurationDemo
            disableInputPrev={disableField}
            setInputOption={setCardHolder}
            valueInput={cardHolder}
            label={"Nombre de Tarjetahabiente"}
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
            disabled={disableButton || disableField}
            onClick={onRequestToken}
          >
            Request Token
          </button>
          <button
            className={
              "mui-btn mui-btn--primary mui-btn--small button-border action-button"
            }
            disabled={disableButton || disableField}
            onClick={onHandle3DSValidation}
          >
            Request 3DS Validation
          </button>
        </div>
        {response && <ResponseBox response={response} />}
      </ContainerDemo>
    </div>
  );
};
