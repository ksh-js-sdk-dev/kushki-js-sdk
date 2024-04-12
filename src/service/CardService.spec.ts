import { IKushki } from "repository/IKushki.ts";
import { Kushki } from "class/Kushki.ts";
import { DeviceTokenRequest } from "types/device_token_request";
import { CardService } from "service/CardService.ts";
import { KushkiGateway } from "gateway/KushkiGateway.ts";
import { MerchantSettingsResponse } from "types/merchant_settings_response";
import { TokenResponse } from "types/token_response";
import { SiftScienceProvider } from "provider/SiftScienceProvider.ts";
import { Sandbox3DSProvider } from "provider/Sandbox3DSProvider.ts";
import { Cardinal3DSProvider } from "provider/Cardinal3DSProvider.ts";

import * as Utils from "utils/3DSUtils.ts";
import { CardTokenResponse } from "types/card_token_response";

jest.mock("gateway/KushkiGateway.ts");
jest.mock("provider/SiftScienceProvider.ts");
jest.mock("provider/Sandbox3DSProvider.ts");
jest.mock("provider/Cardinal3DSProvider.ts");

describe("CardService - Test", () => {
  const kushkiInstance: IKushki = new Kushki({ publicCredentialId: "1212" });

  const siftscienceSessionAndUserMock = "99999";
  const jwtMock = "00000";

  let bodyMock: DeviceTokenRequest;
  let merchantSettingsMock: MerchantSettingsResponse;
  let deviceTokenMock: TokenResponse;

  let requestMerchantSettingsSpy = jest.fn();
  let requestDeviceTokenSpy = jest.fn();
  const requestSubscriptionUserSpy = jest.fn();

  let isSiftScienceEnabledSpy = jest.fn();
  const createSiftScienceSessionSpy = jest.fn();

  let validateSandbox3dsTokenSpy = jest.fn();
  let validateCardinal3dsTokenSpy = jest.fn();

  const mockKushkiGateway = (
    requestMerchantSettings: jest.Mock = requestMerchantSettingsSpy.mockResolvedValue(
      merchantSettingsMock
    ),
    requestDeviceToken: jest.Mock = requestDeviceTokenSpy.mockResolvedValue(
      deviceTokenMock
    ),
    requestSubscriptionUserId: jest.Mock = requestSubscriptionUserSpy.mockResolvedValue(
      { userId: "1234" }
    )
  ) => {
    // @ts-ignore
    KushkiGateway.mockImplementation(() => ({
      requestDeviceToken,
      requestMerchantSettings,
      requestSubscriptionUserId
    }));
  };

  const mockSiftScienceProvider = (
    isSiftScienceEnabled: jest.Mock = isSiftScienceEnabledSpy.mockReturnValue(
      false
    ),
    createSiftScienceSession: jest.Mock = createSiftScienceSessionSpy.mockReturnValue(
      {
        sessionId: siftscienceSessionAndUserMock,
        userId: siftscienceSessionAndUserMock
      }
    )
  ) => {
    // @ts-ignore
    SiftScienceProvider.mockImplementation(() => ({
      createSiftScienceSession,
      isSiftScienceEnabled
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

    bodyMock = { subscriptionId: "67967576" };
    merchantSettingsMock = {
      country: "Ecuador",
      merchant_name: "Test",
      processor_name: "test",
      prodBaconKey: null,
      sandboxBaconKey: null
    };
    deviceTokenMock = { token: "12345" };

    mockKushkiGateway();
    mockSiftScienceProvider();
    mockSandbox3DSProvider();
    mockCardinal3DSProvider();
  });

  describe("requestDeviceToken - method simple", () => {
    it("should return token for merchant without SiftScience or 3DS", async () => {
      const tokenResponse = await CardService.requestDeviceToken(
        kushkiInstance,
        bodyMock
      );

      expect(tokenResponse).toEqual(deviceTokenMock);
      expect(requestMerchantSettingsSpy).toBeCalledTimes(1);
      expect(requestDeviceTokenSpy).toBeCalledTimes(1);
    });

    it("should throws error when merchantSettings request fails", async () => {
      requestMerchantSettingsSpy = jest
        .fn()
        .mockRejectedValue("merchant settings error");

      mockKushkiGateway(requestMerchantSettingsSpy);

      try {
        await CardService.requestDeviceToken(kushkiInstance, bodyMock);
      } catch (error) {
        expect(error).toEqual("merchant settings error");
        expect(requestMerchantSettingsSpy).toBeCalledTimes(1);
        expect(requestDeviceTokenSpy).toBeCalledTimes(0);
      }
    });

    it("should throws error when requestDeviceToken request fails", async () => {
      requestDeviceTokenSpy = jest.fn().mockRejectedValue("device token error");

      mockKushkiGateway(undefined, requestDeviceTokenSpy);

      try {
        await CardService.requestDeviceToken(kushkiInstance, bodyMock);
      } catch (error) {
        expect(error).toEqual("device token error");
        expect(requestMerchantSettingsSpy).toBeCalledTimes(1);
        expect(requestDeviceTokenSpy).toBeCalledTimes(1);
      }
    });
  });

  describe("requestDeviceToken - method for sift science", () => {
    it("when body have userId and sessionId props, must call device token with this params", async () => {
      bodyMock.userId = siftscienceSessionAndUserMock;
      bodyMock.sessionId = siftscienceSessionAndUserMock;

      const tokenResponse = await CardService.requestDeviceToken(
        kushkiInstance,
        bodyMock
      );

      expect(tokenResponse).toEqual(deviceTokenMock);
      expect(requestMerchantSettingsSpy).toBeCalledTimes(1);
      expect(requestDeviceTokenSpy).toBeCalledTimes(1);
      expect(requestDeviceTokenSpy).toBeCalledWith(
        expect.anything(),
        expect.objectContaining({
          sessionId: siftscienceSessionAndUserMock,
          userId: siftscienceSessionAndUserMock
        })
      );
    });

    it("when merchant have sift science enabled, must create sift science session and call device token with session and user id`s", async () => {
      isSiftScienceEnabledSpy = jest.fn().mockReturnValue(true);
      mockSiftScienceProvider(isSiftScienceEnabledSpy, undefined);

      const tokenResponse = await CardService.requestDeviceToken(
        kushkiInstance,
        bodyMock
      );

      expect(tokenResponse).toEqual(deviceTokenMock);
      expect(requestMerchantSettingsSpy).toBeCalledTimes(1);
      expect(isSiftScienceEnabledSpy).toBeCalledTimes(1);
      expect(createSiftScienceSessionSpy).toBeCalledTimes(1);
      expect(requestDeviceTokenSpy).toBeCalledTimes(1);
      expect(requestDeviceTokenSpy).toBeCalledWith(
        expect.anything(),
        expect.objectContaining({
          sessionId: siftscienceSessionAndUserMock,
          userId: siftscienceSessionAndUserMock
        })
      );
    });
  });

  describe("requestDeviceToken - method for 3DS Sandbox", () => {
    beforeEach(() => {
      merchantSettingsMock.active_3dsecure = true;
      merchantSettingsMock.sandboxEnable = true;

      requestMerchantSettingsSpy = jest
        .fn()
        .mockResolvedValue(merchantSettingsMock);

      mockKushkiGateway(requestMerchantSettingsSpy, undefined);

      jest.spyOn(Utils, "getJwtIf3dsEnabled").mockResolvedValue(jwtMock);
    });
    it("should request jwt and call device token with this for sandbox", async () => {
      const tokenResponse = await CardService.requestDeviceToken(
        kushkiInstance,
        bodyMock
      );

      expect(tokenResponse).toEqual(deviceTokenMock);
      expect(requestMerchantSettingsSpy).toBeCalledTimes(1);
      expect(requestDeviceTokenSpy).toBeCalledTimes(1);
      expect(requestDeviceTokenSpy).toBeCalledWith(
        expect.anything(),
        expect.objectContaining({ jwt: jwtMock })
      );
      expect(validateSandbox3dsTokenSpy).toBeCalledTimes(1);
    });

    it("should return error when sandbox validation fails", async () => {
      validateSandbox3dsTokenSpy = jest
        .fn()
        .mockRejectedValue("sandbox 3DS validation error");
      mockSandbox3DSProvider(validateSandbox3dsTokenSpy);

      try {
        await CardService.requestDeviceToken(kushkiInstance, bodyMock);
      } catch (error) {
        expect(requestMerchantSettingsSpy).toBeCalledTimes(1);
        expect(requestDeviceTokenSpy).toBeCalledTimes(1);
        expect(requestDeviceTokenSpy).toBeCalledWith(
          expect.anything(),
          expect.objectContaining({ jwt: jwtMock })
        );
        expect(validateSandbox3dsTokenSpy).toBeCalledTimes(1);
        expect(error).toEqual("sandbox 3DS validation error");
      }
    });
  });

  describe("requestDeviceToken - method for 3DS Cardinal", () => {
    beforeEach(() => {
      merchantSettingsMock.active_3dsecure = true;

      requestMerchantSettingsSpy = jest
        .fn()
        .mockResolvedValue(merchantSettingsMock);

      mockKushkiGateway(requestMerchantSettingsSpy, undefined);

      jest.spyOn(Utils, "getJwtIf3dsEnabled").mockResolvedValue(jwtMock);
    });
    it("should request jwt and call device token with this for cardinal", async () => {
      const tokenResponse = await CardService.requestDeviceToken(
        kushkiInstance,
        bodyMock
      );

      expect(tokenResponse).toEqual(deviceTokenMock);
      expect(requestMerchantSettingsSpy).toBeCalledTimes(1);
      expect(requestDeviceTokenSpy).toBeCalledTimes(1);
      expect(requestDeviceTokenSpy).toBeCalledWith(
        expect.anything(),
        expect.objectContaining({ jwt: jwtMock })
      );
      expect(validateCardinal3dsTokenSpy).toBeCalledTimes(1);
    });

    it("should return error when cardinal validation fails", async () => {
      validateCardinal3dsTokenSpy = jest
        .fn()
        .mockRejectedValue("cardinal 3DS validation error");
      mockCardinal3DSProvider(validateCardinal3dsTokenSpy);

      try {
        await CardService.requestDeviceToken(kushkiInstance, bodyMock);
      } catch (error) {
        expect(requestMerchantSettingsSpy).toBeCalledTimes(1);
        expect(requestDeviceTokenSpy).toBeCalledTimes(1);
        expect(requestDeviceTokenSpy).toBeCalledWith(
          expect.anything(),
          expect.objectContaining({ jwt: jwtMock })
        );
        expect(validateCardinal3dsTokenSpy).toBeCalledTimes(1);
        expect(error).toEqual("cardinal 3DS validation error");
      }
    });
  });

  describe("validateToken - method", () => {
    const kushkiInstance = new Kushki({
      inTest: false,
      publicCredentialId: "123456"
    });

    let cardService: CardService;

    beforeEach(() => {
      cardService = new CardService(kushkiInstance);
    });

    it("should return token when token not needs authorization", async () => {
      const tokenMock: CardTokenResponse = {
        token: "567890"
      };

      const tokenResponse: TokenResponse = await cardService.validateToken(
        tokenMock
      );

      expect(tokenResponse).toEqual(tokenMock);
    });

    it("should return token with sandbox validation when merchant have 3DS with sandbox", async () => {
      // @ts-ignore
      cardService._isActive3dsecure = true;
      // @ts-ignore
      cardService._isSandboxEnabled = true;

      const tokenMock: CardTokenResponse = {
        ...deviceTokenMock,
        secureService: "3dsecure"
      };
      const tokenResponse: TokenResponse = await cardService.validateToken(
        tokenMock
      );

      expect(tokenResponse).toEqual(deviceTokenMock);
      expect(validateSandbox3dsTokenSpy).toBeCalledTimes(1);
      expect(validateCardinal3dsTokenSpy).toBeCalledTimes(0);
    });

    it("should return token with cardinal validation when merchant have 3DS with cardinal", async () => {
      // @ts-ignore
      cardService._isActive3dsecure = true;
      // @ts-ignore
      cardService._isSandboxEnabled = false;

      const tokenMock: CardTokenResponse = {
        ...deviceTokenMock,
        secureService: "3dsecure"
      };
      const tokenResponse: TokenResponse = await cardService.validateToken(
        tokenMock
      );

      expect(tokenResponse).toEqual(deviceTokenMock);
      expect(validateSandbox3dsTokenSpy).toBeCalledTimes(0);
      expect(validateCardinal3dsTokenSpy).toBeCalledTimes(1);
    });
  });
});
