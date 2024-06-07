import { requestInitCardBrandingAnimation } from "Kushki/CardAnimation";
import OptionsDynamicConfig from "../../../components/ConfigurationDemo/Components/OptionsDynamicConfig.tsx";
import RadioDynamicConfig from "../../../components/ConfigurationDemo/Components/RadioDynamicConfig.tsx";
import { ContainerDemo } from "../../../components/ContainerDemo/ContainerDemo.tsx";
import { useState } from "react";
import { ResponseBox } from "../../../components/ResponseBox/ResponseBox.tsx";

export const RequestBrandingAnimation = () => {
  const [disableMcButton, setDisableMcButton] = useState<boolean>(false);
  const [disableVisaButton, setDisableVisaButton] = useState<boolean>(false);
  const [mcType, setMcType] = useState<string>("");
  const [mcBackground, setMcBackground] = useState<string>("");
  const [mcCue, setMcCue] = useState<string>("");
  const [visaColor, setVisaColor] = useState<string>("");
  const [visaCheckmark, setVisaCheckmark] = useState<string>("");
  const [visaCheckmarkText, setVisaCheckmarkText] =
    useState<string>("approved");
  const [visaLanguage, setVisaLanguage] = useState<string>("");
  const [visaIsConstrained, setVisaIsConstrained] = useState<boolean>(true);
  const [visaIsSound, setVisaIsSound] = useState<boolean>(false);
  const [mcError, setMcError] = useState<string>("");
  const [visaError, setVisaError] = useState<string>("");

  const onRequestMcBrandAnimation = async () => {
    setDisableMcButton(true);
    setMcError("");

    try {
      await requestInitCardBrandingAnimation({
        background: mcBackground,
        brand: "mastercard",
        sonicCue: mcCue,
        type: mcType
      });
    } catch (error: any) {
      setMcError(error.message);
    } finally {
      setDisableMcButton(false);
    }
  };

  const onRequestVisaBrandAnimation = async () => {
    setDisableVisaButton(true);
    setVisaError("");

    try {
      await requestInitCardBrandingAnimation({
        brand: "visa",
        checkmark: visaCheckmark,
        checkmarkTextOption: visaCheckmarkText,
        color: visaColor,
        constrained: visaIsConstrained,
        languageCode: visaLanguage,
        sound: visaIsSound
      });
    } catch (error: any) {
      setVisaError(error.message);
    } finally {
      setDisableVisaButton(false);
    }
  };

  return (
    <ContainerDemo>
      <h3 className={"title-demo"}>Request Brand Animation</h3>
      <div className="mui-container-fluid">
        <h3>MasterCard</h3>
        <div className="mui-row">
          <div className="mui-col-md-6">
            <OptionsDynamicConfig
              label={"Tipo:"}
              defaultOption={mcType}
              setInputOption={setMcType}
              optionList={["default", "animation-only", "sound-only"]}
            />
          </div>
          <div className="mui-col-md-6">
            <OptionsDynamicConfig
              label={"Background:"}
              defaultOption={mcBackground}
              setInputOption={setMcBackground}
              optionList={["black", "white"]}
            />
          </div>
          <div className="mui-col-md-12">
            <RadioDynamicConfig
              label={"SonicCue:"}
              setInputOption={setMcCue}
              optionList={["checkout", "securedby"]}
            />
          </div>
          <div className="mui-col-md-12 text-center">
            <button
              className={"mui-btn mui-btn--primary demo-button-xs"}
              disabled={disableMcButton}
              onClick={onRequestMcBrandAnimation}
            >
              MasterCard Animación
            </button>
          </div>
        </div>
      </div>
      <div className={"animation-container"}>
        {disableMcButton && <div id="mastercard-sensory-branding" />}
        {mcError && <ResponseBox response={mcError} />}
      </div>
      <div className="mui-container-fluid">
        <h3>Visa</h3>
        <div className="mui-row">
          <div className="mui-col-md-6">
            <OptionsDynamicConfig
              label={"Color:"}
              defaultOption={visaColor}
              setInputOption={setVisaColor}
              optionList={["white", "blue", "blur", "transparent"]}
            />
          </div>
          <div className="mui-col-md-6">
            <OptionsDynamicConfig
              label={"Checkmark:"}
              defaultOption={visaCheckmark}
              setInputOption={setVisaCheckmark}
              optionList={["none", "checkmark", "checkmarkWithText"]}
            />
          </div>
          <div className="mui-col-md-6">
            <OptionsDynamicConfig
              label={"CheckmarkTextOption:"}
              defaultOption={visaCheckmarkText}
              setInputOption={setVisaCheckmarkText}
              optionList={["approved", "success", "complete"]}
            />
          </div>
          <div className="mui-col-md-6">
            <OptionsDynamicConfig
              label={"Language:"}
              defaultOption={visaLanguage}
              setInputOption={setVisaLanguage}
              optionList={["es", "en", "pt_br"]}
            />
          </div>
          <div className="mui-col-md-6">
            <div className="mui-checkbox">
              <label className="label-container check-dynamic-label">
                <input
                  className={"input-check"}
                  type="checkbox"
                  checked={visaIsConstrained}
                  onChange={() => setVisaIsConstrained(!visaIsConstrained)}
                />
                <span className="checkmark check-dynamic"></span>
                Constrained
              </label>
            </div>
          </div>
          <div className="mui-col-md-6">
            <div className="mui-checkbox">
              <label className="label-container check-dynamic-label">
                <input
                  className={"input-check"}
                  type="checkbox"
                  checked={visaIsSound}
                  onChange={() => setVisaIsSound(!visaIsSound)}
                />
                <span className="checkmark check-dynamic"></span>
                Sound
              </label>
            </div>
          </div>
          <div className="mui-col-md-12 text-center">
            <button
              className={"mui-btn mui-btn--primary demo-button-xs"}
              disabled={disableVisaButton}
              onClick={onRequestVisaBrandAnimation}
            >
              Visa Animación
            </button>
          </div>
        </div>
      </div>
      <div className={"animation-container"}>
        {disableVisaButton && <div id="visa-sensory-branding" />}
        {visaError && <ResponseBox response={visaError} />}
      </div>
    </ContainerDemo>
  );
};
