import { Kushki } from "Kushki";
import { Card, CardOptions, Field } from "./index.ts";
import KushkiHostedFields from "libs/HostedField.ts";
import { InputModelEnum } from "infrastructure/InputModel.enum.ts";
import * as requestBinInfo from "gateway/KushkiGateway.ts";

jest.mock("../../libs/HostedField.ts", () =>
  jest
    .fn()
    .mockImplementation(() => ({ render: jest.fn(), updateProps: jest.fn() }))
);

describe("Card test", () => {
  let kushki: Kushki;
  let options: CardOptions;
  let field: Field;
  let binInfo: jest.SpyInstance;

  beforeEach(async () => {
    kushki = await Kushki.init({ publicCredentialId: "1234" });
    binInfo = await jest.spyOn(requestBinInfo, "requestBinInfo");

    field = {
      fieldType: InputModelEnum.CARD_NUMBER,
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

    document.body.innerHTML = '<div id="id_test">my div</div>';
    KushkiHostedFields.mockClear();
  });

  it("it should return base URL of uat when Card has property inTest equal to true", async () => {
    const cardInstance = await Card.initCardToken(kushki, options);

    KushkiHostedFields.mock.calls[0][0].handleOnChange(
      "cardholderName",
      "test"
    );
    KushkiHostedFields.mock.calls[0][0].handleOnFocus("cardholderName", "test");
    KushkiHostedFields.mock.calls[0][0].handleOnBlur("cardholderName", "test");

    const token = await cardInstance.requestToken();

    // TODO: refactor test when call to API is finished, mock gateway and check data of request
    expect(token).toEqual({
      token: "replace by token response"
    });
  });

  it("should set handleOnChange as callback in KushkiHostedFields", async () => {
    await Card.initCardToken(kushki, options);

    expect(KushkiHostedFields).toHaveBeenCalledTimes(4);
    expect(KushkiHostedFields.mock.calls[0][0].selector).toEqual(
      field.selector
    );
    expect(typeof KushkiHostedFields.mock.calls[0][0].handleOnChange).toEqual(
      "function"
    );
    expect(typeof KushkiHostedFields.mock.calls[0][0].handleOnFocus).toEqual(
      "function"
    );
  });

  it("should throw error when element not exist in mehtod initCardToken", async () => {
    field = {
      fieldType: "",
      selector: "id_test_not_created"
    };

    options = {
      fields: {
        cardHolderName: field,
        cardNumber: field,
        cvv: field,
        expirationDate: field
      }
    };

    await expect(Card.initCardToken(kushki, options)).rejects.toThrow(
      "element don't exist"
    );
  });

  it("should set handleOnChange as callback in KushkiHostedField when is cardholderName", async () => {
    field = {
      fieldType: InputModelEnum.CARDHOLDER_NAME,
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
    await Card.initCardToken(kushki, options);

    KushkiHostedFields.mock.calls[0][0].handleOnChange(
      "cardholderName",
      "test"
    );

    expect(typeof KushkiHostedFields.mock.calls[0][0].handleOnChange).toEqual(
      "function"
    );
  });

  it("should set onChageCardNumber as callback in KushkiHostedField when is cardNumber", async () => {
    field = {
      fieldType: InputModelEnum.CARD_NUMBER,
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
    await Card.initCardToken(kushki, options);

    KushkiHostedFields.mock.calls[0][0].handleOnChange("cardNumber", "4242");

    expect(typeof KushkiHostedFields.mock.calls[0][0].handleOnChange).toEqual(
      "function"
    );
  });

  it("if cardNumber have max eight digitals then it should called handleSetCardNumber but requestBinInfo is Success", async () => {
    field = {
      fieldType: InputModelEnum.CARD_NUMBER,
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
    await Card.initCardToken(kushki, options);

    binInfo.mockResolvedValue({ brand: "Visa" });

    KushkiHostedFields.mock.calls[0][0].handleOnChange(
      "cardNumber",
      "42424242424242"
    );

    expect(typeof KushkiHostedFields.mock.calls[0][0].handleOnChange).toEqual(
      "function"
    );
  });

  it("if cardNumber have max eight digitals then it should called handleSetCardNumber but requestBinInfo is Error", async () => {
    await Card.initCardToken(kushki, options);

    binInfo.mockRejectedValue({
      code: "DFR029",
      message: "Bin de tarjeta inválido"
    });

    KushkiHostedFields.mock.calls[0][0].handleOnChange(
      "cardNumber",
      "42424242424242"
    );

    expect(typeof KushkiHostedFields.mock.calls[0][0].handleOnChange).toEqual(
      "function"
    );
  });
});
