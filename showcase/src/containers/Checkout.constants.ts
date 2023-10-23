import { CardOptions } from "../../../src/module/Card.ts";
import { Styles } from "../../../types/card_options";

export const hostedFieldsStyles: Styles = {
  container: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    position: "relative"
  },
  deferred: {
    "&#ksh-deferred-checkbox>label": {
      fontFamily: "IBM Plex Sans,sans-serif",
      fontSize: "14px",
      width: "max-content"
    },
    "&#ksh-deferred-creditType": {
      width: "290px"
    },
    "&#ksh-deferred-graceMonths": {
      width: "140px"
    },
    "&#ksh-deferred-months": {
      width: "140px"
    },
    fontSize: "14px"
  },
  focus: {
    border: "1px solid #0077ff",
    borderRadius: "10px",
    fontFamily: "IBM Plex Sans,sans-serif",
    fontSize: "14px",
    fontWeight: "400",
    height: "40px",
    outline: "none",
    paddingLeft: "8px",
    width: "300px"
  },
  input: {
    "& + label": {
      color: "transparent",
      fontFamily: "IBM Plex Sans,sans-serif",
      fontSize: "12px",
      fontWeight: "400",
      left: "16px",
      paddingLeft: "5px",
      paddingRight: "5px",
      position: "absolute",
      top: "-3px",
      width: "auto"
    },
    "&::placeholder": {
      color: "rgba(0,0,0,.26)",
      fontFamily: "IBM Plex Sans,sans-serif",
      fontSize: "14px"
    },
    "&:focus + label": {
      background: "white",
      color: "#6D7781",
      fontSize: "12px"
    },
    "&:focus::placeholder": {
      color: "transparent"
    },
    "&:invalid + label": {
      background: "white",
      color: "#B60000",
      fontSize: "12px"
    },
    "&:invalid::placeholder": {
      color: "transparent"
    },
    "&:not(:placeholder-shown) + label": {
      background: "white",
      color: "#6D7781",
      fontSize: "12px"
    },
    "&:not(:placeholder-shown):invalid + label": {
      background: "white",
      color: "#B60000",
      fontSize: "12px"
    },
    border: "1px solid rgba(203, 213, 224, 1)",
    borderRadius: "10px",
    boxSizing: "border-box",
    color: "#293036",
    fontFamily: "IBM Plex Sans,sans-serif",
    fontSize: "14px",
    fontWeight: "400",
    height: "40px",
    outline: "none",
    paddingLeft: "8px",
    width: "300px"
  },
  invalid: {
    borderColor: "#B60000",
    borderRadius: "10px",
    borderStyle: "solid",
    borderWidth: "1px",
    fontFamily: "IBM Plex Sans,sans-serif",
    fontSize: "14px",
    fontWeight: "400",
    height: "40px",
    outline: "none",
    paddingLeft: "8px"
  },
  label: ".kushki-hosted-field-label"
};

export const optionsDefault: CardOptions = {
  amount: {
    iva: 0,
    subtotalIva: 0,
    subtotalIva0: 0
  },
  currency: "USD",
  fields: {
    cardholderName: {
      inputType: "text",
      label: "Nombre del tarjetahabiente",
      placeholder: "Nombre del tarjetahabiente",
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
          hiddenLabel: "deferred Type",
          label: "Tipos de diferido",
          placeholder: "Tipos de diferido"
        },
        graceMonths: {
          hiddenLabel: "Meses de gracia",
          label: "Meses de gracia",
          placeholder: "Meses de gracia"
        },
        months: {
          hiddenLabel: "Meses",
          label: "Meses",
          placeholder: "Meses"
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
      label: "OTP de verificación",
      placeholder: "OTP de verificación",
      selector: "otp_id"
    }
  },
  isSubscription: false,
  styles: hostedFieldsStyles
};
