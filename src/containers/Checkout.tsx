import { IKushkiFields } from "../repository/IKushkiFields";
import { KushkiFieldsOptions } from "../../types/kushki_fields_options";
import { TokenResponse } from "../../types/remote/token_response";
import { KushkiFields } from "../module/services/KushkiFields";

export const CheckoutContainer = () => {
  let token = null;
  let kushkiFieldsInstance: IKushkiFields | null = null;

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

  KushkiFields.init(options).then((kushkiFieldsCreated) => {
    kushkiFieldsInstance = kushkiFieldsCreated;
  });

  function getToken() {
    kushkiFieldsInstance
      ?.requestToken()
      .then((tokenResponse: TokenResponse) => (token = tokenResponse.token));
  }

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
        {" "}
        Token Request
      </button>
      <h3 data-testid="token">Token: {token}</h3>
    </>
  );
};
