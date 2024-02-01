import { Currency } from "../../../../types/card_options";
import { useEffect, useState } from "react";
import {
  IConfigurationDemoProps,
  IDefaultInformation
} from "./ConfigurationDemo.interface.ts";
import { OptionDefaultData } from "../../shared/enums/OptionDefaultData.ts";
import ButtonsDefaultInfo from "./Components/ButtonsDefaultInfo.tsx";
import InputConfigurationDemo from "./Components/InputConfigurationDemo.tsx";
import CurrencyConfigurationDemo from "./Components/CurrencyConfigurationDemo.tsx";

const ConfigurationDemo = ({
  setPublicMerchantIdDemo,
  setCurrencyOptions,
  setAmountOptions,
  setIsSubscriptionOption,
  isSubscriptionOption,
  initKushkiInstance,
  buttonActive,
  setButtonActive
}: IConfigurationDemoProps) => {
  const [activeConfigurationBtn, setActiveConfigurationBtn] =
    useState<boolean>(false);
  const [disableInputPrev, setDisableInputPrev] = useState<boolean>(false);
  const [inputMerchantId, setInputMerchantId] = useState<string>("");
  const [inputCurrency, setInputCurrency] = useState<Currency | string>();
  const [inputAmount, setInputAmount] = useState<string>("");
  const [disableButtons, setDisabledButtons] = useState<boolean>(false);
  const resetInformation = (): void => {
    setInputMerchantId("");
    setInputAmount("");
    setInputCurrency("");
  };
  const setInputsAndOptionsHostedField = (
    publicMerchantId: string,
    currency: string,
    amount: number
  ) => {
    setPublicMerchantIdDemo(publicMerchantId);
    setCurrencyOptions(currency as Currency);
    setAmountOptions(amount);
    setInputMerchantId(publicMerchantId);
    setInputAmount(amount.toString());
    setInputCurrency(currency as Currency);
  };

  const buildDefaultInformation = (option: OptionDefaultData) => {
    const optionDefaultData: { [k: string]: () => void } = {
      [OptionDefaultData.OTP]: () => {
        setInputsAndOptionsHostedField(
          "7cad8d921dcb463eb92c43c049a849b0",
          "COP",
          600
        );
      },
      [OptionDefaultData.THREE_DOMAIN_SECURE]: () => {
        setInputsAndOptionsHostedField(
          "d6b3e17702e64d85b812c089e24a1ca1",
          "COP",
          1000
        );
      },
      [OptionDefaultData.TRX_APPROVED]: () => {
        setInputsAndOptionsHostedField(
          "40f9e34568fa40e39e15c5dddb607075",
          "USD",
          600
        );
      },
      [OptionDefaultData.TRX_DECLINED]: () => {
        setInputsAndOptionsHostedField(
          "40f9e34568fa40e39e15c5dddb607075",
          "USD",
          600
        );
      }
    };

    optionDefaultData[option]();
  };
  const setDefaultOptions = (option: keyof IDefaultInformation) => {
    setButtonActive((prevState) => ({
      approved: false,
      declined: false,
      otp: false,
      threeDomainSecure: false,
      [option]: !prevState[option]
    }));

    buildDefaultInformation(option as OptionDefaultData);
  };

  useEffect(() => {
    const statusOptionButtons: boolean =
      buttonActive.otp ||
      buttonActive.declined ||
      buttonActive.approved ||
      buttonActive.threeDomainSecure;

    setActiveConfigurationBtn(statusOptionButtons);

    if (!statusOptionButtons) {
      resetInformation();
      setDisableInputPrev(false);
    }
    if (statusOptionButtons) setDisableInputPrev(true);
  }, [buttonActive]);

  useEffect(() => {
    if (
      inputMerchantId.length != 0 &&
      inputCurrency?.length != 0 &&
      inputAmount.length != 0
    ) {
      setPublicMerchantIdDemo(inputMerchantId);
      setAmountOptions(Number(inputAmount));
      setCurrencyOptions(inputCurrency as Currency);
      setActiveConfigurationBtn(true);
    }
  }, [inputMerchantId, inputCurrency, inputAmount]);

  return (
    <>
      <div className={"content-title"}>
        <h1 className={"titleDemo"}>Kushki JS SDK - Demo</h1>
      </div>
      <div className="mui--text-body2 mui-text-custom">
        <a
          href={
            "https://ksh-js-sdk-dev.github.io/kushki-js-sdk/index.html#md:kushki-js-sdk"
          }
          target={"_blank"}
        >
          Link Docs
        </a>
      </div>
      <div className="mui--text-subhead mui-text-custom">
        Usar datos de prueba
      </div>
      <div className={"box-buttons"}>
        <ButtonsDefaultInfo
          buttonActive={buttonActive}
          setDefaultOptions={setDefaultOptions}
          label={"3DS"}
          option={OptionDefaultData.THREE_DOMAIN_SECURE}
          disableButtons={disableButtons}
        />
        <ButtonsDefaultInfo
          buttonActive={buttonActive}
          setDefaultOptions={setDefaultOptions}
          label={"OTP"}
          option={OptionDefaultData.OTP}
          disableButtons={disableButtons}
        />
        <ButtonsDefaultInfo
          buttonActive={buttonActive}
          setDefaultOptions={setDefaultOptions}
          label={"Trx. aprobada"}
          option={OptionDefaultData.TRX_APPROVED}
          disableButtons={disableButtons}
        />
        <ButtonsDefaultInfo
          buttonActive={buttonActive}
          setDefaultOptions={setDefaultOptions}
          label={"Trx. declinada"}
          option={OptionDefaultData.TRX_DECLINED}
          disableButtons={disableButtons}
        />
      </div>
      <div className="mui--text-subhead mui-text-custom">
        o completar el formulario
      </div>
      <div className={"box-input-prev"}>
        <InputConfigurationDemo
          disableInputPrev={disableInputPrev}
          setInputOption={setInputMerchantId}
          valueInput={inputMerchantId}
          label={"Merchant ID"}
        />
        <CurrencyConfigurationDemo
          disableInputPrev={disableInputPrev}
          inputCurrency={inputCurrency}
          setInputCurrency={setInputCurrency}
        />
        <InputConfigurationDemo
          disableInputPrev={disableInputPrev}
          setInputOption={setInputAmount}
          valueInput={inputAmount}
          label={"Monto"}
          mask={"9999999"}
        />
        <div className="mui-checkbox divContainer">
          <label className="label-container">
            <input
              className={"inputCheck"}
              type="checkbox"
              value=""
              disabled={disableButtons}
              defaultChecked={isSubscriptionOption}
              onClick={() => setIsSubscriptionOption(!isSubscriptionOption)}
            />
            <span className="checkmark"></span>
            Crear suscripción
          </label>
        </div>
        <button
          className={"mui-btn mui-btn--primary mui-btn--small button-border"}
          data-testid="tokenRequestBtn"
          disabled={!activeConfigurationBtn}
          onClick={() => {
            initKushkiInstance();
            setActiveConfigurationBtn(false);
            setDisabledButtons(true);
          }}
        >
          Configurar
        </button>
      </div>
    </>
  );
};

export default ConfigurationDemo;
