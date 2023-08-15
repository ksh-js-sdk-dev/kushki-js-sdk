import {IKushkiFields} from "./repository/IKushkiFields.tsx";
import {KushkiFields} from "./module/services/KushkiFields.ts";
import {KushkiFieldsOptions} from "../types/kushki_fields_options";
import {TokenResponse} from "../types/remote/token_response";

function App() {
  let token = null
  let kushkiFieldsInstance: IKushkiFields | null = null

  const options : KushkiFieldsOptions = {
      publicCredentialId: "",
      inTest: true,
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
          expirationDate: {
              selector: "expirationDate_id"
          },
          deferred: {
              selector: "deferred_id"
          },
      }
  }

  KushkiFields.init(options).then( kushkiFieldsCreated => { kushkiFieldsInstance = kushkiFieldsCreated })

  return (
    <>
      <h1>Kushki Fields JS - DEMO</h1>
      <div id="cardHolderName_id"></div>
      <div id="cardNumber_id"></div>
      <div id="cvv_id"></div>
      <div id="expirationDate_id"></div>
      <div id="deferred_id"></div>
      <hr/>
      <button data-testid="tokenRequestBtn" onClick={() => {
          kushkiFieldsInstance?.requestToken().then((tokenResponse: TokenResponse) => token = tokenResponse.token)
      }}> Token Request</button>
          <h3 data-testid="token">Token: {token}</h3>

    </>
  );
}

export default App;
