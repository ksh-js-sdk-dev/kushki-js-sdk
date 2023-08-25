import { CardOptions, Field, Kushki } from "Kushki";
import { Card } from "Kushki/card";

describe("Card test", () => {
  let kushki: Kushki;
  let options: CardOptions;
  let field: Field;

  beforeEach(async () => {
    kushki = await Kushki.init({ publicCredentialId: "1234" });

    field = {
      selector: "id_test"
    };

    options = {
      fields: {
        cardHolderName: field,
        cardNumber: field,
        cvv: field,
        expirationDate: field
      }
    };
  });

  it("it should return base URL of uat when Card has property inTest equal to true", async () => {
    const cardInstance = await Card.initCardToken(kushki, options);
    const token = await cardInstance.requestToken();

    expect(token).toEqual({
      token: "replace by token response"
    });
  });
});
