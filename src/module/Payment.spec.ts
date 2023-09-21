import { Kushki } from "Kushki";
import { CardOptions, Field, Payment, TokenResponse } from "./index.ts";
import KushkiHostedFields from "libs/HostedField.ts";
import { InputModelEnum } from "infrastructure/InputModel.enum.ts";
import { CONTAINER } from "infrastructure/Container.ts";
import { IDENTIFIERS } from "src/constant/Identifiers.ts";
import { SecureOtpResponse } from "types/secure_otp_response";
import { ERRORS } from "infrastructure/ErrorEnum.ts";
import { FieldTypeEnum } from "types/card_options";
import { KushkiCardinalSandbox } from "@kushki/cardinal-sandbox-js";

jest.mock("../libs/HostedField.ts", () =>
  jest.fn().mockImplementation(() => ({
    hide: jest.fn().mockResolvedValue({}),
    render: jest.fn(),
    resize: jest.fn().mockResolvedValue({}),
    show: jest.fn().mockResolvedValue({}),
    updateProps: jest.fn()
  }))
);

describe("Payment test", () => {
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
    kushki = await Kushki.init({ inTest, publicCredentialId: "1234" });
  };

  afterEach(() => {
    KushkiHostedFields.mockImplementation(() => ({
      hide: jest.fn().mockResolvedValue({}),
      render: jest.fn(),
      resize: jest.fn().mockResolvedValue({}),
      show: jest.fn().mockResolvedValue({}),
      updateProps: jest.fn()
    }));
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

    document.body.innerHTML = "<div id='id_test'>my div</div>";
    KushkiHostedFields.mockClear();
  });

  it("it should return base URL of uat when Payment has property inTest equal to true", async () => {
    const cardInstance = await Payment.initCardToken(kushki, options);

    KushkiHostedFields.mock.calls[0][0].handleOnChange(
      "cardholderName",
      "test"
    );
    KushkiHostedFields.mock.calls[0][0].handleOnFocus("cardholderName");
    KushkiHostedFields.mock.calls[0][0].handleOnBlur("cardholderName");

    expect(cardInstance["inputValues"].cardholderName!.value).toEqual("test");
  });

  it("should set handleOnChange as callback in KushkiHostedFields", async () => {
    await Payment.initCardToken(kushki, options);

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

  it("should render deferred input", async () => {
    options.fields.deferred = {
      fieldType: InputModelEnum.DEFERRED,
      selector: "id_test"
    };

    const cardInstance = await Payment.initCardToken(kushki, options);

    const deferredValue = {
      creditType: "all",
      graceMonths: 0,
      isDeferred: true,
      months: 0
    };

    KushkiHostedFields.mock.calls[4][0].handleOnChange(deferredValue);
    KushkiHostedFields.mock.calls[4][0].handleOnBlur(deferredValue);
    KushkiHostedFields.mock.calls[4][0].handleOnFocus(deferredValue);

    expect(cardInstance["inputValues"].deferred!.value).toEqual(deferredValue);
  });

  it("should render deferred input but hide input failed", () => {
    KushkiHostedFields.mockImplementation(() => ({
      hide: jest.fn().mockRejectedValue("throw exception"),
      render: jest.fn(),
      resize: jest.fn().mockResolvedValue({}),
      updateProps: jest.fn()
    }));

    options.fields.deferred = {
      fieldType: InputModelEnum.DEFERRED,
      selector: "id_test"
    };

    Payment.initCardToken(kushki, options).catch((error) =>
      expect(error).toEqual("throw exception")
    );
  });

  it("should render deferred input but resize input failed", () => {
    KushkiHostedFields.mockImplementation(() => ({
      hide: jest.fn().mockResolvedValue({}),
      render: jest.fn(),
      resize: jest.fn().mockRejectedValue("throw exception"),
      updateProps: jest.fn()
    }));

    options.fields.deferred = {
      fieldType: InputModelEnum.DEFERRED,
      selector: "id_test"
    };

    Payment.initCardToken(kushki, options).catch((error) =>
      expect(error).toEqual("throw exception")
    );
  });

  it("should throw error when element not exist in method initCardToken", async () => {
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

    await expect(Payment.initCardToken(kushki, options)).rejects.toThrow(
      "element don't exist"
    );
  });

  it("if cardNumber have max eight digitals then it should called handleSetCardNumber but requestBinInfo is Success", async () => {
    await Payment.initCardToken(kushki, options);

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
      await Payment.initCardToken(kushki, options);

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
        code: "3DS000",
        message: "ok"
      },
      isSandboxEnabled: boolean = false
    ) => {
      const mockGateway = {
        requestCreateSubscriptionToken: () => token,
        requestCybersourceJwt: () => ({
          jwt: "1234567890"
        }),
        requestMerchantSettings: () => ({
          active_3dsecure: is3ds,
          sandboxEnable: isSandboxEnabled
        }),
        requestSecureServiceValidation: () => secureValidation,
        requestToken: () => token
      };

      const mockSiftService = {
        createSiftScienceSession: () => ({ sessionId: "abc", userId: "123" })
      };

      CONTAINER.unbind(IDENTIFIERS.KushkiGateway);
      CONTAINER.bind(IDENTIFIERS.KushkiGateway).toConstantValue(mockGateway);

      CONTAINER.unbind(IDENTIFIERS.SiftScienceService);
      CONTAINER.bind(IDENTIFIERS.SiftScienceService).toConstantValue(
        mockSiftService
      );
    };

    const mockCardinal = (complete: any = undefined) => {
      jest.mock("libs/cardinal/prod", () => ({
        default: jest.fn()
      }));
      jest.mock("libs/cardinal/staging", () => ({
        default: jest.fn()
      }));
      window.Cardinal = {};
      window.Cardinal.off = jest.fn();
      window.Cardinal.setup = jest.fn();
      window.Cardinal.continue = jest.fn();
      window.Cardinal.on = jest
        .fn()
        .mockImplementation((_: string, callback: () => void) => {
          callback();
        });
      window.Cardinal.complete = complete;
      window.Cardinal.trigger = jest.fn();
    };

    const mockSandbox = (isError?: boolean) => {
      jest.spyOn(KushkiCardinalSandbox, "init");
      jest.spyOn(KushkiCardinalSandbox, "continue");
      jest
        .spyOn(KushkiCardinalSandbox, "on")
        .mockImplementation(
          (_: string, callback: (isErrorFlow?: boolean) => void) => {
            callback(isError);
          }
        );
    };

    beforeEach(() => {
      mockKushkiGateway();
      mockCardinal();
      mockSandbox();
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

    const mockValidityInputs = () => {
      KushkiHostedFields.mock.calls[0][0].handleOnValidity(
        InputModelEnum.CARDHOLDER_NAME,
        {
          isValid: true
        }
      );
      KushkiHostedFields.mock.calls[0][0].handleOnValidity(InputModelEnum.CVV, {
        isValid: true
      });
      KushkiHostedFields.mock.calls[0][0].handleOnValidity(
        InputModelEnum.EXPIRATION_DATE,
        {
          isValid: true
        }
      );
      KushkiHostedFields.mock.calls[0][0].handleOnValidity(
        InputModelEnum.CARD_NUMBER,
        {
          isValid: true
        }
      );
    };

    it("it should execute Payment token request and return token", async () => {
      const cardInstance = await Payment.initCardToken(kushki, options);

      mockValidityInputs();
      mockInputFields();

      const response = await cardInstance.requestToken();

      expect(response.token).toEqual(tokenMock);
    });

    it("it should execute Payment token request but deferred values are incorrect", async () => {
      options.fields.deferred = {
        fieldType: InputModelEnum.DEFERRED,
        selector: "id_test"
      };

      const cardInstance = await Payment.initCardToken(kushki, options);

      mockValidityInputs();
      mockInputFields();

      KushkiHostedFields.mock.calls[4][0].handleOnChange("incorrect value");

      const response = await cardInstance.requestToken();

      expect(KushkiHostedFields.mock.calls[4][0].fieldType).toEqual(
        InputModelEnum.DEFERRED
      );
      expect(response.token).toEqual(tokenMock);
    });

    it("it should execute Payment token request but deferred values are correct", async () => {
      options.fields.deferred = {
        fieldType: InputModelEnum.DEFERRED,
        selector: "id_test"
      };

      const cardInstance = await Payment.initCardToken(kushki, options);

      const deferredValue = {
        creditType: "all",
        graceMonths: 0,
        isDeferred: true,
        months: 0
      };

      mockValidityInputs();
      mockInputFields();

      KushkiHostedFields.mock.calls[4][0].handleOnChange(deferredValue);

      const response = await cardInstance.requestToken();

      expect(KushkiHostedFields.mock.calls[4][0].fieldType).toEqual(
        InputModelEnum.DEFERRED
      );
      expect(cardInstance["inputValues"].deferred!.value).toEqual(
        deferredValue
      );
      expect(response.token).toEqual(tokenMock);
    });

    it("it should execute Payment Subscription token request and return token", async () => {
      options.isSubscription = true;
      delete options.amount;

      const cardInstance = await Payment.initCardToken(kushki, options);

      mockValidityInputs();
      mockInputFields();

      const response = await cardInstance.requestToken();

      expect(response.token).toEqual(tokenMock);
    });

    it("it should execute Payment 3ds token PROD with modal validation", async () => {
      mockKushkiGateway(true, {
        security: {
          acsURL: "url",
          authenticationTransactionId: "1234",
          authRequired: true,
          paReq: "req",
          specificationVersion: "2.0.1"
        },
        token: tokenMock
      });

      const cardInstance = await Payment.initCardToken(kushki, options);

      mockValidityInputs();
      mockInputFields();

      const response = await cardInstance.requestToken();

      expect(response.token).toEqual(tokenMock);
    });

    it("it should execute Payment Subscription 3ds token PROD with modal validation", async () => {
      options.isSubscription = true;

      mockKushkiGateway(
        true,
        {
          security: {
            acsURL: "url",
            authenticationTransactionId: "1234",
            authRequired: true,
            paReq: "req",
            specificationVersion: "2.0.1"
          },
          token: tokenMock
        },
        {
          code: "ok",
          message: "3DS000"
        }
      );

      const cardInstance = await Payment.initCardToken(kushki, options);

      mockValidityInputs();
      mockInputFields();

      const response = await cardInstance.requestToken();

      expect(response.token).toEqual(tokenMock);
    });

    it("it should execute Payment 3ds token UAT without modal validation", async () => {
      await initKushki(true);
      mockCardinal(jest.fn());
      mockKushkiGateway(true, {
        security: {
          acsURL: "url",
          authenticationTransactionId: "1234",
          authRequired: false,
          paReq: "req"
        },
        token: tokenMock
      });

      const cardInstance = await Payment.initCardToken(kushki, options);

      mockValidityInputs();
      mockInputFields();

      const response = await cardInstance.requestToken();

      expect(response.token).toEqual(tokenMock);
    });

    it("it should execute Payment 3ds token PROD for retry", async () => {
      mockCardinal(jest.fn().mockReturnValue({}));
      mockKushkiGateway(true, {
        security: {
          acsURL: "url",
          authenticationTransactionId: "1234",
          authRequired: true,
          paReq: "req",
          specificationVersion: "2.0.1"
        },
        token: tokenMock
      });

      const cardInstance = await Payment.initCardToken(kushki, options);

      mockValidityInputs();
      mockInputFields();

      const response = await cardInstance.requestToken();

      expect(response.token).toEqual(tokenMock);
    });

    it("it should execute Payment 3ds token UAT throw error: E005, for token incomplete", async () => {
      await initKushki(true);
      mockKushkiGateway(true, {
        security: {
          authenticationTransactionId: "1234",
          authRequired: true,
          paReq: "req"
        },
        token: tokenMock
      });

      const cardInstance = await Payment.initCardToken(kushki, options);

      mockValidityInputs();
      mockInputFields();

      try {
        await cardInstance.requestToken();
      } catch (error: any) {
        expect(error.code).toEqual("E005");
      }
    });

    it("it should execute Payment token UAT with error: E007, for invalid field", async () => {
      const cardInstance = await Payment.initCardToken(kushki, options);

      mockValidityInputs();
      KushkiHostedFields.mock.calls[0][0].handleOnValidity(
        InputModelEnum.CARDHOLDER_NAME,
        {
          isValid: false
        }
      );
      mockInputFields();

      try {
        await cardInstance.requestToken();
      } catch (error: any) {
        expect(error.code).toEqual("E007");
      }
    });

    it("it should execute Payment 3ds token UAT throw error: E006, for SecureServiceValidation", async () => {
      await initKushki(true);
      mockKushkiGateway(
        true,
        {
          security: {
            acsURL: "url",
            authenticationTransactionId: "1234",
            authRequired: true,
            paReq: "req",
            specificationVersion: "2.0.1"
          },
          token: tokenMock
        },
        {
          code: "ok",
          message: "fail"
        }
      );

      const cardInstance = await Payment.initCardToken(kushki, options);

      mockValidityInputs();
      mockInputFields();

      try {
        await cardInstance.requestToken();
      } catch (error: any) {
        expect(error.code).toEqual("E006");
      }
    });

    it("it should execute Payment 3ds token UAT throw error: E006, for SecureServiceValidation request fail", async () => {
      await initKushki(true);
      mockKushkiGateway(
        true,
        {
          security: {
            acsURL: "url",
            authenticationTransactionId: "1234",
            authRequired: true,
            paReq: "req",
            specificationVersion: "2.0.1"
          },
          token: tokenMock
        },
        Promise.reject(ERRORS.E006)
      );

      const cardInstance = await Payment.initCardToken(kushki, options);

      mockValidityInputs();
      mockInputFields();

      try {
        await cardInstance.requestToken();
      } catch (error: any) {
        expect(error.code).toEqual("E006");
      }
    });

    it("it should execute Payment 3ds token UAT throw error: E005, for requestToken", async () => {
      await initKushki(true);
      mockKushkiGateway(true, Promise.reject(ERRORS.E002), {
        code: "ok",
        message: "fail"
      });

      const cardInstance = await Payment.initCardToken(kushki, options);

      mockValidityInputs();
      mockInputFields();

      try {
        await cardInstance.requestToken();
      } catch (error: any) {
        expect(error.code).toEqual("E002");
      }
    });

    it("it should execute Payment 3ds SANDBOX token with modal validation", async () => {
      mockKushkiGateway(
        true,
        {
          security: {
            acsURL: "url",
            authenticationTransactionId: "1234",
            authRequired: true,
            paReq: "req",
            specificationVersion: "2.0.1"
          },
          token: tokenMock
        },
        {
          code: "3DS000",
          message: "ok"
        },
        true
      );

      const cardInstance = await Payment.initCardToken(kushki, options);

      mockValidityInputs();
      mockInputFields();

      const response = await cardInstance.requestToken();

      expect(response.token).toEqual(tokenMock);
    });

    it("it should execute Payment 3ds SANDBOX token with ERROR on payment validation", async () => {
      mockSandbox(true);
      mockKushkiGateway(
        true,
        {
          security: {
            acsURL: "url.com",
            authenticationTransactionId: "1234",
            authRequired: true,
            paReq: "req",
            specificationVersion: "2.0.1"
          },
          token: tokenMock
        },
        {
          code: "3DS000",
          message: "ok"
        },
        true
      );

      const cardInstance = await Payment.initCardToken(kushki, options);

      mockValidityInputs();
      mockInputFields();

      try {
        await cardInstance.requestToken();
      } catch (error: any) {
        expect(error.code).toEqual("E005");
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
      const cardInstance = await Payment.initCardToken(kushki, options);

      mockInputsFields();

      cardInstance.onFieldValidity((e) => {
        e;
      });

      expect(cardInstance["inputValues"].cardholderName!.value).toEqual("test");
    });

    it("when call onFieldFocus, should set successful input value", async () => {
      const cardInstance = await Payment.initCardToken(kushki, options);

      mockInputsFields();

      cardInstance.onFieldFocus((e) => {
        e;
      });

      expect(cardInstance["inputValues"].cardholderName!.value).toEqual("test");
    });

    it("when call handleOnChange should call handleOnValidity successful", async () => {
      const cardInstance = await Payment.initCardToken(kushki, options);

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

  describe("onFieldBlur - onFieldSubmit - Test", () => {
    const fieldType = "cardholderName";
    let addEventListenerSpy: jest.SpyInstance;
    let dispatchEventSpy: jest.SpyInstance;
    const mockFieldEvent = {
      fields: {
        cardholderName: {
          errorType: "empty",
          isValid: false
        }
      },
      isFormValid: false,
      triggeredBy: "cardholderName"
    };

    beforeEach(() => {
      addEventListenerSpy = jest.spyOn(window, "addEventListener");
      dispatchEventSpy = jest.spyOn(window, "dispatchEvent");
    });

    afterEach(() => {
      addEventListenerSpy.mockRestore();
      dispatchEventSpy.mockRestore();
    });

    it("onFieldBlur should add event listener correctly", async () => {
      const mockEventCallback = jest.fn();
      const cardInstance = await Payment.initCardToken(kushki, options);

      cardInstance.onFieldBlur(mockEventCallback, fieldType);

      const customEvent = new CustomEvent("fieldBlurcardholderName", {
        detail: mockFieldEvent
      });

      window.dispatchEvent(customEvent);

      expect(addEventListenerSpy).toHaveBeenCalled();
      expect(window.addEventListener).toHaveBeenCalledWith(
        "fieldBlurcardholderName",
        expect.any(Function)
      );
    });

    it("onFieldSubmit with fieldType should add event listener correctly", async () => {
      const mockEventCallback = jest.fn();
      const cardInstance = await Payment.initCardToken(kushki, options);

      cardInstance.onFieldSubmit(mockEventCallback, fieldType);

      const customEvent = new CustomEvent("fieldSubmitcardholderName", {
        detail: mockFieldEvent
      });

      window.dispatchEvent(customEvent);

      expect(addEventListenerSpy).toHaveBeenCalled();
      expect(window.addEventListener).toHaveBeenCalledWith(
        "fieldSubmitcardholderName",
        expect.any(Function)
      );
    });

    it("onFieldSubmit with error fieldType should add event listener correctly", async () => {
      const mockEventCallback = jest.fn();
      const cardInstance = await Payment.initCardToken(kushki, options);

      cardInstance.onFieldSubmit(
        mockEventCallback,
        "fieldError" as FieldTypeEnum
      );

      const customEvent = new CustomEvent("fieldSubmitfieldError", {
        detail: mockFieldEvent
      });

      window.dispatchEvent(customEvent);

      expect(window.addEventListener).toHaveBeenCalledWith(
        "fieldSubmitfieldError",
        expect.any(Function)
      );
    });

    it("should create custom event when called to handleOnKeyUp", async () => {
      await Payment.initCardToken(kushki, options);

      KushkiHostedFields.mock.calls[0][0].handleOnKeyUp(
        InputModelEnum.CARDHOLDER_NAME
      );

      expect(typeof KushkiHostedFields.mock.calls[0][0].handleOnKeyUp).toEqual(
        "function"
      );
      expect(dispatchEventSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe("reset", () => {
    it("resets the hosted field with valid fieldType cardNumber", async () => {
      const cardInstance = await Payment.initCardToken(kushki, options);
      const fieldType = InputModelEnum.CARD_NUMBER;

      await cardInstance.reset(fieldType);

      expect(
        cardInstance["inputValues"].cardNumber!.hostedField!.updateProps
      ).toBeCalled();
    });

    it("rejects with ERRORS.E009 for invalid fieldType", async () => {
      const cardInstance = await Payment.initCardToken(kushki, options);
      const fieldType = "InvalidFieldType";

      cardInstance
        .reset(fieldType as FieldTypeEnum)
        .catch((error) => expect(error.code).toEqual("E009"));
    });
  });

  describe("focus", () => {
    it("focus the hosted field with valid fieldType cardNumber", async () => {
      const cardInstance = await Payment.initCardToken(kushki, options);
      const fieldType = InputModelEnum.CARD_NUMBER;

      await cardInstance.focus(fieldType);

      expect(
        cardInstance["inputValues"].cardNumber!.hostedField!.updateProps
      ).toBeCalled();
    });

    it("rejects with ERRORS.E008 for invalid fieldType", async () => {
      const cardInstance = await Payment.initCardToken(kushki, options);
      const fieldType = "InvalidFieldType";

      cardInstance
        .focus(fieldType as FieldTypeEnum)
        .catch((error) => expect(error.code).toEqual("E008"));
    });
  });
});
