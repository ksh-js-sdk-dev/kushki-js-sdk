import { IKushki, init } from "Kushki";
import {
  CardOptions,
  CardTokenResponse,
  Field,
  FormValidity,
  initCardToken,
  TokenResponse
} from "Kushki/Card";
import { KushkiHostedFields } from "libs/zoid/HostedField.ts";
import { InputModelEnum } from "infrastructure/InputModel.enum.ts";
import { CREDIT_TYPE } from "src/constant/CreditCardEspecifications.ts";
import { FieldTypeEnum } from "types/form_validity";
import { MerchantSettingsResponse } from "types/merchant_settings_response";
import { CountryEnum } from "infrastructure/CountryEnum.ts";
import { DeferredValues } from "types/card_fields_values";
import { BinInfoResponse } from "types/bin_info_response";
import { OTPEventEnum } from "infrastructure/OTPEventEnum.ts";
import { Card } from "class/Card.ts";
import { SecureOtpResponse } from "types/secure_otp_response";
import { KushkiError } from "infrastructure/KushkiError.ts";
import { ErrorCode, ERRORS } from "infrastructure/ErrorEnum.ts";
import { OTPEnum } from "infrastructure/OTPEnum.ts";
import { KushkiGateway } from "gateway/KushkiGateway.ts";
import { SiftScienceProvider } from "provider/SiftScienceProvider.ts";
import { Cardinal3DSProvider } from "provider/Cardinal3DSProvider.ts";
import { Sandbox3DSProvider } from "provider/Sandbox3DSProvider.ts";

jest.mock("gateway/KushkiGateway.ts");
jest.mock("provider/SiftScienceProvider.ts");
jest.mock("provider/Cardinal3DSProvider.ts");
jest.mock("provider/Sandbox3DSProvider.ts");
jest.mock("libs/zoid/HostedField.ts");

const merchantSettingsResponseDefault: MerchantSettingsResponse = {
  country: "",
  merchant_name: "",
  processor_name: "",
  prodBaconKey: "",
  sandboxBaconKey: ""
};

describe("Card test", () => {
  let kushki: IKushki;
  let options: CardOptions;
  let field: Field;
  let mockRequestDeferredInfo = jest.fn().mockResolvedValue([
    {
      months: ["1"],
      monthsOfGrace: ["1"],
      name: "",
      type: CREDIT_TYPE.ALL
    }
  ]);
  const binInfoResponseDefault: BinInfoResponse = {
    bank: "Some Bank",
    brand: "visa",
    cardType: "credit"
  };

  const mockInputFieldCardNumber = () => {
    KushkiHostedFields.mock.calls[0][0].handleOnBinChange("4242424242424242");
  };

  const initKushki = async (inTest?: boolean) => {
    kushki = await init({ inTest, publicCredentialId: "1234" });
  };

  afterEach(() => {
    KushkiHostedFields.mockImplementation(() => ({
      hide: jest.fn().mockResolvedValue({}),
      render: jest.fn(),
      resize: jest.fn().mockResolvedValue({}),
      show: jest.fn().mockResolvedValue({}),
      updateProps: jest.fn()
    }));
    mockRequestDeferredInfo.mockClear();
  });

  const initMocksGateway = (binInfoResponse = {}) => {
    // @ts-ignore
    KushkiGateway.mockImplementation(() => ({
      requestBinInfo: jest
        .fn()
        .mockReturnValue({ ...binInfoResponseDefault, ...binInfoResponse }),
      requestDeferredInfo: mockRequestDeferredInfo
    }));
  };

  beforeEach(async () => {
    await initKushki();

    initMocksGateway();

    field = {
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
        cardholderName: field,
        cardNumber: field,
        cvv: field,
        expirationDate: field
      }
    };

    document.body.innerHTML = "<div id='id_test'>my div</div>";
    KushkiHostedFields.mockClear();
  });

  it("should render cvv field with isRequired false when is subscription and isRequired flag exist", async () => {
    options.fields.cvv!.isRequired = false;
    options.isSubscription = true;

    await initCardToken(kushki, options);

    expect(KushkiHostedFields.mock.calls[2][0].isRequired).toBeFalsy();
  });

  it("should render cvv field with isRequired true when is not subscription and isRequired flag exist", async () => {
    options.fields.cvv!.isRequired = false;
    options.isSubscription = false;

    await initCardToken(kushki, options);

    expect(KushkiHostedFields.mock.calls[2][0].isRequired).toBeTruthy();
  });

  it("it should return base URL of uat when Card has property inTest equal to true", async () => {
    await initCardToken(kushki, options);

    KushkiHostedFields.mock.calls[0][0].handleOnFocus("cardholderName");
    KushkiHostedFields.mock.calls[0][0].handleOnBlur("cardholderName");

    expect(typeof KushkiHostedFields.mock.calls[0][0].handleOnFocus).toEqual(
      "function"
    );
    expect(typeof KushkiHostedFields.mock.calls[0][0].handleOnBlur).toEqual(
      "function"
    );
  });

  it("should set handleOnChange as callback in KushkiHostedFields", async () => {
    await initCardToken(kushki, options);

    expect(KushkiHostedFields).toHaveBeenCalledTimes(4);
    expect(KushkiHostedFields.mock.calls[0][0].selector).toEqual(
      field.selector
    );

    expect(typeof KushkiHostedFields.mock.calls[0][0].handleOnFocus).toEqual(
      "function"
    );
  });

  it("should render deferred input", async () => {
    options.fields.deferred = {
      selector: "id_test"
    };

    const cardInstance = await Card.initCardToken(kushki, options);

    const deferredValue = {
      creditType: CREDIT_TYPE.ALL,
      graceMonths: 0,
      isDeferred: true,
      months: 0
    };

    KushkiHostedFields.mock.calls[4][0].handleOnDeferredChange(deferredValue);
    KushkiHostedFields.mock.calls[4][0].handleOnBlur(deferredValue);
    KushkiHostedFields.mock.calls[4][0].handleOnFocus(deferredValue);

    expect(cardInstance["inputValues"].deferred!.value).toEqual(deferredValue);
  });

  it("should return error when initCardToken has invalid prop", () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    Card.initCardToken(kushki, undefined).catch((error) =>
      expect(error.code).toEqual("E012")
    );
  });

  it("should render deferred input but hide input failed", () => {
    KushkiHostedFields.mockImplementation(() => ({
      hide: jest.fn().mockRejectedValue("throw exception"),
      render: jest.fn(),
      resize: jest.fn().mockResolvedValue({}),
      updateProps: jest.fn()
    }));

    options.fields.deferred = {
      selector: "id_test"
    };

    initCardToken(kushki, options).catch((error) =>
      expect(error.code).toEqual("E012")
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
      selector: "id_test"
    };

    initCardToken(kushki, options).catch((error) => {
      expect(error.code).toEqual("E012");
    });
  });

  it("should throw error when element not exist in method initCardToken", async () => {
    field = {
      selector: "id_test_not_created"
    };

    options = {
      currency: "USD",
      fields: {
        cardholderName: field,
        cardNumber: field,
        cvv: field,
        expirationDate: field
      }
    };

    initCardToken(kushki, options).catch((error) => {
      expect(error.message).toEqual(ERRORS[ErrorCode.E013].message);
    });
  });

  it("if cardNumber have max eight digits then it should called handleSetCardNumber but requestBinInfo is Success", async () => {
    await initCardToken(kushki, options);

    mockInputFieldCardNumber();

    if (KushkiHostedFields.mock.lastCall) {
      expect(KushkiHostedFields.mock.lastCall[0].fieldType).toEqual(
        InputModelEnum.EXPIRATION_DATE
      );
    }
  });

  it("should hide deferred input because bin of card number hasn't deferred options", async function () {
    mockRequestDeferredInfo = jest.fn().mockResolvedValue([]);

    initMocksGateway();

    await initCardToken(kushki, options);

    mockInputFieldCardNumber();

    expect(KushkiHostedFields).toHaveBeenCalled();
  });

  it("should show deferred input because bin of card number don't change", async function () {
    const paymentInstance = await Card.initCardToken(kushki, options);

    paymentInstance["currentBin"] = "42424242";
    paymentInstance["currentBinHasDeferredOptions"] = true;

    KushkiHostedFields.mock.calls[0][0].handleOnBinChange("42424242");

    expect(KushkiHostedFields).toHaveBeenCalledTimes(4);
  });

  it("shouldn't call API bin info and deferred options", async function () {
    const paymentInstance = await Card.initCardToken(kushki, options);

    KushkiHostedFields.mock.calls[0][0].handleOnBinChange("424242");

    expect(paymentInstance["currentBinHasDeferredOptions"]).toEqual(false);
  });

  it("shouldn't call API bin info when bin is empty", async function () {
    const paymentInstance = await Card.initCardToken(kushki, options);

    KushkiHostedFields.mock.calls[0][0].handleOnBinChange("");

    expect(paymentInstance["currentBinHasDeferredOptions"]).toEqual(false);
  });

  it("shouldn't verify deferred options because token is to subscription", async function () {
    options.isSubscription = true;

    await initCardToken(kushki, options);

    mockInputFieldCardNumber();

    expect(mockRequestDeferredInfo).not.toHaveBeenCalled();
  });

  it("shouldn't verify deferred options because bin of card number is debit", async function () {
    initMocksGateway({ cardType: "debit" });

    await initCardToken(kushki, options);

    mockInputFieldCardNumber();

    expect(mockRequestDeferredInfo).not.toHaveBeenCalled();
  });

  it("When requestBinInfo throws an error", async () => {
    // @ts-ignore
    KushkiGateway.mockImplementation(() => ({
      requestBinInfo: new Error("")
    }));

    try {
      await initCardToken(kushki, options);

      mockInputFieldCardNumber();
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  describe("requestToken - Test", () => {
    const tokenMock = "1234567890";
    let deferredValueDefault: DeferredValues;
    const secureServiceMock: string = OTPEnum.secureService;
    const secureIdMock: string = "555444-1213233-1234243-2324";

    const mockKushkiGateway = (
      is3ds?: boolean,
      isSandboxEnabled: boolean = false,
      merchantSettingsResponse: MerchantSettingsResponse = merchantSettingsResponseDefault,
      secureValidation: SecureOtpResponse | Promise<SecureOtpResponse> = {
        code: "3DS000",
        message: "ok"
      }
    ) => {
      // @ts-ignore
      KushkiGateway.mockImplementation(() => ({
        requestCybersourceJwt: () => ({
          jwt: "1234567890"
        }),
        requestMerchantSettings: () => ({
          ...merchantSettingsResponse,
          active_3dsecure: is3ds,
          sandboxEnable: isSandboxEnabled
        }),
        requestSecureServiceValidation: () => secureValidation
      }));

      // @ts-ignore
      SiftScienceProvider.mockImplementation(() => ({
        createSiftScienceSession: () => ({ sessionId: "abc", userId: "123" })
      }));
    };

    const mockExportsMethods = (
      requestTokenMock: jest.Mock = jest
        .fn()
        .mockResolvedValue({ token: tokenMock }),
      requestValidityMock: jest.Mock = jest.fn().mockResolvedValue(true)
    ) => {
      KushkiHostedFields.mockImplementation(() => ({
        hide: jest.fn().mockResolvedValue({}),
        render: jest.fn(),
        requestFormValidity: requestValidityMock,
        requestPaymentToken: requestTokenMock,
        resize: jest.fn().mockResolvedValue({}),
        show: jest.fn().mockResolvedValue({}),
        updateProps: jest.fn()
      }));
    };

    beforeEach(() => {
      deferredValueDefault = {
        creditType: CREDIT_TYPE.ALL,
        graceMonths: 0,
        isDeferred: true,
        months: 1
      };
      mockKushkiGateway();
      mockExportsMethods(
        jest.fn().mockResolvedValue({ token: tokenMock }),
        jest.fn().mockResolvedValue(true)
      );
    });

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

    const mockDeferredField = () => {
      options.fields.deferred = {
        selector: "id_test"
      };
    };

    it("it should execute Card token request and return token", async () => {
      const cardInstance = await initCardToken(kushki, options);

      mockValidityInputs();

      const response = await cardInstance.requestToken();

      expect(response.token).toEqual(tokenMock);
    });

    it("it should execute Card token request but deferred values is undefined", async () => {
      mockDeferredField();

      const cardInstance = await initCardToken(kushki, options);

      mockValidityInputs();

      KushkiHostedFields.mock.calls[4][0].handleOnDeferredChange(undefined);

      const response = await cardInstance.requestToken();

      expect(KushkiHostedFields.mock.calls[4][0].fieldType).toEqual(
        InputModelEnum.DEFERRED
      );
      expect(response.token).toEqual(tokenMock);
    });

    it("it should execute Card token request but deferred values are incorrect", async () => {
      mockDeferredField();

      const cardInstance = await initCardToken(kushki, options);

      mockValidityInputs();

      KushkiHostedFields.mock.calls[4][0].handleOnDeferredChange(
        "incorrect type of value"
      );

      const response = await cardInstance.requestToken();

      expect(KushkiHostedFields.mock.calls[4][0].fieldType).toEqual(
        InputModelEnum.DEFERRED
      );
      expect(response.token).toEqual(tokenMock);
    });

    it("it should execute Card token request but isDeferred is false", async () => {
      mockDeferredField();

      const cardInstance = await initCardToken(kushki, options);

      mockValidityInputs();

      KushkiHostedFields.mock.calls[4][0].handleOnDeferredChange({
        isDeferred: false
      });

      const response = await cardInstance.requestToken();

      expect(KushkiHostedFields.mock.calls[4][0].fieldType).toEqual(
        InputModelEnum.DEFERRED
      );
      expect(response.token).toEqual(tokenMock);
    });

    it("it should execute Payment token request but credit type is empty", async () => {
      mockDeferredField();

      const cardInstance = await initCardToken(kushki, options);

      mockValidityInputs();

      KushkiHostedFields.mock.calls[4][0].handleOnDeferredChange({
        creditType: "",
        isDeferred: true
      });

      try {
        await cardInstance.requestToken();
      } catch (error: any) {
        expect(error.message).toEqual("Error en la validación del formulario");
      }
    });

    it("it should execute Payment token request but deferred is undefined", async () => {
      options.fields.deferred = {
        selector: "id_test"
      };

      const cardInstance = await initCardToken(kushki, options);

      mockValidityInputs();

      KushkiHostedFields.mock.calls[4][0].handleOnDeferredChange(undefined);

      const response = await cardInstance.requestToken();

      expect(response.token).toEqual(tokenMock);
    });

    it("it should execute Payment token request but deferred values are correct", async () => {
      mockDeferredField();

      const cardInstance = await Card.initCardToken(kushki, options);

      mockValidityInputs();

      KushkiHostedFields.mock.calls[4][0].handleOnDeferredChange(
        deferredValueDefault
      );

      const response = await cardInstance.requestToken();

      expect(KushkiHostedFields.mock.calls[4][0].fieldType).toEqual(
        InputModelEnum.DEFERRED
      );
      expect(cardInstance["inputValues"].deferred!.value).toEqual(
        deferredValueDefault
      );
      expect(response.token).toEqual(tokenMock);
    });

    it("it should execute Payment token request and return deferred values when have deferred type", async () => {
      mockDeferredField();

      const cardInstance = await Card.initCardToken(kushki, options);

      mockValidityInputs();

      KushkiHostedFields.mock.calls[4][0].handleOnDeferredChange({
        ...deferredValueDefault,
        creditType: "03"
      });

      const response = await cardInstance.requestToken();

      expect(cardInstance["inputValues"].deferred!.value).toEqual({
        ...deferredValueDefault,
        creditType: "03"
      });
      expect(response.token).toEqual(tokenMock);
    });

    it("it shouldn't execute Card token request but deferred values are required", async () => {
      mockDeferredField();

      const cardInstance = await initCardToken(kushki, options);

      mockValidityInputs();

      deferredValueDefault.isDeferred = true;
      deferredValueDefault.months = 0;
      KushkiHostedFields.mock.calls[4][0].handleOnDeferredChange(
        deferredValueDefault
      );

      cardInstance.requestToken().catch((error) => {
        expect(error.code).toEqual("E007");
      });
    });

    it("it should execute Card token request but deferred values and country chile", async () => {
      options.fields.deferred = {
        selector: "id_test"
      };
      mockExportsMethods(
        jest.fn().mockResolvedValue({
          security: {
            acsURL: "url",
            authenticationTransactionId: "1234",
            authRequired: true,
            paReq: "req",
            specificationVersion: "2.0.1"
          },
          token: tokenMock
        }),
        jest.fn().mockResolvedValue(true)
      );

      mockKushkiGateway(false, false, {
        ...merchantSettingsResponseDefault,
        country: CountryEnum.CHL
      });

      const cardInstance = await Card.initCardToken(kushki, options);

      const deferredValue = {
        creditType: CREDIT_TYPE.ALL,
        graceMonths: 0,
        isDeferred: true,
        months: 1
      };

      mockValidityInputs();

      KushkiHostedFields.mock.calls[4][0].handleOnDeferredChange(deferredValue);

      const response = await cardInstance.requestToken();

      expect(KushkiHostedFields.mock.calls[4][0].fieldType).toEqual(
        InputModelEnum.DEFERRED
      );
      expect(cardInstance["inputValues"].deferred!.value).toEqual(
        deferredValue
      );
      expect(response.token).toEqual(tokenMock);
    });

    it("it should execute Card token request but deferred values and country Ecuador", async () => {
      const deferredValuesMock = {
        creditType: "03",
        graceMonths: 2,
        isDeferred: true,
        months: 1
      };

      mockDeferredField();
      mockExportsMethods(
        jest.fn().mockResolvedValue({
          security: {
            acsURL: "url",
            authenticationTransactionId: "1234",
            authRequired: true,
            paReq: "req",
            specificationVersion: "2.0.1"
          },
          token: tokenMock
        }),
        jest.fn().mockResolvedValue(true)
      );

      mockKushkiGateway(false, false, {
        ...merchantSettingsResponseDefault,
        country: CountryEnum.CHL
      });

      const cardInstance = await Card.initCardToken(kushki, options);

      mockValidityInputs();

      KushkiHostedFields.mock.calls[4][0].handleOnDeferredChange(
        deferredValuesMock
      );

      expect(KushkiHostedFields.mock.calls[4][0].fieldType).toEqual(
        InputModelEnum.DEFERRED
      );
      expect(cardInstance["inputValues"].deferred!.value).toEqual(
        deferredValuesMock
      );
    });

    it("it should execute Card Subscription token request and return token", async () => {
      options.isSubscription = true;
      delete options.amount;

      const cardInstance = await initCardToken(kushki, options);

      mockValidityInputs();

      const response = await cardInstance.requestToken();

      expect(response.token).toEqual(tokenMock);
    });

    it("it should execute Subscription token request and return token with cardInfo when fullResponse is true", async () => {
      const cardInfoMock = {
        bin: "42424242",
        brand: "visa",
        expirationDate: "12/34",
        lastFourDigits: "4242"
      };

      options.isSubscription = true;
      options.fullResponse = true;
      delete options.amount;
      mockExportsMethods(
        jest
          .fn()
          .mockResolvedValue({ cardInfo: cardInfoMock, token: tokenMock }),
        jest.fn().mockResolvedValue(true)
      );

      const cardInstance = await initCardToken(kushki, options);

      mockValidityInputs();

      const response = await cardInstance.requestToken();

      expect(response.token).toEqual(tokenMock);
      expect(response.cardInfo).toEqual(cardInfoMock);
    });

    describe("3DS Tokens Validation", () => {
      const tokenResponseMock3DSFlow: CardTokenResponse = {
        secureId: secureIdMock,
        secureService: secureServiceMock,
        token: tokenMock
      };
      const otpSuccessMock: SecureOtpResponse = {
        code: OTPEnum.secureCodeSuccess,
        message: "OTP válido"
      };
      const mock3DSProviders = (
        validateCardinalMock?: jest.Mock,
        validateSandboxMock?: jest.Mock
      ) => {
        // @ts-ignore
        Cardinal3DSProvider.mockImplementation(() => ({
          initCardinal: jest.fn(),
          onSetUpComplete: jest
            .fn()
            .mockImplementation((callback: () => void) => {
              callback();
            }),
          validateCardinal3dsToken: validateCardinalMock
        }));

        // @ts-ignore
        Sandbox3DSProvider.mockImplementation(() => ({
          initSandbox: jest.fn(),
          validateSandbox3dsToken: validateSandboxMock
        }));
      };

      const mockWindowEventListener3DSFlow = () => {
        window.addEventListener = jest
          .fn()
          .mockImplementationOnce((_, callback) => {
            callback(
              new CustomEvent("onInputOTP", { detail: { otpValue: "555" } })
            );
          });
      };

      beforeEach(() => {
        mockKushkiGateway(true);
        mock3DSProviders(
          jest.fn().mockResolvedValue({
            token: tokenMock
          }),
          jest.fn().mockResolvedValue({
            token: tokenMock
          })
        );
        mockExportsMethods(
          jest.fn().mockResolvedValue({
            token: tokenMock
          }),
          jest.fn().mockResolvedValue(true)
        );
      });

      it("it should execute Card 3ds token for Cardinal", async () => {
        const cardInstance = await initCardToken(kushki, options);

        mockValidityInputs();

        const response = await cardInstance.requestToken();

        expect(response.token).toEqual(tokenMock);
      });

      it("it should execute Card 3ds token with OTP response, should execute OTP validation and response success token", async () => {
        options.fields.otp = {
          selector: "id_test"
        };

        mock3DSProviders(
          jest.fn().mockResolvedValue(tokenResponseMock3DSFlow),
          jest.fn().mockResolvedValue({
            token: tokenMock
          })
        );
        mockKushkiGateway(
          true,
          false,
          merchantSettingsResponseDefault,
          otpSuccessMock
        );

        const cardInstance = await initCardToken(kushki, options);

        KushkiHostedFields.mock.calls[4][0].handleOnOtpChange("532");

        mockValidityInputs();
        mockWindowEventListener3DSFlow();

        const response = await cardInstance.requestToken();

        expect(response.token).toEqual(tokenMock);
      });

      it("it should execute Card 3ds SANDBOX token with modal validation", async () => {
        mockKushkiGateway(true, true, merchantSettingsResponseDefault);

        const cardInstance = await initCardToken(kushki, options);

        mockValidityInputs();

        const response = await cardInstance.requestToken();

        expect(response.token).toEqual(tokenMock);
      });

      it("it should execute Card 3ds sandbox with OTP response, should execute otp validation and response success token", async () => {
        options.fields.otp = {
          selector: "id_test"
        };

        mockExportsMethods(
          jest.fn().mockResolvedValue(tokenResponseMock3DSFlow),
          jest.fn().mockResolvedValue(true)
        );
        mockKushkiGateway(
          true,
          true,
          merchantSettingsResponseDefault,
          otpSuccessMock
        );

        const cardInstance = await initCardToken(kushki, options);

        KushkiHostedFields.mock.calls[4][0].handleOnOtpChange("532");
        mockValidityInputs();
        mockWindowEventListener3DSFlow();

        const response = await cardInstance.requestToken();

        expect(response.token).toEqual(tokenMock);
      });

      it("it should return error when Cardinal validation fails", async () => {
        mock3DSProviders(
          jest.fn().mockRejectedValue(new KushkiError(ERRORS.E005))
        );

        const cardInstance = await initCardToken(kushki, options);

        mockValidityInputs();

        try {
          await cardInstance.requestToken();
        } catch (error: any) {
          expect(error.code).toEqual("E005");
        }
      });

      it("it should return error when Request Token fails", async () => {
        mockExportsMethods(
          jest.fn().mockRejectedValue(new KushkiError(ERRORS.E006)),
          jest.fn().mockResolvedValue(true)
        );

        const cardInstance = await initCardToken(kushki, options);

        mockValidityInputs();

        try {
          await cardInstance.requestToken();
        } catch (error: any) {
          expect(error.code).toEqual("E006");
        }
      });
    });

    it("it should execute Card token UAT with error: E007, for invalid field", async () => {
      mockExportsMethods(undefined, jest.fn().mockResolvedValue(false));

      const cardInstance = await initCardToken(kushki, options);

      try {
        await cardInstance.requestToken();
      } catch (error: any) {
        expect(error.code).toEqual("E007");
      }
    });

    it("it should return successful token when OTP value is valid and securevalidationOTP is true", async () => {
      options.fields.otp = {
        selector: "id_test"
      };

      mockExportsMethods(
        jest.fn().mockResolvedValue({
          secureId: "555444-1213233-1234243-2324",
          secureService: "KushkiOTP",
          token: tokenMock
        }),
        jest.fn().mockResolvedValue(true)
      );
      mockKushkiGateway(false, false, merchantSettingsResponseDefault, {
        code: "OTP000",
        message: "OTP válido"
      });

      const cardInstance = await initCardToken(kushki, options);

      KushkiHostedFields.mock.calls[4][0].handleOnOtpChange("532");
      mockValidityInputs();

      window.addEventListener = jest
        .fn()
        .mockImplementationOnce((_, callback) => {
          callback(
            new CustomEvent("onInputOTP", { detail: { otpValue: "777" } })
          );
        });

      const response: TokenResponse = await cardInstance.requestToken();

      expect(response.token).toEqual(tokenMock);
    });

    it("when onOTPValidation is initialized and send event successful execute onSuccess function", async () => {
      const cardInstance = await initCardToken(kushki, options);
      let valueSuccess = "";

      mockValidityInputs();

      window.addEventListener = jest
        .fn()
        .mockImplementationOnce((_, callback) => {
          callback(
            new CustomEvent("otpValidation", {
              detail: { otp: OTPEventEnum.SUCCESS }
            })
          );
        });

      cardInstance.onOTPValidation(
        () => {},
        () => {},
        () => {
          valueSuccess = OTPEventEnum.SUCCESS;
        }
      );

      expect(valueSuccess).toEqual(OTPEventEnum.SUCCESS);
    });

    it("when onOTPValidation is initialized and send event successful execute onSuccess function", async () => {
      const cardInstance = await initCardToken(kushki, options);
      let valueError = "";

      mockValidityInputs();

      window.addEventListener = jest
        .fn()
        .mockImplementationOnce((_, callback) => {
          callback(
            new CustomEvent("otpValidation", {
              detail: { otp: OTPEventEnum.ERROR }
            })
          );
        });

      cardInstance.onOTPValidation(
        () => {},
        () => {
          valueError = OTPEventEnum.ERROR;
        },
        () => {}
      );

      expect(valueError).toEqual(OTPEventEnum.ERROR);
    });

    describe("getFormValidity - Method", () => {
      it("should get formValidity in false when is init class with empty values", async () => {
        const cardInstance = await Card.initCardToken(kushki, options);
        const formValidity: FormValidity = cardInstance.getFormValidity();

        expect(formValidity.isFormValid).toBeFalsy();
      });

      it("should get formValidity in true when all the fields are valid", async () => {
        const cardInstance = await Card.initCardToken(kushki, options);

        mockValidityInputs();
        const formValidity: FormValidity = cardInstance.getFormValidity();

        expect(formValidity.isFormValid).toBeTruthy();
      });

      it("should get formValidity in true when all the fields are valid and deferred selectors are valid", async () => {
        mockDeferredField();
        const cardInstance = await Card.initCardToken(kushki, options);

        mockValidityInputs();

        KushkiHostedFields.mock.calls[4][0].handleOnDeferredChange(
          deferredValueDefault
        );

        const formValidity: FormValidity = cardInstance.getFormValidity();

        expect(formValidity.isFormValid).toBeTruthy();
      });

      it("should get formValidity in false when all the fields are valid but deferred selectors are invalid", async () => {
        mockDeferredField();
        const cardInstance = await Card.initCardToken(kushki, options);

        mockValidityInputs();

        KushkiHostedFields.mock.calls[4][0].handleOnDeferredChange({
          creditType: "",
          isDeferred: true
        });

        const formValidity: FormValidity = cardInstance.getFormValidity();

        expect(formValidity.isFormValid).toBeFalsy();
      });
    });
  });

  describe("onFieldValidity - Test", () => {
    it("when call onFieldValidity, should set successful input value", async () => {
      const cardInstance = await Card.initCardToken(kushki, options);

      window.addEventListener = jest
        .fn()
        .mockImplementationOnce((_, callback) => {
          callback(
            new CustomEvent("fieldValidity", {
              detail: {}
            })
          );
        });

      cardInstance.onFieldValidity((e) => {
        e;
      });

      expect(
        cardInstance["inputValues"].cardholderName!.validity.isValid
      ).toEqual(false);
    });

    it("when call onFieldFocus, should set successful input value", async () => {
      const cardInstance = await Card.initCardToken(kushki, options);

      cardInstance.onFieldFocus((e) => {
        e;
      });

      expect(
        cardInstance["inputValues"].cardholderName!.validity.isValid
      ).toEqual(false);
    });

    it("when call handleOnChange should call handleOnValidity successful", async () => {
      await initCardToken(kushki, options);

      KushkiHostedFields.mock.calls[0][0].handleOnValidity(
        InputModelEnum.CARDHOLDER_NAME,
        {
          isValid: false
        }
      );

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
      const cardInstance = await initCardToken(kushki, options);

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
      const cardInstance = await initCardToken(kushki, options);

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
      const cardInstance = await initCardToken(kushki, options);

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

    it("should create custom event when called to handleOnSubmit", async () => {
      await initCardToken(kushki, options);

      KushkiHostedFields.mock.calls[0][0].handleOnSubmit(
        InputModelEnum.CARDHOLDER_NAME
      );

      expect(typeof KushkiHostedFields.mock.calls[0][0].handleOnSubmit).toEqual(
        "function"
      );
      expect(dispatchEventSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe("reset", () => {
    it("resets the hosted field with valid fieldType cardNumber", async () => {
      const cardInstance = await Card.initCardToken(kushki, options);
      const fieldType = InputModelEnum.CARD_NUMBER;

      await cardInstance.reset(fieldType);

      expect(
        cardInstance["inputValues"].cardNumber!.hostedField!.updateProps
      ).toBeCalled();
    });

    it("rejects with ERRORS.E009 for invalid fieldType", async () => {
      const cardInstance = await initCardToken(kushki, options);
      const fieldType = "InvalidFieldType";

      cardInstance
        .reset(fieldType as FieldTypeEnum)
        .catch((error) => expect(error.code).toEqual("E009"));
    });
  });

  describe("focus", () => {
    it("focus the hosted field with valid fieldType cardNumber", async () => {
      const cardInstance = await Card.initCardToken(kushki, options);
      const fieldType = InputModelEnum.CARD_NUMBER;

      await cardInstance.focus(fieldType);

      expect(
        cardInstance["inputValues"].cardNumber!.hostedField!.updateProps
      ).toBeCalled();
    });

    it("rejects with ERRORS.E010 for invalid fieldType", async () => {
      const cardInstance = await initCardToken(kushki, options);
      const fieldType = "InvalidFieldType";

      cardInstance
        .focus(fieldType as FieldTypeEnum)
        .catch((error) => expect(error.code).toEqual("E010"));
    });
  });
});
