import { Kushki } from "src/Kushki.ts";
import { IKushki } from "Kushki";
import { SecureOtpResponse } from "types/secure_otp_response";
import { CONTAINER } from "infrastructure/Container.ts";
import { IDENTIFIERS } from "src/constant/Identifiers.ts";
import { KushkiError } from "infrastructure/KushkiError.ts";
import { ERRORS } from "infrastructure/ErrorEnum.ts";
import { Sandbox3DSProvider } from "src/provider/Sandbox3DSProvider.ts";
import { KushkiCardinalSandbox } from "@kushki/cardinal-sandbox-js";

describe("Sandbox3DSProvider - Test", () => {
  let sandboxProvider: Sandbox3DSProvider;
  let initSpy: jest.SpyInstance;

  const mockSandbox = (isError?: boolean) => {
    initSpy = jest.spyOn(KushkiCardinalSandbox, "init");
    jest.spyOn(KushkiCardinalSandbox, "continue").mockReturnValue();
    jest
      .spyOn(KushkiCardinalSandbox, "on")
      .mockImplementation(
        (_: string, callback: (isErrorFlow?: boolean) => void) => {
          callback(isError);
        }
      );
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
    const kushkiInstanceMock: IKushki = new Kushki({
      inTest,
      publicCredentialId: "1234456789"
    });

    sandboxProvider = new Sandbox3DSProvider(kushkiInstanceMock);
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockSandbox();
    mockKushkiGateway();
    initProvider();
  });

  describe("initSandbox - method", () => {
    it("should call init of KushkiCardinalSandbox", async () => {
      await sandboxProvider.initSandbox();

      expect(initSpy).toBeCalledTimes(1);
    });
  });

  describe("validateCardinal3dsToken - method", () => {
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
      const tokenResponse = await sandboxProvider.validateSandbox3dsToken(
        tokenMock,
        {}
      );

      expect(tokenResponse.token).toEqual(tokenMock.token);
    });

    it("should return token if not needs validation", async () => {
      const tokenResponse = await sandboxProvider.validateSandbox3dsToken(
        { token: "1234" },
        {}
      );

      expect(tokenResponse.token).toEqual("1234");
    });

    it("should throw error when token not have complete security props", async () => {
      try {
        await sandboxProvider.validateSandbox3dsToken(
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
        await sandboxProvider.validateSandbox3dsToken(tokenMock, {});
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
        await sandboxProvider.validateSandbox3dsToken(tokenMock, {});
      } catch (error: any) {
        expect(error.code).toEqual("E006");
      }
    });

    it("should throw error when modal validation fails", async () => {
      mockSandbox(true);
      initProvider();

      try {
        await sandboxProvider.validateSandbox3dsToken(tokenMock, {});
      } catch (error: any) {
        expect(error.code).toEqual("E005");
      }
    });
  });
});
