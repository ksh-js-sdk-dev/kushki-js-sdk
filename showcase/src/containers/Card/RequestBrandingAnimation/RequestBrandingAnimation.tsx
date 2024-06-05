import { requestInitCardBrandingAnimation } from "Kushki/CardAnimation";
import { ContainerDemo } from "../../../components/ContainerDemo/ContainerDemo.tsx";
import { useState } from "react";

export const RequestBrandingAnimation = () => {
  const [disableButton, setDisableButton] = useState<boolean>(false);

  const onRequestBrandAnimation = async () => {
    setDisableButton(true);

    try {
      await requestInitCardBrandingAnimation({
        brand: "mastercard"
      });
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setDisableButton(false);
    }
  };

  return (
    <ContainerDemo>
      <h3 className={"title-demo"}>Request Brand Animation</h3>
      <button
        className={
          "mui-btn mui-btn--primary mui-btn--small button-border action-button"
        }
        disabled={disableButton}
        onClick={onRequestBrandAnimation}
      >
        requestCommissionConfiguration
      </button>
      {disableButton && <div id="mastercard-sensory-branding" />}
      {disableButton && <div id="visa-sensory-branding" />}
    </ContainerDemo>
  );
};
