import { ContainerDemo } from "../../../components/ContainerDemo/ContainerDemo.tsx";
import InputConfigurationDemo from "../../../components/ConfigurationDemo/Components/InputConfigurationDemo.tsx";
import CardNumberHelper from "../../../components/CardNumberHelper/CardNumberHelper.tsx";
import { ResponseBox } from "../../../components/ResponseBox/ResponseBox.tsx";
import { useEffect, useState } from "react";
import { IKushki, init } from "Kushki";
import {
  requestDeviceToken,
  DeviceTokenRequest,
  Currency,
  TokenResponse
} from "Kushki/Card";
import CurrencyConfigurationDemo from "../../../components/ConfigurationDemo/Components/CurrencyConfigurationDemo.tsx";

export const RequestDeviceToken = () => {
  const [merchantId, setMerchantId] = useState<string>("");
  const [subscriptionId, setSubscriptionId] = useState<string>("");
  const [inputCurrency, setInputCurrency] = useState<Currency | string>();
  const [subtotalIva, setSubtotalIva] = useState<string>("");
  const [subtotalIva0, setSubtotalIva0] = useState<string>("");
  const [iva, setIva] = useState<string>("");
  const [disableButton, setDisableButton] = useState<boolean>(false);
  const [response, setResponse] = useState<string>("");

  const buildRequestBody = (): DeviceTokenRequest => {
    let body: DeviceTokenRequest = {
      subscriptionId
    };
    if (inputCurrency) body.currency = inputCurrency as Currency;
    if (subtotalIva || subtotalIva0 || iva)
      body.amount = {
        subtotalIva: subtotalIva ? +subtotalIva : 0,
        subtotalIva0: subtotalIva0 ? +subtotalIva0 : 0,
        iva: iva ? +iva : 0
      };

    return body;
  };

  const onRequestDeviceToken = async () => {
    setDisableButton(true);
    setResponse("");

    try {
      const kushkiInstance: IKushki = await init({
        inTest: true,
        publicCredentialId: merchantId
      });

      const response: TokenResponse = await requestDeviceToken(
        kushkiInstance,
        buildRequestBody()
      );

      setResponse(response.token);
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
        <div className={"mui--divider-top div-container"}>
          <div className="mui--text-body1">{"Datos Opcionales:"} </div>
          <CurrencyConfigurationDemo
            disableInputPrev={false}
            inputCurrency={inputCurrency}
            setInputCurrency={setInputCurrency}
          />
          <InputConfigurationDemo
            disableInputPrev={false}
            setInputOption={setSubtotalIva}
            valueInput={subtotalIva}
            label={"Subtotal IVA"}
            mask={"9999999"}
          />
          <InputConfigurationDemo
            disableInputPrev={false}
            setInputOption={setSubtotalIva0}
            valueInput={subtotalIva0}
            label={"Subtotal IVA 0"}
            mask={"9999999"}
          />
          <InputConfigurationDemo
            disableInputPrev={false}
            setInputOption={setIva}
            valueInput={iva}
            label={"IVA"}
            mask={"9999999"}
          />
        </div>
        <button
          className={
            "mui-btn mui-btn--primary mui-btn--small button-border action-button"
          }
          disabled={disableButton}
          onClick={onRequestDeviceToken}
        >
          requestDeviceToken
        </button>
      </div>

      {response && <ResponseBox response={response} />}
    </ContainerDemo>
  );
};
