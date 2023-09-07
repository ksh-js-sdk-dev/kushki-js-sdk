import { Kushki } from "Kushki";
import { Card, CardOptions, Field } from "./index.ts";
import KushkiHostedFields from "libs/HostedField.ts";
import { InputModelEnum } from "infrastructure/InputModel.enum.ts";
import { CONTAINER } from "infrastructure/Container";
import { IDENTIFIERS } from "src/constant/Identifiers";

jest.mock("../../libs/HostedField.ts", () =>
  jest
    .fn()
    .mockImplementation(() => ({ render: jest.fn(), updateProps: jest.fn() }))
);

describe("Card test", () => {
  let kushki: Kushki;
  let options: CardOptions;
  let field: Field;

  afterEach(() => {
    CONTAINER.restore();
  });

  beforeEach(async () => {
    kushki = await Kushki.init({ publicCredentialId: "1234" });

    CONTAINER.snapshot();

    const mockGateway = {
      requestBinInfo: () => {
        return {
          bank: "Some Bank",
          brand: "visa",
          cardType: "Credit"
        };
      }
    };

    CONTAINER.unbind(IDENTIFIERS.KushkiGateway);
    CONTAINER.bind(IDENTIFIERS.KushkiGateway).toConstantValue(mockGateway);

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
        subtotalIva0: 10,
        subtotalIva: 10,
        iva: 1
      },
      currency: "USD"
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
      fieldType: "cardNumber",
      selector: "id_test_not_created"
    };

    options = {
      fields: {
        cardHolderName: field,
        cardNumber: field,
        cvv: field,
        expirationDate: field
      },
      currency: "USD"
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
      },
      currency: "USD"
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
      },
      currency: "USD"
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
      },
      currency: "USD"
    };

    await Card.initCardToken(kushki, options);

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

    KushkiHostedFields.mock.calls[0][0].handleOnChange(
      "cardNumber",
      "42424242424242"
    );

    expect(typeof KushkiHostedFields.mock.calls[0][0].handleOnChange).toEqual(
      "function"
    );
  });

  it("When requestBinInfo throws an error", async () => {
    const mockGateway = {
      requestBinInfo: new Error("")
    };

    CONTAINER.unbind(IDENTIFIERS.KushkiGateway);
    CONTAINER.bind(IDENTIFIERS.KushkiGateway).toConstantValue(mockGateway);

    try {
      await Card.initCardToken(kushki, options);

      KushkiHostedFields.mock.calls[0][0].handleOnChange(
        "cardNumber",
        "42424242424242"
      );
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  describe("requestToken - Test", () => {
    const tokenMock = "1234567890";

    beforeEach(() => {
      const mockGateway = {
        requestToken: () => ({
          token: tokenMock
        }),
        requestCreateSubscriptionToken: () => ({
          token: tokenMock
        })
      };
      CONTAINER.unbind(IDENTIFIERS.KushkiGateway);
      CONTAINER.bind(IDENTIFIERS.KushkiGateway).toConstantValue(mockGateway);
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
      delete options.amount;

      const cardInstance = await Card.initCardToken(kushki, options);

      mockInputFields();

      const response = await cardInstance.requestToken();

      expect(response.token).toEqual(tokenMock);
    });
  });

  describe("onFieldValidity - Test", () => {
    const mockInputsFields = (): void => {
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

    it("when call onFieldValidity, should set successful input value", async () => {
      const cardInstance = await Card.initCardToken(kushki, options);

      mockInputsFields();

      cardInstance.onFieldValidity((e) => {
        e;
      });

      expect(cardInstance["inputValues"].cardholderName!.value).toEqual("test");
    });

    it("when call handleOnChange should call handleOnValidity successful", async () => {
      const cardInstance = await Card.initCardToken(kushki, options);

      KushkiHostedFields.mock.calls[0][0].handleOnChange(
        "cardholderName",
        "test"
      );
      KushkiHostedFields.mock.calls[0][0].handleOnValidity(
        InputModelEnum.CARDHOLDER_NAME,
        {
          isValid: false
        }
      );

      expect(cardInstance["inputValues"].cardholderName!.value).toEqual("test");

      expect(
        typeof KushkiHostedFields.mock.calls[0][0].handleOnValidity
      ).toEqual("function");
    });
  });
});
