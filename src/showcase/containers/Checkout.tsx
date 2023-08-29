import { Kushki, TokenResponse } from "Kushki";
import { Card, CardOptions } from "Kushki/card";
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
    flexDirection: "column" as "column",
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
        fieldType: "cardNumber",
        inputType: "number",
        label: "Número de tarjeta",
        maxLength: 22,
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
        placeholder: "MM/YY",
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
    Kushki.init({ publicCredentialId: "1234" }).then(async (kushkiInstance) =>
      setCardinstance(await Card.initCardToken(kushkiInstance, options))
    );
  }, []);

  const getToken = () => {
    if (cardInstance) {
      cardInstance.requestToken().then((token: TokenResponse) => {
        setToken(token.token);
      });
    }
  };

  return (
    <>
      <div style={checkoutContainerStyles.contentTitle!}>
        <h1>Kushki Fields JS - DEMO</h1>
      </div>

      <div style={checkoutContainerStyles.contentCheckout!}>
        <div id="cardHolderName_id"></div>
        <div id="cardNumber_id"></div>
        <div id="expirationDate_id"></div>
        <div id="cvv_id"></div>
        <div id="deferred_id"></div>

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
