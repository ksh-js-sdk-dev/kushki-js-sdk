import { IKushki, init } from "Kushki";
import { KushkiGateway } from "gateway/KushkiGateway.ts";
import { SiftScienceProvider } from "provider/SiftScienceProvider.ts";
import { AntiFraudService } from "service/AntiFraudService.ts";
import { SecureInitRequest } from "types/secure_init_request";
import { MerchantSettingsResponse } from "types/merchant_settings_response";
import { CybersourceJwtResponse } from "types/cybersource_jwt_response";
import { KushkiCardinalSandbox } from "@kushki/cardinal-sandbox-js";
import { SecureOtpResponse } from "types/secure_otp_response";
import { CardTokenResponse } from "types/card_token_response";
import { SiftScienceObject } from "types/sift_science_object";
import * as Utils from "utils/3DSUtils.ts";
import { Cardinal3DSProvider } from "provider/Cardinal3DSProvider.ts";
import { Sandbox3DSProvider } from "provider/Sandbox3DSProvider.ts";

import { TokenResponse } from "types/token_response";

jest.mock("gateway/KushkiGateway.ts");
jest.mock("provider/Cardinal3DSProvider.ts");
jest.mock("provider/Sandbox3DSProvider.ts");
jest.mock("provider/SiftScienceProvider.ts");

describe("AntiFraudService - Test", () => {
  const jwtMock: string = "234234hgfg234";
  const validateCardinal3dsTokenSpy = jest.fn();
  const validateSandbox3dsTokenSpy = jest.fn();
  let deviceTokenMock: TokenResponse;
  let merchantSettingsResponseMock: MerchantSettingsResponse;

  const mockCardinal3DSProvider = (
    validateCardinal3dsToken: jest.Mock = validateCardinal3dsTokenSpy.mockResolvedValue(
      deviceTokenMock
    )
  ) => {
    // @ts-ignore
    Cardinal3DSProvider.mockImplementation(() => ({
      onSetUpComplete: jest.fn().mockImplementation((callback: () => void) => {
        callback();
      }),
      validateCardinal3dsToken
    }));
  };

  const mockSandbox3DSProvider = (
    validateSandbox3dsToken: jest.Mock = validateSandbox3dsTokenSpy.mockResolvedValue(
      deviceTokenMock
    )
  ) => {
    // @ts-ignore
    Sandbox3DSProvider.mockImplementation(() => ({
      validateSandbox3dsToken
    }));
  };

  beforeEach(() => {
    jest.clearAllMocks();

    merchantSettingsResponseMock = {
      active_3dsecure: true,
      amount: {
        currency: "USD",
        iva: 10,
        subtotalIva: 20,
        subtotalIva0: 30
      },
      country: "",
      merchant_name: "",
      merchantId: "12334",
      parentMerchantName: "test",
      processor_name: "",
      prodBaconKey: null,
      sandboxBaconKey: null,
      sandboxEnable: true,
      totalAmount: 444
    };

    mockCardinal3DSProvider();
  });

  const initKushki = async (inTest: boolean = true) => {
    return await init({ inTest: inTest, publicCredentialId: "1234" });
  };

  const mockKushkiGateway = (
    merchantSettingsResponseMock: Promise<MerchantSettingsResponse>,
    cybersourceJwtResponseMock?: Promise<CybersourceJwtResponse>,
    secureServiceResponseMock?: Promise<SecureOtpResponse>
  ) => {
    // @ts-ignore
    KushkiGateway.mockImplementation(() => ({
      requestCybersourceJwt: jest
        .fn()
        .mockResolvedValue(cybersourceJwtResponseMock),
      requestMerchantSettings: jest
        .fn()
        .mockResolvedValue(merchantSettingsResponseMock),
      requestSecureServiceValidation: jest
        .fn()
        .mockResolvedValue(secureServiceResponseMock)
    }));
  };

  describe("requestSecureInit - Test", () => {
    let request: SecureInitRequest;
    let cybersourceJwtResponseMock: CybersourceJwtResponse;

    beforeEach(() => {
      request = {
        card: {
          number: "1234567890123456"
        }
      };

      cybersourceJwtResponseMock = {
        identifier: "24234234",
        jwt: "234234hgfg234"
      };
    });

    it("should return jwt when there is successful", async () => {
      const kushkiInstance = await initKushki(false);

      mockKushkiGateway(
        Promise.resolve(merchantSettingsResponseMock),
        Promise.resolve(cybersourceJwtResponseMock)
      );

      const secureInitResponse = await AntiFraudService.requestSecureInit(
        kushkiInstance,
        request
      );

      expect(secureInitResponse.jwt).toEqual("234234hgfg234");
    });

    it("should return error when card number is lesser than 6 digits", async () => {
      const kushkiInstance = await initKushki();

      request.card.number = "12345";

      mockKushkiGateway(
        Promise.resolve(merchantSettingsResponseMock),
        Promise.resolve(cybersourceJwtResponseMock)
      );

      try {
        const secureInitResponse = await AntiFraudService.requestSecureInit(
          kushkiInstance,
          request
        );

        expect(secureInitResponse).toBeNaN();
      } catch (e: any) {
        expect(e.code).toEqual("E018");
        expect(e.detail).toEqual("Longitud de tarjeta inválida");
      }
    });

    it("should return error when card number is greater than 19 digits", async () => {
      const kushkiInstance = await initKushki();

      request.card.number = "12345678901234567890";

      mockKushkiGateway(
        Promise.resolve(merchantSettingsResponseMock),
        Promise.resolve(cybersourceJwtResponseMock)
      );

      try {
        const secureInitResponse = await AntiFraudService.requestSecureInit(
          kushkiInstance,
          request
        );

        expect(secureInitResponse).toBeNaN();
      } catch (e: any) {
        expect(e.code).toEqual("E018");
        expect(e.detail).toEqual("Longitud de tarjeta inválida");
      }
    });

    it("should return E019 when merchant not have active3ds", async () => {
      const kushkiInstance = await initKushki();

      merchantSettingsResponseMock.active_3dsecure = false;

      mockKushkiGateway(
        Promise.resolve(merchantSettingsResponseMock),
        Promise.resolve(cybersourceJwtResponseMock)
      );

      try {
        await AntiFraudService.requestSecureInit(kushkiInstance, request);
      } catch (error: any) {
        expect(error.code).toBe("E019");
        expect(error.message).toBe("Comercio no tiene activo 3DS");
      }
    });

    it("should return jwt when sandbox is not active", async () => {
      const kushkiInstance = await initKushki();

      merchantSettingsResponseMock.sandboxEnable = false;
      jest.spyOn(Utils, "getJwtIf3dsEnabled").mockResolvedValue(jwtMock);

      mockKushkiGateway(
        Promise.resolve(merchantSettingsResponseMock),
        Promise.resolve(cybersourceJwtResponseMock)
      );

      const secureInitResponse = await AntiFraudService.requestSecureInit(
        kushkiInstance,
        request
      );

      expect(secureInitResponse.jwt).toEqual("234234hgfg234");
    });
  });

  describe("validate3DS - Test", () => {
    let cardTokenResponse: CardTokenResponse;
    let merchantSettingsResponseMock: MerchantSettingsResponse;
    let cybersourceJwtResponseMock: CybersourceJwtResponse;
    let secureServiceResponseMock: SecureOtpResponse;
    let isValid: boolean = false;
    const mockSandbox = (isError?: boolean) => {
      jest.spyOn(KushkiCardinalSandbox, "init");
      jest.spyOn(KushkiCardinalSandbox, "continue").mockReturnValue();
      jest
        .spyOn(KushkiCardinalSandbox, "on")
        .mockImplementation(
          (_: string, callback: (isErrorFlow?: boolean) => void) => {
            callback(isError);
          }
        );
    };

    beforeEach(() => {
      cardTokenResponse = {
        secureId: "23d23e2e23e",
        security: {
          acsURL: "dddd",
          authenticationTransactionId: "asdsad",
          authRequired: true,
          paReq: "sandbox",
          specificationVersion: "2.0"
        },
        token: "123y123gu123"
      };
      merchantSettingsResponseMock = {
        active_3dsecure: true,
        amount: {
          currency: "USD",
          iva: 10,
          subtotalIva: 20,
          subtotalIva0: 30
        },
        country: "",
        merchant_name: "",
        merchantId: "12334",
        parentMerchantName: "test",
        processor_name: "",
        prodBaconKey: null,
        sandboxBaconKey: null,
        sandboxEnable: true,
        totalAmount: 444
      };
      cybersourceJwtResponseMock = {
        identifier: "24234234",
        jwt: "234234hgfg234"
      };
      secureServiceResponseMock = {
        code: "ok",
        message: "3DS000"
      };
      mockSandbox(false);
      jest.spyOn(Utils, "getJwtIf3dsEnabled").mockResolvedValue(jwtMock);
      deviceTokenMock = { token: "12345" };
    });

    it("should return isValid equal true when validate3DS process is successful", async () => {
      const kushkiInstance = await initKushki();

      merchantSettingsResponseMock.sandboxEnable = true;
      mockSandbox3DSProvider();

      mockKushkiGateway(
        Promise.resolve(merchantSettingsResponseMock),
        Promise.resolve(cybersourceJwtResponseMock),
        Promise.resolve(secureServiceResponseMock)
      );
      const response = await AntiFraudService.requestValidate3DS(
        kushkiInstance,
        cardTokenResponse
      );

      if (response.token) isValid = true;

      expect(isValid).toBeTruthy();
    });

    it("should return error E005 when cardinal action code is equal to FAILURE", async () => {
      const kushkiInstance = await initKushki();

      mockSandbox(false);

      mockKushkiGateway(
        Promise.resolve(merchantSettingsResponseMock),
        Promise.resolve(cybersourceJwtResponseMock),
        Promise.resolve(secureServiceResponseMock)
      );

      try {
        await AntiFraudService.requestValidate3DS(
          kushkiInstance,
          cardTokenResponse
        );
      } catch (error: any) {
        expect(error.code).toBe("E005");
        expect(error.message).toBe("Campos 3DS inválidos");
      }
    });

    it("should return error E012 when security param is undefined in cardTokenResponse", async () => {
      const kushkiInstance = await initKushki();

      mockSandbox(true);
      cardTokenResponse.security = undefined;

      mockKushkiGateway(
        Promise.resolve(merchantSettingsResponseMock),
        Promise.resolve(cybersourceJwtResponseMock),
        Promise.resolve(secureServiceResponseMock)
      );

      try {
        await AntiFraudService.requestValidate3DS(
          kushkiInstance,
          cardTokenResponse
        );
      } catch (error: any) {
        expect(error.code).toBe("E012");
        expect(error.message).toBe("Error en inicialización de campos");
      }
    });

    it("should return error E012 when authRequired is the only param in security object", async () => {
      const kushkiInstance = await initKushki();

      mockSandbox(false);
      cardTokenResponse.security!.authRequired = true;
      cardTokenResponse.security!.acsURL = undefined;
      cardTokenResponse.security!.paReq = undefined;
      cardTokenResponse.security!.authenticationTransactionId = undefined;

      mockKushkiGateway(
        Promise.resolve(merchantSettingsResponseMock),
        Promise.resolve(cybersourceJwtResponseMock),
        Promise.resolve(secureServiceResponseMock)
      );

      try {
        await AntiFraudService.requestValidate3DS(
          kushkiInstance,
          cardTokenResponse
        );
      } catch (error: any) {
        expect(error.code).toBe("E005");
        expect(error.message).toBe("Campos 3DS inválidos");
      }
    });

    it("should return error E005 when specification version is invalid", async () => {
      const kushkiInstance = await initKushki();

      mockSandbox(false);
      cardTokenResponse.security!.paReq = "notsandbox";
      cardTokenResponse.security!.authRequired = true;
      cardTokenResponse.security!.specificationVersion = "1.2";

      mockKushkiGateway(
        Promise.resolve(merchantSettingsResponseMock),
        Promise.resolve(cybersourceJwtResponseMock),
        Promise.resolve(secureServiceResponseMock)
      );

      try {
        await AntiFraudService.requestValidate3DS(
          kushkiInstance,
          cardTokenResponse
        );
      } catch (error: any) {
        expect(error.code).toBe("E005");
        expect(error.message).toBe("Campos 3DS inválidos");
      }
    });
  });

  describe("requestInitAntiFraud - Test", () => {
    const userIdMock = "1234412";
    const siftObjectMock: SiftScienceObject = {
      sessionId: "23s23dsf34fsd",
      userId: "123fd32"
    };
    let kushkiInstance: IKushki;
    let createSiftScienceAntiFraudSessionSpy = jest.fn();

    const mockSiftProvider = (
      createSiftScienceAntiFraudSession: jest.Mock = createSiftScienceAntiFraudSessionSpy.mockResolvedValue(
        siftObjectMock
      )
    ) => {
      // @ts-ignore
      SiftScienceProvider.mockImplementation(() => ({
        createSiftScienceAntiFraudSession
      }));
    };

    beforeEach(async () => {
      kushkiInstance = await initKushki();
      mockKushkiGateway(Promise.resolve(merchantSettingsResponseMock));
    });

    it("should return sift object when call requestInitAntiFraud with userid", async () => {
      mockSiftProvider();

      const response = await AntiFraudService.requestInitAntiFraud(
        kushkiInstance,
        userIdMock
      );

      expect(response).toHaveProperty("userId", siftObjectMock.userId);
      expect(response).toHaveProperty("sessionId", siftObjectMock.sessionId);
    });

    it("should throws error when createSiftScienceAntiFraudSession method fails", async () => {
      createSiftScienceAntiFraudSessionSpy = jest
        .fn()
        .mockRejectedValue("Sift Error");

      mockSiftProvider(createSiftScienceAntiFraudSessionSpy);

      try {
        await AntiFraudService.requestInitAntiFraud(kushkiInstance, userIdMock);
      } catch (error: any) {
        expect(error).toEqual("Sift Error");
      }
    });
  });
});
