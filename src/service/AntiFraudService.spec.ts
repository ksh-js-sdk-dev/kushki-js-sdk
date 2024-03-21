import { init } from "Kushki";
import { KushkiGateway } from "gateway/KushkiGateway.ts";
import { AntiFraudService } from "service/AntiFraudService.ts";
import { SecureInitRequest } from "types/secure_init_request";
import { MerchantSettingsResponse } from "types/merchant_settings_response";
import { CybersourceJwtResponse } from "types/cybersource_jwt_response";
import { get, set } from "lodash";
import { KushkiCardinalSandbox } from "@kushki/cardinal-sandbox-js";
import { SecureOtpResponse } from "types/secure_otp_response";
import { CardTokenResponse } from "types/card_token_response";
import * as Utils from "utils/3DSUtils.ts";
import { Cardinal3DSProvider } from "provider/Cardinal3DSProvider.ts";
import { TokenResponse } from "types/token_response";

jest.mock("gateway/KushkiGateway.ts");
jest.mock("provider/Cardinal3DSProvider.ts");
jest.mock("provider/Sandbox3DSProvider.ts");

describe("AntiFraudService - Test", () => {
  const jwtMock: string = "234234hgfg234";
  const validateCardinal3dsTokenSpy = jest.fn();
  let deviceTokenMock: TokenResponse;

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

  beforeEach(() => {
    jest.clearAllMocks();
    mockCardinal3DSProvider();
  });

  const initKushki = async (inTest: boolean = true) => {
    return await init({ inTest: inTest, publicCredentialId: "1234" });
  };

  const mockKushkiGateway = (
    merchantSettingsResponseMock: Promise<MerchantSettingsResponse>,
    cybersourceJwtResponseMock: Promise<CybersourceJwtResponse>,
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
    let merchantSettingsResponseMock: MerchantSettingsResponse;
    let cybersourceJwtResponseMock: CybersourceJwtResponse;

    beforeEach(() => {
      request = {
        card: {
          number: "1234567890123456"
        }
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

      expect(get(secureInitResponse, "jwt")).toEqual("234234hgfg234");
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
      } catch (e) {
        expect(get(e, "code")).toEqual("E018");
        expect(get(e, "detail")).toEqual("Longitud de tarjeta inválida");
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
        expect(get(e, "code")).toEqual("E018");
        expect(get(e, "detail")).toEqual("Longitud de tarjeta inválida");
      }
    });
    it("should return undefined when active3ds is not active", async () => {
      const kushkiInstance = await initKushki();

      merchantSettingsResponseMock.active_3dsecure = false;

      mockKushkiGateway(
        Promise.resolve(merchantSettingsResponseMock),
        Promise.resolve(cybersourceJwtResponseMock)
      );

      const secureInitResponse = await AntiFraudService.requestSecureInit(
        kushkiInstance,
        request
      );

      expect(get(secureInitResponse, "jwt")).toBeUndefined();
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

      expect(get(secureInitResponse, "jwt")).toEqual("234234hgfg234");
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
          paReq: "aaaaa",
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
      mockCardinal3DSProvider();

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
    it("should return error E012 when cardinal action code is equal to FAILURE", async () => {
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
        expect(get(error, "code")).toBe("E005");
        expect(error.message).toBe("Campos 3DS inválidos");
      }
    });
    it("should return error E012 when security param is undefined in cardTokenResponse", async () => {
      const kushkiInstance = await initKushki();

      mockSandbox(true);
      set(cardTokenResponse, "security", undefined);

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
      } catch (error) {
        expect(get(error, "code")).toBe("E012");
        expect(get(error, "message")).toBe("Error en inicialización de campos");
      }
    });
    it("should return error E012 when authRequired is the only param in security object", async () => {
      const kushkiInstance = await initKushki();

      mockSandbox(false);
      set(cardTokenResponse, "security.authRequired", true);
      set(cardTokenResponse, "security.acsURL", undefined);
      set(cardTokenResponse, "security.paReq", undefined);
      set(cardTokenResponse, "security.authenticationTransactionId", undefined);

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
        expect(get(error, "code")).toBe("E005");
        expect(error.message).toBe("Campos 3DS inválidos");
      }
    });
    it("should return error E005 when specification version is invalid", async () => {
      const kushkiInstance = await initKushki();

      mockSandbox(false);
      set(cardTokenResponse, "security.paReq", "notsandbox");
      set(cardTokenResponse, "security.authRequired", true);
      set(cardTokenResponse, "security.specificationVersion", "1.2");

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
        expect(get(error, "code")).toBe("E005");
        expect(error.message).toBe("Campos 3DS inválidos");
      }
    });
  });
});
