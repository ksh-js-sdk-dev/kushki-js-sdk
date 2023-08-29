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
      selector: "id_test",
      fieldType: ""
    };

    options = {
      fields: {
        cardHolderName: field,
        cardNumber: field,
        cvv: field,
        expirationDate: field
      }
    };

    document.body.innerHTML= '<div id="id_test">my div</div>'
    KushkiHostedFields.mockClear();
  });

  it("it should return base URL of uat when Card has property inTest equal to true", async () => {
    const cardInstance = await Card.initCardToken(kushki, options);

    KushkiHostedFields.mock.calls[0][0].handleOnChange("cardholderName", "test")
    KushkiHostedFields.mock.calls[0][0].handleOnFocus("cardholderName", "test")
    KushkiHostedFields.mock.calls[0][0].handleOnBlur("cardholderName", "test")

    const token = await cardInstance.requestToken();

    //TODO: refactor test when call to API is finished, mock gateway and check data of request
    expect(token).toEqual({
      token: "replace by token response"
    });
  });

  it('should set handleOnChange as callback in KushkiHostedFields', async ()  => {
    await Card.initCardToken(kushki, options);

    expect(KushkiHostedFields).toHaveBeenCalledTimes(4)
    expect(KushkiHostedFields.mock.calls[0][0].selector).toEqual(field.selector);
    expect(typeof KushkiHostedFields.mock.calls[0][0].handleOnChange).toEqual("function");
    expect(typeof KushkiHostedFields.mock.calls[0][0].handleOnFocus).toEqual("function");
  });

  it('should throw error when element not exist in mehtod initCardToken', async ()  => {
    field = {
      selector: "id_test_not_created",
      fieldType: ""
    };

    options = {
      fields: {
        cardHolderName: field,
        cardNumber: field,
        cvv: field,
        expirationDate: field
      }
    }

    await expect(Card.initCardToken(kushki, options)).rejects.toThrow("element don't exist")
  });
});
