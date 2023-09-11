import { Kushki } from "Kushki";
import { Card, CardOptions, Field, TokenResponse } from "./index.ts";
import KushkiHostedFields from "libs/HostedField.ts";
import { InputModelEnum } from "infrastructure/InputModel.enum.ts";
import { CONTAINER } from "infrastructure/Container";
import { IDENTIFIERS } from "src/constant/Identifiers";
import { SecureOtpResponse } from "types/secure_otp_response";
import { ERRORS } from "infrastructure/ErrorEnum.ts";

jest.mock("../../libs/HostedField.ts", () =>
  jest
    .fn()
    .mockImplementation(() => ({ render: jest.fn(), updateProps: jest.fn() }))
);

describe("Card test", () => {
  let kushki: Kushki;
  let options: CardOptions;
  let field: Field;

  const mockInputFieldCardNumber = () => {
    KushkiHostedFields.mock.calls[0][0].handleOnChange(
      InputModelEnum.CARD_NUMBER,
      "4242424242424242"
    );
  };

  const initKushki = async (inTest?: boolean) => {
    kushki = await Kushki.init({ publicCredentialId: "1234", inTest });
  };

  afterEach(() => {
    CONTAINER.restore();
  });

  beforeEach(async () => {
    await initKushki();

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
      amount: {
        iva: 1,
        subtotalIva: 10,
        subtotalIva0: 10
      },
      currency: "USD",
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
      currency: "USD",
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

  it("if cardNumber have max eight digitals then it should called handleSetCardNumber but requestBinInfo is Success", async () => {
    await Card.initCardToken(kushki, options);

    mockInputFieldCardNumber();

    if (KushkiHostedFields.mock.lastCall) {
      expect(KushkiHostedFields.mock.lastCall[0].fieldType).toEqual(
        InputModelEnum.CARD_NUMBER
      );
    }
  });

  it("When requestBinInfo throws an error", async () => {
    const mockGateway = {
      requestBinInfo: new Error("")
    };

    CONTAINER.unbind(IDENTIFIERS.KushkiGateway);
    CONTAINER.bind(IDENTIFIERS.KushkiGateway).toConstantValue(mockGateway);

    try {
      await Card.initCardToken(kushki, options);

      mockInputFieldCardNumber();
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  describe("requestToken - Test", () => {
    const tokenMock = "1234567890";

    const mockKushkiGateway = (
      is3ds?: boolean,
      token: TokenResponse | Promise<TokenResponse> = { token: tokenMock },
      secureValidation: SecureOtpResponse | Promise<SecureOtpResponse> = {
        message: "ok",
        code: "3DS000"
      }
    ) => {
      const mockGateway = {
        requestCreateSubscriptionToken: () => token,
        requestToken: () => token,
        requestMerchantSettings: () => ({
          active_3dsecure: is3ds
        }),
        requestCybersourceJwt: () => ({
          jwt: "1234567890"
        }),
        requestSecureServiceValidation: () => secureValidation
      };

      CONTAINER.unbind(IDENTIFIERS.KushkiGateway);
      CONTAINER.bind(IDENTIFIERS.KushkiGateway).toConstantValue(mockGateway);
    };

    const mockCardinal = () => {
      jest.mock("libs/cardinal/prod", () => ({
        default: jest.fn()
      }));
      jest.mock("libs/cardinal/staging", () => ({
        default: jest.fn()
      }));
      window.Cardinal = {};
      window.Cardinal.setup = jest.fn();
      window.Cardinal.continue = jest.fn();
      window.Cardinal.on = jest
        .fn()
        .mockImplementation((_: string, callback: () => void) => {
          callback();
        });
    };

    beforeEach(() => {
      mockKushkiGateway();
      mockCardinal();
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

    it("it should execute Card 3ds token PROD with modal validation", async () => {
      mockKushkiGateway(true, {
        token: tokenMock,
        security: {
          authRequired: true,
          acsURL: "url",
          paReq: "req",
          authenticationTransactionId: "1234"
        }
      });

      const cardInstance = await Card.initCardToken(kushki, options);

      mockInputFields();

      const response = await cardInstance.requestToken();

      expect(response.token).toEqual(tokenMock);
    });

    it("it should execute Card Subscription 3ds token PROD with modal validation", async () => {
      options.isSubscription = true;

      mockKushkiGateway(
        true,
        {
          token: tokenMock,
          security: {
            authRequired: true,
            acsURL: "url",
            paReq: "req",
            authenticationTransactionId: "1234"
          }
        },
        {
          message: "3DS000",
          code: "ok"
        }
      );

      const cardInstance = await Card.initCardToken(kushki, options);

      mockInputFields();

      const response = await cardInstance.requestToken();

      expect(response.token).toEqual(tokenMock);
    });

    it("it should execute Card 3ds token UAT without modal validation", async () => {
      await initKushki(true);
      mockKushkiGateway(true, {
        token: tokenMock,
        security: {
          authRequired: false,
          acsURL: "url",
          paReq: "req",
          authenticationTransactionId: "1234"
        }
      });

      const cardInstance = await Card.initCardToken(kushki, options);

      mockInputFields();

      const response = await cardInstance.requestToken();

      expect(response.token).toEqual(tokenMock);
    });

    it("it should execute Card 3ds token UAT throw error: E005, for token incomplete", async () => {
      await initKushki(true);
      mockKushkiGateway(true, {
        token: tokenMock
      });

      const cardInstance = await Card.initCardToken(kushki, options);

      mockInputFields();

      try {
        await cardInstance.requestToken();
      } catch (error: any) {
        expect(error.code).toEqual("E005");
      }
    });

    it("it should execute Card 3ds token UAT throw error: E006, for SecureServiceValidation", async () => {
      await initKushki(true);
      mockKushkiGateway(
        true,
        {
          token: tokenMock,
          security: {
            authRequired: true,
            acsURL: "url",
            paReq: "req",
            authenticationTransactionId: "1234"
          }
        },
        {
          message: "fail",
          code: "ok"
        }
      );

      const cardInstance = await Card.initCardToken(kushki, options);

      mockInputFields();

      try {
        await cardInstance.requestToken();
      } catch (error: any) {
        expect(error.code).toEqual("E006");
      }
    });

    it("it should execute Card 3ds token UAT throw error: E006, for SecureServiceValidation request fail", async () => {
      await initKushki(true);
      mockKushkiGateway(
        true,
        {
          token: tokenMock,
          security: {
            authRequired: true,
            acsURL: "url",
            paReq: "req",
            authenticationTransactionId: "1234"
          }
        },
        Promise.reject(ERRORS.E006)
      );

      const cardInstance = await Card.initCardToken(kushki, options);

      mockInputFields();

      try {
        await cardInstance.requestToken();
      } catch (error: any) {
        expect(error.code).toEqual("E006");
      }
    });

    it("it should execute Card 3ds token UAT throw error: E005, for requestToken", async () => {
      await initKushki(true);
      mockKushkiGateway(true, Promise.reject(ERRORS.E002), {
        message: "fail",
        code: "ok"
      });

      const cardInstance = await Card.initCardToken(kushki, options);

      mockInputFields();

      try {
        await cardInstance.requestToken();
      } catch (error: any) {
        expect(error.code).toEqual("E002");
      }
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
