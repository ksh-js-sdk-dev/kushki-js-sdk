import { CardOptions, Field, Kushki } from "Kushki";
import { Card } from "Kushki/card";
import KushkiHostedFields from "../libs/HostedField.ts";


jest.mock("../libs/HostedField.ts", () => jest.fn().mockImplementation(
    () => ({ render: jest.fn()})
));

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

    KushkiHostedFields.mockClear();
  });

  it("it should return base URL of uat when Card has property inTest equal to true", async () => {
    const cardInstance = await Card.initCardToken(kushki, options);

    KushkiHostedFields.mock.calls[0][0].onChange("cardholderName", "test")

    const token = await cardInstance.requestToken();

    //TODO: refactor test when call to API is finished, mock gateway and check data of request
    expect(token).toEqual({
      token: "replace by token response",
      request: {cardholderName: "test" }
    });
  });

  it('should set handleOnChange as callback in KushkiHostedFields', async ()  => {
    options = {
      fields: {
        cardHolderName: {...field, onFocus: jest.fn() },
        cardNumber: {...field, onFocus: jest.fn() },
        cvv: {...field, onFocus: jest.fn() },
        expirationDate: {...field, onFocus: jest.fn() },
      }
    };
    await Card.initCardToken(kushki, options);

    expect(KushkiHostedFields).toHaveBeenCalledTimes(4)
    expect(KushkiHostedFields.mock.calls[0][0].selector).toEqual(field.selector);
    expect(typeof KushkiHostedFields.mock.calls[0][0].onChange).toEqual("function");
    expect(typeof KushkiHostedFields.mock.calls[0][0].handleOnFocus).toEqual("function");
  });

  it('should set undefined in handleOnFocus field of KushkiHostedFields options', async ()  => {
    options = {
      fields: {
        cardHolderName: {...field },
        cardNumber: {...field },
        cvv: {...field },
        expirationDate: {...field },
      }
    };
    await Card.initCardToken(kushki, options);

    expect(KushkiHostedFields).toHaveBeenCalledTimes(4)
    expect(typeof KushkiHostedFields.mock.calls[0][0].handleOnFocus).toEqual("undefined");
  });
});
