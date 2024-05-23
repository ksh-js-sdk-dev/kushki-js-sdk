import { Currency } from "Kushki/Card";
import { useEffect, useState } from "react";
import { OptionsCvv } from "../../shared/enums/OptionsCvv.ts";
import CvvOptionsDemo from "./Components/CvvOptionsDemo.tsx";
import {
  IConfigurationDemoProps,
  IDefaultInformation
} from "./ConfigurationDemo.interface.ts";
import { OptionDefaultData } from "../../shared/enums/OptionDefaultData.ts";
import ButtonsDefaultInfo from "./Components/ButtonsDefaultInfo.tsx";
import InputConfigurationDemo from "./Components/InputConfigurationDemo.tsx";
import CurrencyConfigurationDemo from "./Components/CurrencyConfigurationDemo.tsx";

const ConfigurationDemo = ({
  initKushkiInstance,
  listButtonsActive,
  setListButtonsActive
}: IConfigurationDemoProps) => {
  const [isActiveConfigBtn, setIsActiveConfigBtn] = useState<boolean>(false);
  const [disableInputPrev, setDisableInputPrev] = useState<boolean>(false);
  const [inputMerchantId, setInputMerchantId] = useState<string>("");
  const [inputCurrency, setInputCurrency] = useState<Currency | string>();
  const [inputAmount, setInputAmount] = useState<string>("");
  const [inputIsSubscription, setInputIsSubscription] =
    useState<boolean>(false);
  const [inputIsFullResponse, setInputIsFullResponse] =
    useState<boolean>(false);
  const [inputCvvOption, setInputCvvOption] = useState<OptionsCvv>(
    OptionsCvv.REQUIRED
  );

  const resetInformation = (): void => {
    setInputMerchantId("");
    setInputAmount("");
    setInputCurrency("");
    setInputIsSubscription(false);
    setInputIsFullResponse(false);
  };

  const setInputsAndOptionsHostedField = (
    publicMerchantId: string,
    currency: string,
    amount: number
  ) => {
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
    setListButtonsActive((prevState) => ({
      approved: false,
      declined: false,
      otp: false,
      threeDomainSecure: false,
      [option]: !prevState[option]
    }));

    buildDefaultInformation(option as OptionDefaultData);
  };

  const callInitHostedFields = async () => {
    await initKushkiInstance(
      inputMerchantId,
      +inputAmount,
      inputCurrency!,
      inputIsSubscription,
      inputIsFullResponse,
      inputCvvOption
    );
    setIsActiveConfigBtn(false);
  };

  useEffect(() => {
    const statusOptionButtons: boolean =
      listButtonsActive.otp ||
      listButtonsActive.declined ||
      listButtonsActive.approved ||
      listButtonsActive.threeDomainSecure;

    setIsActiveConfigBtn(statusOptionButtons);

    if (statusOptionButtons) setDisableInputPrev(true);
    else {
      resetInformation();
      setDisableInputPrev(false);
    }
  }, [listButtonsActive]);

  useEffect(() => {
    if (
      inputMerchantId.length != 0 &&
      inputCurrency?.length != 0 &&
      inputAmount.length != 0
    )
      setIsActiveConfigBtn(true);
  }, [inputMerchantId, inputCurrency, inputAmount]);

  return (
    <>
      <div className={"content-title"}>
        <h1 className={"title-demo"}>Kushki JS SDK - Demo</h1>
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
          buttonActive={listButtonsActive}
          setDefaultOptions={setDefaultOptions}
          label={"3DS"}
          option={OptionDefaultData.THREE_DOMAIN_SECURE}
        />
        <ButtonsDefaultInfo
          buttonActive={listButtonsActive}
          setDefaultOptions={setDefaultOptions}
          label={"OTP"}
          option={OptionDefaultData.OTP}
        />
        <ButtonsDefaultInfo
          buttonActive={listButtonsActive}
          setDefaultOptions={setDefaultOptions}
          label={"Trx. aprobada"}
          option={OptionDefaultData.TRX_APPROVED}
        />
        <ButtonsDefaultInfo
          buttonActive={listButtonsActive}
          setDefaultOptions={setDefaultOptions}
          label={"Trx. declinada"}
          option={OptionDefaultData.TRX_DECLINED}
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
        <div className="mui-checkbox div-container">
          <label className="label-container">
            <input
              className={"input-check"}
              type="checkbox"
              checked={inputIsSubscription}
              onChange={() => setInputIsSubscription(!inputIsSubscription)}
            />
            <span className="checkmark"></span>
            Crear suscripción
          </label>
        </div>
        {inputIsSubscription && (
          <>
            <div className="mui-checkbox div-container">
              <label className="label-container">
                <input
                  className={"input-check"}
                  type="checkbox"
                  checked={inputIsFullResponse}
                  onChange={() => setInputIsFullResponse(!inputIsFullResponse)}
                />
                <span className="checkmark"></span>
                Full Response
              </label>
            </div>
            <CvvOptionsDemo
              inputOption={inputCvvOption}
              setInputOption={setInputCvvOption}
            />
          </>
        )}
        <button
          className={"mui-btn mui-btn--primary mui-btn--small button-border"}
          data-testid="tokenRequestBtn"
          disabled={!isActiveConfigBtn}
          onClick={callInitHostedFields}
        >
          Configurar
        </button>
      </div>
    </>
  );
};

export default ConfigurationDemo;
