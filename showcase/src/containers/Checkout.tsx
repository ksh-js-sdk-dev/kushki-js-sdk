import { Kushki } from "Kushki";
import {
  Card,
  CardOptions,
  Fields,
  FormValidity,
  TokenResponse
} from "Kushki/card";
import { useEffect, useState } from "react";

export const checkoutContainerStyles = {
  button: {
    backgroundColor: "#39a1f4",
    border: "none",
    borderRadius: "12px",
    color: "#FFF",
    height: "36px",
    margin: "6px 0",
    marginLeft: "15px",
    overflow: "hidden",
    padding: "0 26px"
  },
  contentCheckout: {
    alignItems: "start",
    display: "flex",
    flexDirection: "column" as const,
    padding: "10px"
  },
  contentTitle: {
    display: "flex",
    justifyContent: "center",
    marginRight: "250px",
    width: "100%"
  }
};

export const CheckoutContainer = () => {
  const [token, setToken] = useState<string>("");
  const [cardInstance, setCardinstance] = useState<Card>();
  const [fieldsValidityDemo, setFieldsValidityDemo] = useState<Fields>({
    cardholderName: { isValid: true },
    cardNumber: { isValid: true },
    cvv: { isValid: true },
    deferred: { isValid: true },
    expirationDate: { isValid: true }
  });

  const options: CardOptions = {
    amount: {
      iva: 2,
      subtotalIva: 10,
      subtotalIva0: 10
    },
    currency: "COP",
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
    }
  };

  useEffect(() => {
    (async () => {
      const kushkiInstance = await Kushki.init({
        inTest: true,
        publicCredentialId: "f24eb8375f114ab3acc440ebfb5f60f3"
      });

      if (kushkiInstance) {
        setCardinstance(await Card.initCardToken(kushkiInstance, options));
      }
    })();
  }, []);

  const getToken = async () => {
    if (cardInstance) {
      try {
        const token: TokenResponse = await cardInstance.requestToken();

        setToken(token.token);
      } catch (error: any) {
        setToken(error.message);
      }
    }
  };

  const validError = (fieldsValidity: Fields, fieldType: string): boolean => {
    return (
      !fieldsValidity[fieldType].isValid &&
      fieldsValidity[fieldType].errorType !== undefined
    );
  };

  useEffect(() => {
    if (cardInstance) {
      cardInstance.onFieldValidity((event: FormValidity) => {
        console.log("onFieldValidity Checkout Demo", event);
        setFieldsValidityDemo(event.fields);
      });
    }
  }, [cardInstance]);

  return (
    <>
      <div style={checkoutContainerStyles.contentTitle!}>
        <h1>Kushki Fields JS - DEMO</h1>
      </div>

      <div style={checkoutContainerStyles.contentCheckout!}>
        <div id="cardHolderName_id"></div>
        {validError(fieldsValidityDemo, "cardholderName") && (
          <div>
            Error-CardHolderName is{" "}
            {fieldsValidityDemo.cardholderName.errorType}
          </div>
        )}
        <div id="cardNumber_id"></div>
        {validError(fieldsValidityDemo, "cardNumber") && (
          <div>
            Error-CardNumber is {fieldsValidityDemo.cardNumber.errorType}
          </div>
        )}
        <div id="expirationDate_id"></div>
        {validError(fieldsValidityDemo, "expirationDate") && (
          <div>
            Error - ExpirationDate is{" "}
            {fieldsValidityDemo.expirationDate.errorType}
          </div>
        )}
        <div id="cvv_id"></div>
        {validError(fieldsValidityDemo, "cvv") && (
          <div>Error - Cvv is {fieldsValidityDemo.cvv.errorType}</div>
        )}
        <div id="deferred_id"></div>
        {validError(fieldsValidityDemo, "deferred") && (
          <div>
            Error - Deferred is {fieldsValidityDemo.deferred!.errorType}
          </div>
        )}

        <button
          style={checkoutContainerStyles.button!}
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
