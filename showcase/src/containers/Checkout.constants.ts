import { CardOptions } from "../../../src/module";
import { Styles } from "../../../types/card_options";

export const hostedFieldsStyles: Styles = {
  container: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    "&:focus-within": {
      // TODO defined remove
      //   "& label": {
      //     background: "white",
      //     color: "#6D7781",
      //     // color: "blue",
      //     // fontFamily: "IBM Plex sans-serif",
      //     fontFamily: "Arial,Verdana,Tahoma",
      //     fontSize: "10px",
      //     fontWeight: "400",
      //     left: "6px",
      //     paddingLeft: "5px",
      //     paddingRight: "5px",
      //     position: "absolute",
      //     top: "-3px",
      //     width: "auto",
      //     // transform: "translateY(-7px)",
      //     // transition: "all 0.2s ease-in"
      //   }
    },
    "& input:not(:placeholder-shown) + label": {
      background: "white",
      color: "#6D7781",
      fontFamily: "Arial,Verdana,Tahoma",
      fontSize: "8px",
      fontWeight: "400",
      left: "16px",
      paddingLeft: "5px",
      paddingRight: "5px",
      position: "absolute",
      top: "-3px",
      width: "auto"
    }
  },
  input: {
    border: "1px solid rgba(203, 213, 224, 1)",
    borderRadius: "10px",
    fontFamily: "Arial,Verdana,Tahoma",
    fontSize: "14px",
    fontWeight: "400",
    outline: "none",
    paddingLeft: "8px",
    boxSizing: "border-box",
    width: "300px",
    height: "40px",
    "&::placeholder": {
      fontFamily: "Arial,Verdana,Tahoma",
      fontSize: "14px",
      color: "rgba(0,0,0,.26)"
    },
    "&:focus": {
      border: "1px solid #0077ff",
      borderRadius: "10px",
      fontFamily: "Arial,Verdana,Tahoma",
      fontSize: "14px",
      fontWeight: "400",
      outline: "none",
      paddingLeft: "8px",
      width: "300px",
      height: "40px"
    },
    "&:focus::placeholder": {
      color: "transparent"
    },
    "&:invalid": {
      border: "1px solid #B60000",
      borderRadius: "10px",
      fontFamily: "Arial,Verdana,Tahoma",
      fontSize: "14px",
      fontWeight: "400",
      outline: "none",
      paddingLeft: "8px",
      height: "40px",
      width: "300px"
    }
  },
  label: ".kushki-hosted-field-label",
  deferred: {
    fontSize: "12px",
    "&#ksh-deferred-checkbox>label": {
      width: "max-content",
      fontSize: "15px"
    },
    "&#ksh-deferred-creditType":{
      width: "240px"
    },
    "&#ksh-deferred-months":{
      width: "110px"
    },
    "&#ksh-deferred-graceMonths":{
      width: "125px"
    },
  }
};

export const optionsDefault: CardOptions = {
  amount: {
    iva: 26,
    subtotalIva: 0,
    subtotalIva0: 0
  },
  isSubscription: false,
  currency: "USD",
  fields: {
    cardholderName: {
      inputType: "text",
      label: "Payment holder name",
      placeholder: "Payment holder name",
      selector: "cardHolderName_id"
    },
    cardNumber: {
      inputType: "number",
      label: "Número de tarjeta",
      placeholder: "Número de tarjeta",
      selector: "cardNumber_id"
    },
    cvv: {
      inputType: "password",
      label: "CVV",
      placeholder: "CVV",
      selector: "cvv_id"
    },
    deferred: {
      deferredInputs: {
        deferredCheckbox: {
          label: "Quiero pagar en cuotas"
        },
        deferredType: {
          label: "Tipos de diferido",
          placeholder: "Tipos de diferido",
          hiddenLabel: "deferred Type"
        },
        months: {
          label: "Meses",
          placeholder: "Meses",
          hiddenLabel: "Meses"
        },
        graceMonths: {
          label: "Meses de gracia",
          placeholder: "Meses de gracia",
          hiddenLabel: "Meses de gracia"
        }
      },
      selector: "deferred_id"
    },
    expirationDate: {
      inputType: "text",
      label: "Fecha de vencimiento",
      placeholder: "Fecha de vencimiento",
      selector: "expirationDate_id"
    },
    otp: {
      inputType: "password",
      label: "OTP",
      placeholder: "OTP",
      selector: "otp_id"
    }
  },
  styles: hostedFieldsStyles
};