import { CardOptions } from "../../../src/module/Payments.index.ts";
import { Styles } from "../../../types/card_options";

export const hostedFieldsStyles: Styles = {
  container: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
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
    "& + label": {
      color: "transparent",
      fontFamily: "Arial,Verdana,Tahoma",
      fontSize: "12px",
      fontWeight: "400",
      left: "16px",
      paddingLeft: "5px",
      paddingRight: "5px",
      position: "absolute",
      top: "-3px",
      width: "auto"
    },
    "&:focus + label": {
      background: "white",
      color: "#6D7781",
      fontSize: "12px"
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
    },
    "&:invalid::placeholder": {
      color: "transparent"
    },
    "&:invalid + label": {
      background: "white",
      color: "#B60000",
      fontSize: "12px"
    },
    "&:not(:placeholder-shown):invalid + label": {
      background: "white",
      color: "#B60000",
      fontSize: "12px"
    },
    "&:not(:placeholder-shown) + label": {
      background: "white",
      color: "#6D7781",
      fontSize: "12px"
    }
  },
  label: ".kushki-hosted-field-label",
  deferred: {
    fontSize: "14px",
    "&#ksh-deferred-checkbox>label": {
      width: "max-content",
      fontFamily: "Arial,Verdana,Tahoma",
      fontSize: "14px",
    },
    "&#ksh-deferred-creditType":{
      width: "290px"
    },
    "&#ksh-deferred-months":{
      width: "140px"
    },
    "&#ksh-deferred-graceMonths":{
      width: "140px"
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
      label: "Card holder name",
      placeholder: "Card holder name",
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
