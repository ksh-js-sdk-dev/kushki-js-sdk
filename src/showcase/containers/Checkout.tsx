import {
  KushkiFields,
  requestToken,
  TokenResponse,
  KushkiFieldsOptions
} from "KFields";
import { useEffect, useState } from "react";

export const checkoutContainerStyles = {
  button: {
    borderRadius: "12px",
    marginLeft: "15px"
  },
  contentCheckout: {
    alignItems: "start",
    display: "flex",
    flexDirection: "column",
    padding: "10px"
  },
  contentTitle: {
    alignItems: "end",
    display: "flex",
    marginRight: "250px",
    width: "100%"
  }
};

export const CheckoutContainer = () => {
  const [token, setToken] = useState<string>("");
  const [kushkiFields, setKushkiFields] = useState<KushkiFields>();

  const options: KushkiFieldsOptions = {
    fields: {
      cardHolderName: {
        fieldType: "inputBase",
        inputType: "text",
        selector: "cardHolderName_id",
        styles: {
          input: {
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontFamily: "IBM Plex sans-serif",
            fontSize: "16px",
            fontWeight: "400",
            outline: "none",
            padding: "10px",
            width: "350px"
          },
          inputActive: {
            border: "1px solid #1E65AE",
            borderRadius: "4px",
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
            left: "10px",
            paddingLeft: "5px",
            paddingRight: "5px",
            position: "absolute",
            top: "-7px"
          }
        }
      },
      cardNumber: {
        fieldType: "cardNumber",
        inputType: "number",
        label: "Número de tarjeta",
        maxLength: 22,
        placeholder: "Número de tarjeta",
        selector: "cardNumber_id",
        styles: {
          input: {
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontFamily: "IBM Plex sans-serif",
            fontSize: "16px",
            fontWeight: "400",
            outline: "none",
            padding: "10px",
            width: "350px"
          },
          inputActive: {
            border: "1px solid #1E65AE",
            borderRadius: "4px",
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
            left: "10px",
            paddingLeft: "5px",
            paddingRight: "5px",
            position: "absolute",
            top: "-7px"
          }
        }
      },
      cvv: {
        fieldType: "inputBase",
        inputType: "password",
        selector: "cvv_id",
        styles: {
          input: {
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontFamily: "IBM Plex sans-serif",
            fontSize: "16px",
            fontWeight: "400",
            outline: "none",
            padding: "10px",
            width: "350px"
          },
          inputActive: {
            border: "1px solid #1E65AE",
            borderRadius: "4px",
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
            left: "10px",
            paddingLeft: "5px",
            paddingRight: "5px",
            position: "absolute",
            top: "-7px"
          }
        }
      },
      deferred: {
        fieldType: "inputBase",
        inputType: "text",
        selector: "deferred_id",
        styles: {
          input: {
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontFamily: "IBM Plex sans-serif",
            fontSize: "16px",
            fontWeight: "400",
            outline: "none",
            padding: "10px",
            width: "350px"
          },
          inputActive: {
            border: "1px solid #1E65AE",
            borderRadius: "4px",
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
            left: "10px",
            paddingLeft: "5px",
            paddingRight: "5px",
            position: "absolute",
            top: "-7px"
          }
        }
      },
      expirationDate: {
        fieldType: "inputBase",
        inputType: "text",
        selector: "expirationDate_id",
        styles: {
          input: {
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontFamily: "IBM Plex sans-serif",
            fontSize: "16px",
            fontWeight: "400",
            outline: "none",
            padding: "10px",
            width: "350px"
          },
          inputActive: {
            border: "1px solid #1E65AE",
            borderRadius: "4px",
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
            left: "10px",
            paddingLeft: "5px",
            paddingRight: "5px",
            position: "absolute",
            top: "-7px"
          }
        }
      }
    },
    inTest: true,
    publicCredentialId: ""
  };

  useEffect(() => {
    KushkiFields.init(options).then((kushkiFieldsCreated) => {
      setKushkiFields(kushkiFieldsCreated);
    });
  }, []);

  const getToken = () => {
    requestToken(kushkiFields!).then((tokenResponse: TokenResponse) =>
      setToken(tokenResponse.token)
    );
  };

  return (
    <>
      <div style={checkoutContainerStyles.contentTitle}>
        <h1>Kushki Fields JS - DEMO</h1>
      </div>

      <div style={checkoutContainerStyles.contentCheckout}>
        <div id="cardHolderName_id"></div>
        <div id="cardNumber_id"></div>
        <div id="cvv_id"></div>
        <div id="expirationDate_id"></div>
        <div id="deferred_id"></div>

        <button
          className="mui-btn mui-btn--primary mui-btn--raised"
          style={checkoutContainerStyles.button}
          data-testid="tokenRequestBtn"
          onClick={() => getToken()}
        >
          Pagar
        </button>
      </div>

      <hr />
      <h3 data-testid="token">Token: {token}</h3>
      <hr />
    </>
  );
};
