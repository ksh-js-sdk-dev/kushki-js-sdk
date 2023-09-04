import { Kushki, TokenResponse } from "Kushki";
import { Card, CardOptions } from "Kushki/card";

let cardInstance: Card;
const options: CardOptions = {
  fields: {
    cardHolderName: {
      fieldType: "cardholderName",
      inputType: "text",
      label: "Card holder name",
      placeholder: "Card holder name",
      selector: "cardHolderName_id",
      styles: {
        container: {
          position: "relative"
        },
        input: {
          border: "1px solid #ccc",
          borderRadius: "10px",
          fontFamily: "IBM Plex sans-serif",
          fontSize: "16px",
          fontWeight: "400",
          outline: "none",
          padding: "10px",
          width: "350px"
        },
        inputActive: {
          border: "1px solid #1E65AE",
          borderRadius: "10px",
          fontFamily: "IBM Plex sans-serif",
          fontSize: "16px",
          fontWeight: "400",
          outline: "none",
          padding: "10px",
          width: "350px"
        },
        label: {
          background: "white",
          color: "#6D7781",
          fontFamily: "IBM Plex sans-serif",
          fontSize: "12px",
          fontWeight: "400",
          left: "16px",
          paddingLeft: "5px",
          paddingRight: "5px",
          position: "absolute",
          top: "-7px"
        }
      }
    },
    cardNumber: {
      brandIcon: "amex",
      fieldType: "cardNumber",
      inputType: "number",
      label: "Número de tarjeta",
      placeholder: "Número de tarjeta",
      selector: "cardNumber_id",
      styles: {
        container: {
          position: "relative"
        },
        input: {
          border: "1px solid #ccc",
          borderRadius: "10px",
          fontFamily: "IBM Plex sans-serif",
          fontSize: "16px",
          fontWeight: "400",
          outline: "none",
          padding: "10px",
          width: "350px"
        },
        inputActive: {
          border: "1px solid #1E65AE",
          borderRadius: "10px",
          fontFamily: "IBM Plex sans-serif",
          fontSize: "16px",
          fontWeight: "400",
          outline: "none",
          padding: "10px",
          width: "350px"
        },
        label: {
          background: "white",
          color: "#6D7781",
          fontFamily: "IBM Plex sans-serif",
          fontSize: "12px",
          fontWeight: "400",
          left: "16px",
          paddingLeft: "5px",
          paddingRight: "5px",
          position: "absolute",
          top: "-7px"
        }
      }
    },
    cvv: {
      fieldType: "cvv",
      inputType: "password",
      label: "CVV",
      placeholder: "CVV",
      selector: "cvv_id",
      styles: {
        container: {
          position: "relative"
        },
        input: {
          border: "1px solid #ccc",
          borderRadius: "10px",
          fontFamily: "IBM Plex sans-serif",
          fontSize: "16px",
          fontWeight: "400",
          outline: "none",
          padding: "10px",
          width: "350px"
        },
        inputActive: {
          border: "1px solid #1E65AE",
          borderRadius: "10px",
          fontFamily: "IBM Plex sans-serif",
          fontSize: "16px",
          fontWeight: "400",
          outline: "none",
          padding: "10px",
          width: "350px"
        },
        label: {
          background: "white",
          color: "#6D7781",
          fontFamily: "IBM Plex sans-serif",
          fontSize: "12px",
          fontWeight: "400",
          left: "16px",
          paddingLeft: "5px",
          paddingRight: "5px",
          position: "absolute",
          top: "-7px"
        }
      }
    },
    deferred: {
      fieldType: "deferred",
      inputType: "text",
      label: "Diferido",
      placeholder: "Diferido",
      selector: "deferred_id",
      styles: {
        container: {
          position: "relative"
        },
        input: {
          border: "1px solid #ccc",
          borderRadius: "10px",
          fontFamily: "IBM Plex sans-serif",
          fontSize: "16px",
          fontWeight: "400",
          outline: "none",
          padding: "10px",
          width: "350px"
        },
        inputActive: {
          border: "1px solid #1E65AE",
          borderRadius: "10px",
          fontFamily: "IBM Plex sans-serif",
          fontSize: "16px",
          fontWeight: "400",
          outline: "none",
          padding: "10px",
          width: "350px"
        },
        label: {
          background: "white",
          color: "#6D7781",
          fontFamily: "IBM Plex sans-serif",
          fontSize: "12px",
          fontWeight: "400",
          left: "16px",
          paddingLeft: "5px",
          paddingRight: "5px",
          position: "absolute",
          top: "-7px"
        }
      }
    },
    expirationDate: {
      fieldType: "expirationDate",
      inputType: "text",
      label: "Fecha de vencimiento",
      placeholder: "Fecha de vencimiento",
      selector: "expirationDate_id",
      styles: {
        container: {
          position: "relative"
        },
        input: {
          border: "1px solid #ccc",
          borderRadius: "10px",
          fontFamily: "IBM Plex sans-serif",
          fontSize: "16px",
          fontWeight: "400",
          outline: "none",
          padding: "10px",
          width: "350px"
        },
        inputActive: {
          border: "1px solid #1E65AE",
          borderRadius: "10px",
          fontFamily: "IBM Plex sans-serif",
          fontSize: "16px",
          fontWeight: "400",
          outline: "none",
          padding: "10px",
          width: "350px"
        },
        label: {
          background: "white",
          color: "#6D7781",
          fontFamily: "IBM Plex sans-serif",
          fontSize: "12px",
          fontWeight: "400",
          left: "16px",
          paddingLeft: "5px",
          paddingRight: "5px",
          position: "absolute",
          top: "-7px"
        }
      }
    }
  },
  amount: {
    currency: "COP",
    subtotalIva:10,
    subtotalIva0:20,
    iva:12,
  }
};

Kushki.init({
  inTest: true,
  publicCredentialId: "f24eb8375f114ab3acc440ebfb5f60f3"
}).then(async (kushkiInstance) => {
  cardInstance = await Card.initCardToken(kushkiInstance, options);
});

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <h1>Vite + TypeScript</h1>
    <div >
        <div id="cardHolderName_id"></div>
        <div id="cardNumber_id"></div>
        <div id="expirationDate_id"></div>
        <div id="cvv_id"></div>
        <div id="deferred_id"></div>

        <button>
          Pagar
        </button>
      </div>
  </div>
`;

const button = document.querySelector("button");
button!.addEventListener("click", () => {
  if (cardInstance) {
    cardInstance.requestToken().then((token: TokenResponse) => {
      alert(token);
    });
  }
});
