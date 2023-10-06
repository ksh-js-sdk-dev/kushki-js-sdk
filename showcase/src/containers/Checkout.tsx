import { Kushki } from "Kushki";
import {
  CardOptions,
  Currency,
  Fields,
  FieldValidity,
  FormValidity,
  Payment,
  TokenResponse
} from "../../../src/module";
import { useEffect, useState } from "react";
import { DeferredValuesResponse } from "../../../types/token_response";
import "../../assets/css/checkout.css";
import "./Checkout.css";
import { KushkiError } from "../../../src/infrastructure/KushkiError.ts";
import ConfigurationDemo from "../components/ConfigurationDemo/ConfigurationDemo.tsx";
import ResultsPayment from "../components/ConfigurationDemo/Components/ResultsPayment.tsx";
import HostedFields from "../components/HostedFields/HostedFields.tsx";
import { IDefaultInformation } from "../components/ConfigurationDemo/ConfigurationDemo.interface.ts";
import { optionsDefault } from "./Checkout.constants.ts";

export const CheckoutContainer = () => {
  const [token, setToken] = useState<string>("");
  const [deferredValues, setDeferredValues] = useState<
    DeferredValuesResponse | undefined
  >({});
  const [cardInstance, setCardinstance] = useState<Payment>();
  const [fieldsValidityDemo, setFieldsValidityDemo] = useState<Fields>({
    cardholderName: { isValid: false },
    cardNumber: { isValid: false },
    cvv: { isValid: false },
    deferred: { isValid: false },
    expirationDate: { isValid: false }
  });
  const [showOTP, setShowOTP] = useState<boolean>(false);
  const [errorOTP, setErrorOTP] = useState<string>("");
  const [currencyOptions, setCurrencyOptions] = useState<Currency | undefined>(
    undefined
  );
  const [amountOptions, setAmountOptions] = useState<number>(0);
  const [isSubscriptionOption, setIsSubscriptionOption] =
    useState<boolean>(false);
  const [publicMerchantIdDemo, setPublicMerchantIdDemo] = useState<string>("");
  const [displayHostedFields, setDisplayHostedFields] =
    useState<boolean>(false);
  const [buttonActive, setButtonActive] = useState<IDefaultInformation>({
    approved: false,
    declined: false,
    otp: false,
    threeDomainSecure: false
  });
  const [disablePaymentButton, setDisablePaymentButton] =
    useState<boolean>(false);

  const [errorHostedFields, setErrorHostedFields] = useState<boolean>(true);

  const options: CardOptions = {
    ...optionsDefault,
    amount: {
      ...optionsDefault.amount!,
      subtotalIva0: amountOptions
    },
    isSubscription: isSubscriptionOption,
    currency: currencyOptions!
  };

  const initKushkiInstance = async (): Promise<void> => {
    try {
      const kushkiInstance = await Kushki.init({
        inTest: true,
        publicCredentialId: publicMerchantIdDemo
      });

      if (kushkiInstance) {
        setCardinstance(await Payment.initCardToken(kushkiInstance, options));
      }
      // TODO validate remove ts lint warnings
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
    } catch (e: KushkiError) {
      console.log(e.message);
    }
  };

  const getToken = async () => {
    if (cardInstance) {
      try {
        setDisablePaymentButton(true);
        const token: TokenResponse = await cardInstance.requestToken();
        setToken(token.token);
        setDeferredValues(token.deferred);
      } catch (error: any) {
        setToken(error.message);
        setDisablePaymentButton(false);
      }
    }
  };

  useEffect(() => {
    if (cardInstance) {
      setDisplayHostedFields(true);
      cardInstance.onFieldValidity((event: FormValidity | FieldValidity) => {
        if ("fields" in event) setFieldsValidityDemo(event.fields);
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
        }
      );
    }
  }, [cardInstance]);

  useEffect(() => {
    const errorForm: boolean = Object.keys(fieldsValidityDemo).some(
      (fieldName) => !fieldsValidityDemo[fieldName as keyof Fields]?.isValid
    );

    if (errorForm) {
      setErrorHostedFields(true);
      return;
    }

    setErrorHostedFields(false);
  }, [fieldsValidityDemo]);

  return (
    <>
      <div className={"boxPrincipal"}>
        <ConfigurationDemo
          setAmountOptions={setAmountOptions}
          setCurrencyOptions={setCurrencyOptions}
          setPublicMerchantIdDemo={setPublicMerchantIdDemo}
          setIsSubscriptionOption={setIsSubscriptionOption}
          isSubscriptionOption={isSubscriptionOption}
          initKushkiInstance={initKushkiInstance}
          buttonActive={buttonActive}
          setButtonActive={setButtonActive}
        />
      </div>
      <HostedFields
        showOTP={showOTP}
        fieldsValidityDemo={fieldsValidityDemo}
        errorOTP={errorOTP}
        displayHostedFields={displayHostedFields}
        buttonActive={buttonActive}
      />

      {displayHostedFields && (
        <>
          <ResultsPayment
            disablePaymentButton={disablePaymentButton}
            errorHostedFields={errorHostedFields}
            deferredValues={deferredValues}
            token={token}
            getToken={getToken}
          />
          {/*<TableFormEvents cardInstance={cardInstance} />*/}
        </>
      )}
    </>
  );
};
