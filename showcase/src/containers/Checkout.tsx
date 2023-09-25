import { Kushki } from "Kushki";
import {
  CardOptions,
  ErrorTypeEnum,
  Fields,
  FormValidity,
  Payment,
  TokenResponse
} from "../../../src/module";
import { useEffect, useState } from "react";
import { TableDemoField } from "../components/TableDemoField";
import { ErrorTypeEnum } from "../../../src/infrastructure/ErrorTypeEnum.ts";
import { TableDemoGeneral } from "../components/TableDemoGeneral";
import { KushkiError } from "../../../src/infrastructure/KushkiError.ts";

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
  buttonError: {
    backgroundColor: "red",
    border: "none",
    borderRadius: "12px",
    color: "#FFF",
    height: "36px",
    margin: "6px 0",
    marginLeft: "15px",
    overflow: "hidden",
    padding: "0 26px"
  },
  contentBottoms: {
    display: "flex"
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
  const [cardInstance, setCardinstance] = useState<Payment>();
  const [fieldsValidityDemo, setFieldsValidityDemo] = useState<Fields>({
    cardholderName: { isValid: true },
    cardNumber: { isValid: true },
    cvv: { isValid: true },
    deferred: { isValid: true },
    expirationDate: { isValid: true }
  });
  const [showOTP, setShowOTP] = useState<boolean>(false);
  const [errorOTP, setErrorOTP] = useState<string>("");
  const options: CardOptions = {
    amount: {
      iva: 26,
      // subtotalIva: 260000,
      // subtotalIva: 600, // otp
      // subtotalIva0: 0
      // 3ds amount
      iva: 0,
      subtotalIva: 0,
      subtotalIva0: 10000
    },
    currency: "COP",
    fields: {
      cardHolderName: {
        fieldType: "cardholderName",
        inputType: "text",
        label: "Payment holder name",
        placeholder: "Payment holder name",
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
        deferredInputs: {
          deferredCheckbox: {
            label: "Quiero pagar en cuotas",
            styles: {
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
              inputActive: {
                borderRadius: "10px",
                padding: "10px",
                border: "1px solid #ccc",
                width: "18px",
                height: "18px"
              },
              label: {
                background: "white",
                color: "#293036",
                fontFamily: "IBM Plex sans",
                fontWeight: "500",
                paddingLeft: "5px",
                paddingRight: "5px"
              }
            }
          },
          deferredType: {
            label: "Tipos de diferido",
            placeholder: "Tipos de diferido",
            hiddenLabel: "deferred Type",
            styles: {
              container: {
                position: "relative",
                marginBottom: "20px",
                gridRow: "2",
                gridColumns: "1"
              },
              input: {
                fontFamily: "IBM Plex sans-serif",
                width: "350px",
                padding: "10px",
                outline: "none",
                fontSize: "18px",
                fontWeight: "400",
                borderRadius: "10px",
                border: "1px solid #ccc"
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
          months: {
            label: "Meses",
            placeholder: "Meses",
            hiddenLabel: "Meses",
            styles: {
              container: {
                position: "relative",
                marginBottom: "20px",
                width: "175px",
                gridRow: "3",
                gridColumns: "1"
              },
              input: {
                fontFamily: "IBM Plex sans-serif",
                width: "175px",
                padding: "10px",
                outline: "none",
                fontSize: "18px",
                fontWeight: "400",
                borderRadius: "10px",
                border: "1px solid #ccc"
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
          graceMonths: {
            label: "Meses de gracia",
            placeholder: "Meses de gracia",
            hiddenLabel: "Meses de gracia",
            styles: {
              container: {
                position: "relative",
                marginBottom: "20px",
                width: "175px",
                gridRow: "3",
                gridColumns: "1"
              },
              input: {
                fontFamily: "IBM Plex sans-serif",
                width: "175px",
                padding: "10px",
                outline: "none",
                fontSize: "18px",
                fontWeight: "400",
                borderRadius: "10px",
                border: "1px solid #ccc"
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
        fieldType: "deferred",
        inputType: "text",
        label: "Diferido",
        placeholder: "Diferido",
        selector: "deferred_id",
        styles: {
          container: {
            position: "relative",
            display: "grid",
            gridTemplateColumns: "50%",
            gridTemplateRows: "1fr"
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
      },
      otp: {
        fieldType: "otp",
        inputType: "password",
        label: "OTP",
        placeholder: "OTP",
        selector: "otp_id",
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
      try {
        const kushkiInstance = await Kushki.init({
          inTest: true,
          publicCredentialId: "d6b3e17702e64d85b812c089e24a1ca1" //3DS merchant Test
          //publicCredentialId: "40f9e34568fa40e39e15c5dddb607075" // Sift merchant Test
          // publicCredentialId: "289d036418724065bc871ea50a4ee39f" //merchant chile
          // publicCredentialId: "7cad8d921dcb463eb92c43c049a849b0" //OTP
        });

        if (kushkiInstance) {
          setCardinstance(await Payment.initCardToken(kushkiInstance, options));
        }
      } catch (e: any) {
        console.log(e.message);
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

  const validError = (
    fieldsValidity: Fields,
    fieldType: keyof Fields
  ): boolean => {
    return (
      !fieldsValidity[fieldType]?.isValid &&
      fieldsValidity[fieldType]?.errorType !== undefined
    );
  };

  const customMessageValidity = (field: string, errorType: ErrorTypeEnum) => {
    if (errorType === "empty") return `The field ${field} is required`;

    return `Error-${field} is ${errorType}`;
  };

  useEffect(() => {
    if (cardInstance) {
      cardInstance.onFieldValidity((event: FormValidity) => {
        setFieldsValidityDemo(event.fields);
      });

      cardInstance.onOTPValidation(
        () => {
          setShowOTP(true);
        },
        (error) => {
          setErrorOTP(error.message);
        },
        () => {
          setErrorOTP("");
        }
      );
    }
  }, [cardInstance]);

  return (
    <>
      <div style={checkoutContainerStyles.contentTitle!}>
        <h1>Kushki Fields JS - DEMO</h1>
      </div>
      <p>Tarjeta 3DS: 4000000000002503</p>
      <div style={checkoutContainerStyles.contentCheckout!}>
        {!showOTP && (
          <>
            <div id="cardHolderName_id"></div>
            {validError(fieldsValidityDemo, "cardholderName") && (
              <div>
                {customMessageValidity(
                  "cardholderName",
                  fieldsValidityDemo.cardholderName.errorType! as ErrorTypeEnum
                )}
              </div>
            )}
            <div id="cardNumber_id"></div>
            {validError(fieldsValidityDemo, "cardNumber") && (
              <div>
                {customMessageValidity(
                  "cardNumber",
                  fieldsValidityDemo.cardNumber.errorType! as ErrorTypeEnum
                )}
              </div>
            )}
            <div id="expirationDate_id"></div>
            {validError(fieldsValidityDemo, "expirationDate") && (
              <div>
                {customMessageValidity(
                  "expirationDate",
                  fieldsValidityDemo.expirationDate.errorType! as ErrorTypeEnum
                )}
              </div>
            )}
            <div id="cvv_id"></div>
            {validError(fieldsValidityDemo, "cvv") && (
              <div>
                {customMessageValidity(
                  "cvv",
                  fieldsValidityDemo.cvv.errorType! as ErrorTypeEnum
                )}
              </div>
            )}
            <div id="deferred_id"></div>
            {validError(fieldsValidityDemo, "deferred") && (
              <div>
                {customMessageValidity(
                  "deferred",
                  fieldsValidityDemo.deferred!.errorType! as ErrorTypeEnum
                )}
              </div>
            )}
          </>
        )}

        <div id="otp_id"></div>
        {errorOTP.length > 0 && <div>El código OTP es incorrecto</div>}

        <div style={checkoutContainerStyles.contentBottoms!}>
          <button
            style={checkoutContainerStyles.button!}
            data-testid="tokenRequestBtn"
            onClick={() => getToken()}
          >
            Pagar
          </button>
          <button
            style={checkoutContainerStyles.buttonError!}
            onClick={async () => {
              try {
                await cardInstance.focus("cardName");
              } catch (error: any) {
                alert(error.message);
              }
            }}
          >
            Error Focus
          </button>
          <button
            style={checkoutContainerStyles.buttonError!}
            onClick={async () => {
              try {
                await cardInstance.reset("cardName");
              } catch (error: any) {
                alert(error.message);
              }
            }}
          >
            Error Reset
          </button>
        </div>

        <div style={checkoutContainerStyles.contentBottoms!}>
          <button
            style={checkoutContainerStyles.button!}
            onClick={async () => await cardInstance.focus("cardholderName")}
          >
            Focus cardHolderName
          </button>
          <button
            style={checkoutContainerStyles.button!}
            onClick={async () => await cardInstance.focus("cardNumber")}
          >
            Focus cardNumber
          </button>
          <button
            style={checkoutContainerStyles.button!}
            onClick={async () => await cardInstance.focus("expirationDate")}
          >
            Focus expirationDate
          </button>
          <button
            style={checkoutContainerStyles.button!}
            onClick={async () => await cardInstance.focus("cvv")}
          >
            Focus cvv
          </button>
        </div>

        <div style={checkoutContainerStyles.contentBottoms!}>
          <button
            style={checkoutContainerStyles.button!}
            onClick={async () => await cardInstance.reset("cardholderName")}
          >
            Reset cardHolderName
          </button>
          <button
            style={checkoutContainerStyles.button!}
            onClick={async () => await cardInstance.reset("cardNumber")}
          >
            Reset cardNumber
          </button>
          <button
            style={checkoutContainerStyles.button!}
            onClick={async () => await cardInstance.reset("expirationDate")}
          >
            Reset expirationDate
          </button>
          <button
            style={checkoutContainerStyles.button!}
            onClick={async () => await cardInstance.reset("cvv")}
          >
            Reset cvv
          </button>
        </div>
      </div>

      <hr />
      <h3 data-testid="token">Token: {token}</h3>
      <hr />
      {cardInstance && <TableDemoGeneral cardInstance={cardInstance} />}

      <br />
      {cardInstance && (
        <TableDemoField
          fieldType="cardholderName"
          cardInstance={cardInstance}
        />
      )}
      <br />
      {cardInstance && (
        <TableDemoField fieldType="cardNumber" cardInstance={cardInstance} />
      )}
      <br />
      {cardInstance && (
        <TableDemoField
          fieldType="expirationDate"
          cardInstance={cardInstance}
        />
      )}
      <br />
      {cardInstance && (
        <TableDemoField fieldType="cvv" cardInstance={cardInstance} />
      )}
    </>
  );
};
