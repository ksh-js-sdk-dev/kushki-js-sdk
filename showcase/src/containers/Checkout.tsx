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
  },
  table: {
    width: "100%"
  },
  td: {
    padding: "8px",
    textAlign: "center",
    width: "50%"
  },
  th: {
    padding: "8px",
    textAlign: "center",
    width: "50%"
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
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [errorsTypes, setErrorsTypes] = useState<string>("");
  const [validFields, setValidFields] = useState<string>("");
  const [triggeredByFields, setTriggeredBy] = useState<string>("");

  const [focusCardHolderName, setFocusCardHolderName] = useState<string>("");
  const [validityCardHolderName, setValidityCardHolderName] =
    useState<string>("");
  const [submitCardHolderName, setSubmitCardHolderName] = useState<string>("");
  const [blurCardHolderName, setBlurCardHolderName] = useState<string>("");

  const [focusCardNumber, setFocusCardNumber] = useState<string>("");
  const [validityCardNumber, setValidityCardNumber] = useState<string>("");
  const [blurCardNumber, setBlurCardNumber] = useState<string>("");
  const [submitCardNumber, setSubmitCardNumber] = useState<string>("");

  const [focusExpirationDate, setFocusExpirationDate] = useState<string>("");
  const [validityExpirationDate, setValidityExpirationDate] =
    useState<string>("");
  const [submitExpirationDate, setSubmitExpirationDate] = useState<string>("");
  const [blurExpirationDate, setBlurExpirationDate] = useState<string>("");

  const [focusCvv, setFocusCvv] = useState<string>("");
  const [validityCvv, setValidityCvv] = useState<string>("");
  const [submitCvv, setSubmitCvv] = useState<string>("");
  const [blurCvv, setBlurCvv] = useState<string>("");

  const options: CardOptions = {
    amount: {
      iva: 26,
      subtotalIva: 26,
      subtotalIva0: 0
    },
    currency: "USD",
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
      }
    }
  };

  useEffect(() => {
    (async () => {
      const kushkiInstance = await Kushki.init({
        inTest: true,
        // publicCredentialId: "d6b3e17702e64d85b812c089e24a1ca1" //3DS merchant Test
        publicCredentialId: "40f9e34568fa40e39e15c5dddb607075" // Sift merchant Test
      });

      if (kushkiInstance) {
        setCardinstance(await Payment.initCardToken(kushkiInstance, options));
      }
    })();
  }, []);

  const getToken = async () => {
    if (cardInstance) {
      try {
        const token: TokenResponse = await cardInstance.requestToken();

        await cardInstance.reset("cardholderName");

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

  const buildErrorsTypesFields = (fieldsValidity: Fields) => {
    let result = "";

    for (const key in fieldsValidity) {
      if (fieldsValidity.hasOwnProperty(key)) {
        const errorType = fieldsValidity[key].errorType || "success";

        result += `${key} : ${errorType}\n`;
      }
    }

    setErrorsTypes(result);
  };

  const buildInfoValidFields = (fieldsValidity: Fields) => {
    let result = "";

    for (const key in fieldsValidity) {
      if (fieldsValidity.hasOwnProperty(key)) {
        const isValid = fieldsValidity[key].isValid || "false";

        result += `${key} : ${isValid}\n`;
      }
    }

    setValidFields(result);
  };

  useEffect(() => {
    if (cardInstance) {
      cardInstance.onFieldValidity((event: FormValidity) => {
        setIsFormValid(event.isFormValid);
        setFieldsValidityDemo(event.fields);
        buildErrorsTypesFields(event.fields);
        buildInfoValidFields(event.fields);
        setTriggeredBy(event.triggeredBy!);
      });

      (async () => {
        try {
          // await cardInstance.focus("cardholderName");
        } catch (error: any) {
          console.log("error", error);
        }
      })();
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
            {customMessageValidity(
              "cardholderName",
              fieldsValidityDemo.cardholderName.errorType!
            )}
          </div>
        )}
        <div id="cardNumber_id"></div>
        {validError(fieldsValidityDemo, "cardNumber") && (
          <div>
            {customMessageValidity(
              "cardNumber",
              fieldsValidityDemo.cardNumber.errorType!
            )}
          </div>
        )}
        <div id="expirationDate_id"></div>
        {validError(fieldsValidityDemo, "expirationDate") && (
          <div>
            {customMessageValidity(
              "expirationDate",
              fieldsValidityDemo.expirationDate.errorType!
            )}
          </div>
        )}
        <div id="cvv_id"></div>
        {validError(fieldsValidityDemo, "cvv") && (
          <div>
            {customMessageValidity("cvv", fieldsValidityDemo.cvv.errorType!)}
          </div>
        )}
        <div id="deferred_id"></div>
        {validError(fieldsValidityDemo, "deferred") && (
          <div>
            {customMessageValidity(
              "deferred",
              fieldsValidityDemo.deferred!.errorType!
            )}
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

      <table border="1" style={checkoutContainerStyles.table}>
        <tr>
          <th style={checkoutContainerStyles.th}>Evento</th>
          <th style={checkoutContainerStyles.th}>Campo</th>
        </tr>
        <tr>
          <td style={checkoutContainerStyles.td}>isFormValid</td>
          <td style={checkoutContainerStyles.td}>{isFormValid.toString()}</td>
        </tr>
        <tr>
          <td style={checkoutContainerStyles.td}>isValid</td>
          <td style={checkoutContainerStyles.td}>{validFields}</td>
        </tr>
        <tr>
          <td style={checkoutContainerStyles.td}>errorType</td>
          <td style={checkoutContainerStyles.td}>{errorsTypes}</td>
        </tr>
        <tr>
          <td style={checkoutContainerStyles.td}>triggeredBy</td>
          <td style={checkoutContainerStyles.td}>{triggeredByFields}</td>
        </tr>
      </table>
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
