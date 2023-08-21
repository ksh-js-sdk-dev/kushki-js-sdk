import {
  KushkiFields,
  requestToken,
  Field,
  KushkiFieldsOptions
} from "KFields";

describe("CardService test", () => {
  let kushkiFieldsMock: KushkiFields;
  let options: KushkiFieldsOptions;
  let field: Field;

  beforeEach(async () => {
    field = {
      selector: "id_test"
    };
    options = {
      fields: {
        cardHolderName: field,
        cardNumber: field,
        cvv: field,
        expirationDate: field
      },
      publicCredentialId: "publicCredentialId"
    };

    kushkiFieldsMock = await KushkiFields.init(options);
  });

  it("it should return base URL when KushkiFields has property inTest equal to undefined", async function () {
    const tokenResponse = await requestToken(kushkiFieldsMock);

    expect(tokenResponse.token).toEqual("replace by token response");
  });
});
