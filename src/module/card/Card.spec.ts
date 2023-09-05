import { Kushki } from "Kushki";
import { Card, CardOptions, Field } from "./index.ts";
import KushkiHostedFields from "libs/HostedField.ts";
import { InputModelEnum } from "infrastructure/InputModel.enum.ts";
import * as KushkiGateway from "gateway/KushkiGateway.ts";

jest.mock("../../libs/HostedField.ts", () =>
  jest
    .fn()
    .mockImplementation(() => ({ render: jest.fn(), updateProps: jest.fn() }))
);

describe("Card test", () => {
  let kushki: Kushki;
  let options: CardOptions;
  let field: Field;
  let binInfoMock: jest.SpyInstance;

  beforeEach(async () => {
    kushki = await Kushki.init({ publicCredentialId: "1234" });
    binInfoMock = jest.spyOn(KushkiGateway, "requestBinInfo");

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
      },
      amount: {
        currency: "USD",
        subtotalIva: 10,
        subtotalIva0: 10,
        iva: 1
      }
    };

    document.body.innerHTML = '<div id="id_test">my div</div>';
    KushkiHostedFields.mockClear();
  });

  it("it should return render inputs, execute events and must change input value", async () => {
    const cardInstance = await Card.initCardToken(kushki, options);

    KushkiHostedFields.mock.calls[0][0].handleOnChange(
      InputModelEnum.CARDHOLDER_NAME,
      "test"
    );
    KushkiHostedFields.mock.calls[0][0].handleOnFocus(
      InputModelEnum.CARDHOLDER_NAME,
      "test"
    );
    KushkiHostedFields.mock.calls[0][0].handleOnBlur(
      InputModelEnum.CARDHOLDER_NAME,
      "test"
    );

    expect(cardInstance["inputValues"]).toHaveProperty(
      InputModelEnum.CARDHOLDER_NAME
    );
    expect(cardInstance["inputValues"].cardholderName!.value).toEqual("test");
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

    binInfoMock.mockResolvedValue({ brand: "Visa" });

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

    binInfoMock.mockRejectedValue({
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

  describe("requestToken - Test", () => {
    let getCardTokenMock: jest.SpyInstance;
    let getCardSubscriptionTokenMock: jest.SpyInstance;
    const tokenMock = "1234567890";

    beforeEach(() => {
      getCardTokenMock = jest.spyOn(KushkiGateway, "requestToken");
      getCardSubscriptionTokenMock = jest.spyOn(
        KushkiGateway,
        "requestCreateSubscriptionToken"
      );
      getCardTokenMock.mockResolvedValue({ token: tokenMock });
      getCardSubscriptionTokenMock.mockResolvedValue({ token: tokenMock });

    });

    const mockInputFields = () => {
      KushkiHostedFields.mock.calls[0][0].handleOnChange(
        InputModelEnum.CARDHOLDER_NAME,
        "test"
      );
      KushkiHostedFields.mock.calls[0][0].handleOnChange(
        InputModelEnum.CARD_NUMBER,
        "4242 4242 4242 4242"
      );
      KushkiHostedFields.mock.calls[0][0].handleOnChange(
        InputModelEnum.EXPIRATION_DATE,
        "12/34"
      );
      KushkiHostedFields.mock.calls[0][0].handleOnChange(
        InputModelEnum.CVV,
        "123"
      );
    };

    it("it should execute Card token request and return token", async () => {
      const cardInstance = await Card.initCardToken(kushki, options);

      mockInputFields();

      const response = await cardInstance.requestToken();

      expect(response.token).toEqual(tokenMock);
    });

    it("it should execute Card Subscription token request and return token", async () => {
      options.isSubscription = true;

      const cardInstance = await Card.initCardToken(kushki, options);

      mockInputFields();

      const response = await cardInstance.requestToken();

      expect(response.token).toEqual(tokenMock);
    });
  });
});
