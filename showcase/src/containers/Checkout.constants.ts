import { CardOptions } from "../../../src/module/Payments.index.ts";
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
    fontSize: "12px",
    fontWeight: "400",
    outline: "none",
    paddingLeft: "8px",
    boxSizing: "border-box",
    width: "250px",
    height: "30px",
    "&::placeholder": {
      fontFamily: "Arial,Verdana,Tahoma",
      fontSize: "12px",
      color: "rgba(0,0,0,.26)"
    },
    "&:focus": {
      border: "1px solid #0077ff",
      borderRadius: "10px",
      fontFamily: "Arial,Verdana,Tahoma",
      fontSize: "12px",
      fontWeight: "400",
      outline: "none",
      paddingLeft: "8px",
      width: "250px",
      height: "30px"
    },
    "&:focus::placeholder": {
      color: "transparent"
    },
    "&:invalid": {
      border: "1px solid #B60000",
      borderRadius: "10px",
      fontFamily: "Arial,Verdana,Tahoma",
      fontSize: "10px",
      fontWeight: "400",
      outline: "none",
      paddingLeft: "4px",
      height: "30px",
      width: "250px"
    }
  },
  label: ".kushki-hosted-field-label",
  select: ".kushki-hosted-field-select",
  deferred: {
    container: {
      position: "relative",
      display: "grid",
      gridTemplateColumns: "50%",
      gridTemplateRows: "1fr"
    },
    checkbox: {
      container: {
        position: "relative",
        marginBottom: "20px",
        gridRow: "1",
        gridColumns: "1"
      },
      input: {
        borderRadius: "10px",
        padding: "10px",
        border: "1px solid #ccc",
        width: "18px",
        height: "18px"
      },
      label: {
        background: "white",
        fontFamily: "Arial,Verdana,Tahoma",
        fontWeight: "500",
        paddingLeft: "5px",
        paddingRight: "5px"
      }
    },
    creditType: {
      container: {
        border: "none",
        position: "relative",
        marginBottom: "10px",
        gridRow: "2",
        gridColumns: "1"
      }
    },
    months: {
      container: {
        border: "none",
        position: "relative",
        width: "175px",
        gridRow: "3",
        gridColumns: "1"
      },
      select: {
        fontFamily: "IBM Plex sans-serif",
        width: "175px",
        padding: "10px",
        outline: "none",
        fontSize: "18px",
        fontWeight: "400",
        border: "none",
        borderBottom: "1px solid #ccc",
        "&:focus": {
          borderBottom: "2px solid #2196F3"
        }
      }
    },
    graceMonths: {
      container: {
        position: "relative",
        width: "175px",
        gridRow: "3",
        gridColumns: "1"
      },
      select: {
        fontFamily: "IBM Plex sans-serif",
        width: "175px",
        padding: "10px",
        outline: "none",
        fontSize: "18px",
        fontWeight: "400",
        borderRadius: "10px",
        border: "1px solid #ccc"
      }
    }
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
