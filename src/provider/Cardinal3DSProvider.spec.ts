import { Cardinal3DSProvider } from "src/provider/Cardinal3DSProvider.ts";
import { Kushki } from "class/Kushki.ts";
import { IKushki } from "Kushki";
import { SecureOtpResponse } from "types/secure_otp_response";
import { CONTAINER } from "infrastructure/Container.ts";
import { IDENTIFIERS } from "src/constant/Identifiers.ts";
import { KushkiError } from "infrastructure/KushkiError.ts";
import { ERRORS } from "infrastructure/ErrorEnum.ts";
import {
  CardinalValidationCodeEnum,
  ICardinalValidation
} from "infrastructure/CardinalValidationEnum.ts";

describe("Cardinal3DSProvider - Test", () => {
  let cardinalProvider: Cardinal3DSProvider;
  let kushkiInstanceMock: IKushki;
  const setUpMock = jest.fn();
  const triggerMock = jest.fn();
  const onMock = jest
    .fn()
    .mockImplementation((_: string, callback: () => void) => {
      callback();
    });

  const mockCardinal = (complete: any = undefined, on: jest.Mock = onMock) => {
    jest.mock("libs/cardinal/Prod", () => ({
      default: jest.fn()
    }));
    jest.mock("libs/cardinal/Staging", () => ({
      default: jest.fn()
    }));
    window.Cardinal = {};
    window.Cardinal.off = jest.fn();
    window.Cardinal.setup = setUpMock;
    window.Cardinal.continue = jest.fn();
    window.Cardinal.on = on;
    window.Cardinal.complete = complete;
    window.Cardinal.trigger = triggerMock;
  };

  const mockKushkiGateway = (
    secureValidation: SecureOtpResponse | Promise<SecureOtpResponse> = {
      code: "3DS000",
      message: "ok"
    }
  ) => {
    const mockGateway = {
      requestSecureServiceValidation: () => secureValidation
    };

    CONTAINER.unbind(IDENTIFIERS.KushkiGateway);
    CONTAINER.bind(IDENTIFIERS.KushkiGateway).toConstantValue(mockGateway);
  };

  const initProvider = (inTest?: boolean) => {
    kushkiInstanceMock = new Kushki({
      inTest,
      publicCredentialId: "1234456789"
    });

    cardinalProvider = new Cardinal3DSProvider();
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockCardinal();
    mockKushkiGateway();
    initProvider();
  });

  describe("initCardinal - method", () => {
    it("should call setupCardinal for prod Lib", async () => {
      await cardinalProvider.initCardinal(
        kushkiInstanceMock,
        "JWT",
        "4242 4242"
      );

      expect(setUpMock).toBeCalledTimes(1);
    });

    it("should call trigger for staging Lib and retry", async () => {
      mockCardinal(jest.fn().mockReturnValue({}));
      initProvider(true);

      await cardinalProvider.initCardinal(
        kushkiInstanceMock,
        "JWT",
        "4242 4242"
      );

      expect(triggerMock).toBeCalledTimes(2);
    });
  });

  describe("getCardinal3dsToken - method", () => {
    it("should call on for callback", async () => {
      await cardinalProvider.onSetUpComplete(() => {
        expect(onMock).toBeCalledTimes(1);
      });
    });

    it("should call complete for callback on retry ", async () => {
      const completeMock = jest.fn().mockReturnValue({});

      mockCardinal(completeMock);

      await cardinalProvider.onSetUpComplete(() => {
        expect(completeMock).toBeCalledTimes(1);
      });
    });
  });

  describe("validateCardinal3dsToken - method", () => {
    beforeEach(() => {
      mockCardinal(
        undefined,
        jest
          .fn()
          .mockImplementation(
            (_: string, callback: (data: ICardinalValidation) => void) => {
              callback({
                ActionCode: CardinalValidationCodeEnum.SUCCESS,
                ErrorDescription: "test",
                Validated: true
              });
            }
          )
      );
    });

    const tokenMock = {
      security: {
        acsURL: ".com",
        authenticationTransactionId: "678",
        authRequired: true,
        paReq: "456",
        specificationVersion: "2.0.0"
      },
      token: "123456"
    };

    it("should return token with all security props validated", async () => {
      const tokenResponse = await cardinalProvider.validateCardinal3dsToken(
        kushkiInstanceMock,
        tokenMock,
        {}
      );

      expect(tokenResponse.token).toEqual(tokenMock.token);
    });

    it("should return token if not needs validation", async () => {
      const tokenResponse = await cardinalProvider.validateCardinal3dsToken(
        kushkiInstanceMock,
        { token: "1234" },
        {}
      );

      expect(tokenResponse.token).toEqual("1234");
    });

    it("should throw error when token not have complete security props", async () => {
      try {
        await cardinalProvider.validateCardinal3dsToken(
          kushkiInstanceMock,
          {
            security: {
              authRequired: true
            },
            token: "1234"
          },
          {}
        );
      } catch (error: any) {
        expect(error.code).toEqual("E005");
      }
    });

    it("should throw error when secureValidation WS call fails", async () => {
      mockKushkiGateway(Promise.reject(new KushkiError(ERRORS.E005)));
      initProvider();

      try {
        await cardinalProvider.validateCardinal3dsToken(
          kushkiInstanceMock,
          tokenMock,
          {}
        );
      } catch (error: any) {
        expect(error.code).toEqual("E006");
      }
    });

    it("should throw error when secureValidation WS call return other values", async () => {
      mockKushkiGateway({
        code: "other",
        message: "3DS000"
      });
      initProvider();

      try {
        await cardinalProvider.validateCardinal3dsToken(
          kushkiInstanceMock,
          tokenMock,
          {}
        );
      } catch (error: any) {
        expect(error.code).toEqual("E006");
      }
    });

    it("should throw error when cardinal validation return error", async () => {
      mockCardinal(
        undefined,
        jest
          .fn()
          .mockImplementation(
            (_: string, callback: (data: ICardinalValidation) => void) => {
              callback({
                ActionCode: CardinalValidationCodeEnum.FAIL,
                ErrorDescription: "test",
                Validated: false
              });
            }
          )
      );
      initProvider();

      try {
        await cardinalProvider.validateCardinal3dsToken(
          kushkiInstanceMock,
          tokenMock,
          {}
        );
      } catch (error: any) {
        expect(error.code).toEqual("E005");
      }
    });
  });
});
