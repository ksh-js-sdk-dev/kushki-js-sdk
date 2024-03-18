import {
  getJwtIf3dsEnabled,
  is3dsValid,
  tokenHasAllSecurityProperties,
  tokenNotNeedsAuth
} from "utils/3DSUtils.ts";
import { MerchantSettingsResponse } from "types/merchant_settings_response";
import { IKushki } from "repository/IKushki.ts";
import { Kushki } from "class/Kushki.ts";
import { KushkiGateway } from "gateway/KushkiGateway.ts";
import { Cardinal3DSProvider } from "provider/Cardinal3DSProvider.ts";
import { Sandbox3DSProvider } from "provider/Sandbox3DSProvider.ts";
import { Buffer } from "buffer";

jest.mock("gateway/KushkiGateway.ts");
jest.mock("provider/Cardinal3DSProvider.ts");
jest.mock("provider/Sandbox3DSProvider.ts");

describe("3DSUtils - test", () => {
  describe("tokenNotNeedsAuth - method", () => {
    it("should return true when token not have security props", () => {
      const response = tokenNotNeedsAuth({ token: "12345" });

      expect(response).toBeTruthy();
    });

    it("should return true when token has not need auth", () => {
      const response = tokenNotNeedsAuth({
        security: {
          authRequired: false
        },
        token: "12345"
      });

      expect(response).toBeTruthy();
    });

    it("should return false when token need auth", () => {
      const response = tokenNotNeedsAuth({
        security: {
          authRequired: true
        },
        token: "12345"
      });

      expect(response).toBeFalsy();
    });
  });

  describe("tokenHasAllSecurityProperties - method", () => {
    it("should return true if token has all security properties", () => {
      const response = tokenHasAllSecurityProperties({
        security: {
          acsURL: ".com",
          authenticationTransactionId: "678",
          authRequired: true,
          paReq: "456",
          specificationVersion: "2.0.0"
        },
        token: "12344"
      });

      expect(response).toBeTruthy();
    });

    it("should return true if token has all security properties for sandbox", () => {
      const response = tokenHasAllSecurityProperties(
        {
          security: {
            acsURL: ".com",
            authenticationTransactionId: "678",
            authRequired: true,
            paReq: "456",
            specificationVersion: "1.0.0"
          },
          token: "12344"
        },
        true
      );

      expect(response).toBeTruthy();
    });

    it("should return false if token not have version grater than 2", () => {
      const response = tokenHasAllSecurityProperties({
        security: {
          acsURL: ".com",
          authenticationTransactionId: "678",
          authRequired: true,
          paReq: "456",
          specificationVersion: "1.0.0"
        },
        token: "12344"
      });

      expect(response).toBeFalsy();
    });
  });

  describe("is3dsValid - method", () => {
    it("should return true if 3ds secureValidation is correct", () => {
      const response = is3dsValid({
        code: "ok",
        message: "3DS000"
      });

      expect(response).toBeTruthy();
    });

    it("should return true if 3ds secureValidation is correct, variation", () => {
      const response = is3dsValid({
        code: "3DS000",
        message: "ok"
      });

      expect(response).toBeTruthy();
    });

    it("should return false if 3ds secureValidation is failed", () => {
      const response = is3dsValid({
        code: "3DS000",
        message: "error"
      });

      expect(response).toBeFalsy();
    });
  });

  describe("getJwtIf3dsEnabled - method", () => {
    const kushkiInstance: IKushki = new Kushki({ publicCredentialId: "1212" });
    const jwtMock = "872b32b23";
    const identifierMock = "0000";
    let merchantSettingsMock: MerchantSettingsResponse;
    let kushkiGatewayMock: KushkiGateway;
    let sandboxProviderMock: Sandbox3DSProvider;
    let cardinalProviderMock: Cardinal3DSProvider;
    const requestCybersourceJwtSpy = jest.fn();
    const initSandboxSpy = jest.fn();
    const initCardinalSpy = jest.fn();

    const mockKushkiGateway = () => {
      // @ts-ignore
      KushkiGateway.mockImplementation(() => ({
        requestCybersourceJwt: requestCybersourceJwtSpy.mockResolvedValue({
          identifier: identifierMock,
          jwt: jwtMock
        })
      }));
      kushkiGatewayMock = new KushkiGateway();
    };

    const mockSandboxProvider = () => {
      // @ts-ignore
      Sandbox3DSProvider.mockReturnValue({
        initSandbox: initSandboxSpy
      });
      sandboxProviderMock = new Sandbox3DSProvider();
    };

    const mockCardinalProvider = () => {
      // @ts-ignore
      Cardinal3DSProvider.mockReturnValue({
        initCardinal: initCardinalSpy
      });
      cardinalProviderMock = new Cardinal3DSProvider();
    };

    beforeEach(() => {
      jest.clearAllMocks();

      merchantSettingsMock = {
        country: "Ecuador",
        merchant_name: "Test",
        processor_name: "test",
        prodBaconKey: null,
        sandboxBaconKey: null
      };
      mockKushkiGateway();
      mockSandboxProvider();
      mockCardinalProvider();
    });

    it("should return jwt for merchant with cardinal 3DS with bin for card", async () => {
      const binMock = "1234";

      merchantSettingsMock.active_3dsecure = true;

      const jwtResponse = await getJwtIf3dsEnabled(
        merchantSettingsMock,
        kushkiInstance,
        kushkiGatewayMock,
        sandboxProviderMock,
        cardinalProviderMock,
        binMock
      );

      expect(jwtResponse).toEqual(jwtMock);
      expect(requestCybersourceJwtSpy).toBeCalledTimes(1);
      expect(initSandboxSpy).toBeCalledTimes(0);
      expect(initCardinalSpy).toBeCalledTimes(1);
      expect(initCardinalSpy).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        binMock
      );
    });

    it("should return jwt for merchant with cardinal 3DS with generated bin for card subscription", async () => {
      const subscriptionIdMock = "1234";

      merchantSettingsMock.active_3dsecure = true;

      const jwtResponse = await getJwtIf3dsEnabled(
        merchantSettingsMock,
        kushkiInstance,
        kushkiGatewayMock,
        sandboxProviderMock,
        cardinalProviderMock,
        "",
        subscriptionIdMock
      );

      expect(jwtResponse).toEqual(jwtMock);
      expect(requestCybersourceJwtSpy).toBeCalledTimes(1);
      expect(initSandboxSpy).toBeCalledTimes(0);
      expect(initCardinalSpy).toBeCalledTimes(1);
      expect(initCardinalSpy).toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
        Buffer.from(identifierMock, "base64").toString("ascii")
      );
    });

    it("should return jwt for merchant with sandbox 3DS", async () => {
      merchantSettingsMock.active_3dsecure = true;
      merchantSettingsMock.sandboxEnable = true;

      const jwtResponse = await getJwtIf3dsEnabled(
        merchantSettingsMock,
        kushkiInstance,
        kushkiGatewayMock,
        sandboxProviderMock,
        cardinalProviderMock,
        ""
      );

      expect(jwtResponse).toEqual(jwtMock);
      expect(requestCybersourceJwtSpy).toBeCalledTimes(1);
      expect(initSandboxSpy).toBeCalledTimes(1);
      expect(initCardinalSpy).toBeCalledTimes(0);
    });

    it("should return undefined for merchant without 3DS", async () => {
      const jwtResponse = await getJwtIf3dsEnabled(
        merchantSettingsMock,
        kushkiInstance,
        kushkiGatewayMock,
        sandboxProviderMock,
        cardinalProviderMock,
        "1234"
      );

      expect(jwtResponse).toBeUndefined();
      expect(requestCybersourceJwtSpy).toBeCalledTimes(0);
      expect(initSandboxSpy).toBeCalledTimes(0);
      expect(initCardinalSpy).toBeCalledTimes(0);
    });
  });
});
