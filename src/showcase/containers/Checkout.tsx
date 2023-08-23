import {
  KushkiFields,
  requestToken,
  TokenResponse,
  KushkiFieldsOptions
} from "KFields";
import { useEffect, useState } from "react";

export const CheckoutContainer = () => {
  const [token, setToken] = useState<string>("");
  const [kushkiFields, setKushkiFields] = useState<KushkiFields>();

  const options: KushkiFieldsOptions = {
    fields: {
      cardHolderName: {
        selector: "cardHolderName_id"
      },
      cardNumber: {
        selector: "cardNumber_id"
      },
      cvv: {
        selector: "cvv_id"
      },

      deferred: {
        selector: "deferred_id"
      },
      expirationDate: {
        selector: "expirationDate_id"
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
      <h1>Kushki Fields JS - DEMO</h1>
      <div id="cardHolderName_id"></div>
      <div id="cardNumber_id"></div>
      <div id="cvv_id"></div>
      <div id="expirationDate_id"></div>
      <div id="deferred_id"></div>
      <hr />
      <button data-testid="tokenRequestBtn" onClick={() => getToken()}>
        Token Request
      </button>
      <h3 data-testid="token">Token: {token}</h3>
      <hr />
    </>
  );
};
