import { IKushki, init } from "Kushki";
import {
  CardOptions,
  Currency,
  Fields,
  FieldValidity,
  FormValidity,
  ICard,
  initCardToken,
  TokenResponse,
  InputModelEnum
} from "Kushki/Card";
import { useEffect, useState } from "react";
import "../../../../assets/css/checkout.css";
import "./Checkout.css";
import ConfigurationDemo from "../../../components/ConfigurationDemo/ConfigurationDemo.tsx";
import ResultsPayment from "../../../components/ConfigurationDemo/Components/ResultsPayment.tsx";
import HostedFields from "../../../components/HostedFields/HostedFields.tsx";
import { IDefaultInformation } from "../../../components/ConfigurationDemo/ConfigurationDemo.interface.ts";
import { optionsDefault } from "./Checkout.constants.ts";
import { ContainerDemo } from "../../../components/ContainerDemo/ContainerDemo.tsx";

const initialFieldsValidity: Fields = {
  cardholderName: { isValid: false },
  cardNumber: { isValid: false },
  cvv: { isValid: false },
  deferred: { isValid: false },
  expirationDate: { isValid: false }
};

export const CheckoutContainer = () => {
  const [token, setToken] = useState<TokenResponse>();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [cardInstance, setCardInstance] = useState<ICard>();
  const [fieldsValidityDemo, setFieldsValidityDemo] = useState<Fields>(
    initialFieldsValidity
  );
  const [showOTP, setShowOTP] = useState<boolean>(false);
  const [errorOTP, setErrorOTP] = useState<string>("");
  const [displayHostedFields, setDisplayHostedFields] =
    useState<boolean>(false);
  const [listButtonsActive, setListButtonsActive] =
    useState<IDefaultInformation>({
      approved: false,
      declined: false,
      otp: false,
      threeDomainSecure: false
    });
  const [disablePaymentButton, setDisablePaymentButton] =
    useState<boolean>(false);

  const buildFieldsOptions = (
    amountValue: number,
    currencyValue: string,
    isSubscription: boolean,
    isFullResponse: boolean
  ): CardOptions => {
    return {
      ...optionsDefault,
      amount: {
        ...optionsDefault.amount!,
        subtotalIva0: amountValue
      },
      currency: currencyValue as Currency,
      fullResponse: isFullResponse,
      isSubscription: isSubscription
    };
  };

  const initKushkiInstance = async (
    publicMerchantIdDemo: string,
    amountValue: number,
    currencyValue: string,
    isSubscription: boolean,
    isFullResponse: boolean
  ): Promise<void> => {
    setDisplayHostedFields(true);

    try {
      const kushkiInstance: IKushki = await init({
        inTest: true,
        publicCredentialId: publicMerchantIdDemo
      });
      const options: CardOptions = buildFieldsOptions(
        amountValue,
        currencyValue,
        isSubscription,
        isFullResponse
      );

      setCardInstance(await initCardToken(kushkiInstance, options));
    } catch (e: any) {
      setErrorMessage(e.message);
    }
  };

  const getToken = async () => {
    if (cardInstance) {
      try {
        setToken(undefined);
        setErrorMessage("");
        setDisablePaymentButton(true);
        const token: TokenResponse = await cardInstance.requestToken();

        setToken(token);
      } catch (error: any) {
        setErrorMessage(error.message);
      } finally {
        setDisablePaymentButton(false);
      }
    }
  };

  useEffect(() => {
    setDisplayHostedFields(false);
    setFieldsValidityDemo(initialFieldsValidity);
    setToken(undefined);
    setErrorMessage("");
  }, [listButtonsActive]);

  useEffect(() => {
    if (cardInstance) {
      cardInstance.onFieldValidity((event: FormValidity | FieldValidity) => {
        if ("fields" in event && typeof event.triggeredBy !== 'undefined')
          setFieldsValidityDemo(event.fields);
      });

      cardInstance.onOTPValidation(
        () => {
          setShowOTP(true);
        },
        (error) => {
          setErrorOTP(error.message);
        },
        () => {
          setErrorOTP("");
          setShowOTP(false);
        }
      );
    }
  }, [cardInstance]);

  useEffect(() => {
    const errorForm: boolean = Object.keys(fieldsValidityDemo)
      .filter((fieldName) => fieldName !== InputModelEnum.DEFERRED)
      .some(
        (fieldName) => !fieldsValidityDemo[fieldName as keyof Fields]?.isValid
      );

    if (errorForm) setDisablePaymentButton(true);
    else setDisablePaymentButton(false);
  }, [fieldsValidityDemo]);

  return (
    <ContainerDemo>
      <ConfigurationDemo
        initKushkiInstance={initKushkiInstance}
        listButtonsActive={listButtonsActive}
        setListButtonsActive={setListButtonsActive}
      />
      {displayHostedFields && (
        <HostedFields
          showOTP={showOTP}
          errorOTP={errorOTP}
          fieldsValidityDemo={fieldsValidityDemo}
          listButtonsActive={listButtonsActive}
          disablePaymentButton={disablePaymentButton}
          getToken={getToken}
        />
      )}
      <ResultsPayment token={token} errorMessage={errorMessage} />
    </ContainerDemo>
  );
};
