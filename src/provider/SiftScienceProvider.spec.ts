/**
 * SiftScienceProvider Unit Tests
 */
import { IKushki } from "Kushki";
import { Mock } from "ts-mockery";
import { EnvironmentEnum } from "infrastructure/EnvironmentEnum.ts";
import { ISiftScienceProvider } from "repository/ISiftScienceProvider.ts";
import { MerchantSettingsResponse } from "types/merchant_settings_response";
import { SiftScienceEnum } from "infrastructure/SiftScienceEnum.ts";
import { SiftScienceProvider } from "src/provider/SiftScienceProvider.ts";
import { Kushki } from "class/Kushki.ts";

describe("SiftScience Gateway - ", () => {
  let siftScienceService: ISiftScienceProvider;
  let mockKushki: IKushki;
  const processor: string = "kushki";
  const clientIdentification: string = "2014098375";
  const merchantSettingsResponse: MerchantSettingsResponse = {
    country: "Ecuador",
    merchant_name: "ipsum dolor",
    processor_name: "exercitation deserunt velit",
    prodBaconKey: "hello123",
    sandboxBaconKey: null,
    sandboxEnable: false
  };

  beforeEach(async () => {
    siftScienceService = new SiftScienceProvider();

    mockKushki = Mock.of<IKushki>({
      getBaseUrl: () => EnvironmentEnum.prod,
      getEnvironmentSift: () => SiftScienceEnum.prod,
      getPublicCredentialId: () => "123456",
      isInTest: () => false
    });
  });

  it("test createSiftScienceSession request with environment uat - success", async () => {
    const data = siftScienceService.createSiftScienceSession(
      processor,
      clientIdentification,
      mockKushki,
      merchantSettingsResponse
    );

    expect(data).toHaveProperty("userId");
    expect(data).toHaveProperty("sessionId");
  });

  it("test createSiftScienceSession request with environment prod - success", async () => {
    const data = siftScienceService.createSiftScienceSession(
      processor,
      clientIdentification,
      mockKushki,
      merchantSettingsResponse
    );

    expect(data).toHaveProperty("userId");
    expect(data).toHaveProperty("sessionId");
  });

  it("test createSiftScienceSession request - without env", async () => {
    const merchantSettings = {
      ...merchantSettingsResponse,
      prodBaconKey: "",
      sandboxBaconKey: null
    };

    const data = siftScienceService.createSiftScienceSession(
      processor,
      clientIdentification,
      mockKushki,
      merchantSettings
    );

    expect(data).toHaveProperty("userId", undefined);
    expect(data).toHaveProperty("sessionId", undefined);
  });

  describe("isSiftScienceEnabled - method", () => {
    const kushkiInstance = new Kushki({
      inTest: true,
      publicCredentialId: "1234"
    });
    let merchantSettingsMock: MerchantSettingsResponse;

    beforeEach(() => {
      merchantSettingsMock = {
        country: "Ecuador",
        merchant_name: "Test",
        processor_name: "test",
        prodBaconKey: null,
        sandboxBaconKey: null
      };
    });

    it("should return true when merchant have siftScience enabled", () => {
      merchantSettingsMock.sandboxBaconKey = "87978798";

      const isEnabled = siftScienceService.isSiftScienceEnabled(
        kushkiInstance,
        merchantSettingsMock
      );

      expect(isEnabled).toBeTruthy();
    });

    it("should return false when merchant not have siftScience enabled", () => {
      const isEnabled = siftScienceService.isSiftScienceEnabled(
        kushkiInstance,
        merchantSettingsMock
      );

      expect(isEnabled).toBeFalsy();
    });
  });
});
