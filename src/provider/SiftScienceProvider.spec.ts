/**
 * SiftScienceProvider Unit Tests
 */
import { IKushki } from "Kushki";
import { UtilsProvider } from "provider/UtilsProvider.ts";
import { Mock } from "ts-mockery";
import { EnvironmentEnum } from "infrastructure/EnvironmentEnum.ts";
import { ISiftScienceProvider } from "repository/ISiftScienceProvider.ts";
import { MerchantSettingsResponse } from "types/merchant_settings_response";
import { SiftScienceEnum } from "infrastructure/SiftScienceEnum.ts";
import { SiftScienceProvider } from "src/provider/SiftScienceProvider.ts";

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

  const mockLoadScript = (isError?: boolean) => {
    if (isError) {
      jest
        .spyOn(UtilsProvider, "loadScript")
        .mockRejectedValue(new Error("Error"));

      return;
    }

    jest.spyOn(UtilsProvider, "loadScript").mockResolvedValue();
  };

  beforeEach(async () => {
    mockKushki = Mock.of<IKushki>({
      getBaseUrl: () => EnvironmentEnum.prod,
      getEnvironmentSift: () => SiftScienceEnum.prod,
      getPublicCredentialId: () => "123456",
      isInTest: () => false
    });

    siftScienceService = new SiftScienceProvider(mockKushki);

    mockLoadScript();
  });

  describe("createSiftScienceSession - method", () => {
    it("should return sift object when merchant have sift enabled with processor and clientId", async () => {
      const data = siftScienceService.createSiftScienceSession(
        processor,
        clientIdentification,
        merchantSettingsResponse
      );

      await expect(data).resolves.toHaveProperty("userId");
      await expect(data).resolves.toHaveProperty("sessionId");
    });

    it("should return empty sift object when merchant have sift disabled", async () => {
      const merchantSettings = {
        ...merchantSettingsResponse,
        prodBaconKey: "",
        sandboxBaconKey: null
      };

      const data = siftScienceService.createSiftScienceSession(
        processor,
        clientIdentification,
        merchantSettings
      );

      await expect(data).resolves.toHaveProperty("userId", undefined);
      await expect(data).resolves.toHaveProperty("sessionId", undefined);
    });

    it("should throw error when load script fails", async () => {
      mockLoadScript(true);

      const data = siftScienceService.createSiftScienceSession(
        processor,
        clientIdentification,
        merchantSettingsResponse
      );

      await expect(data).rejects.toHaveProperty("code", "E023");
    });
  });

  describe("createSiftScienceAntiFraudSession - method", () => {
    const userIdMock = "1234412";

    it("should return sift object when merchant have sift enabled", async () => {
      const data = siftScienceService.createSiftScienceAntiFraudSession(
        userIdMock,
        merchantSettingsResponse
      );

      await expect(data).resolves.toHaveProperty("userId");
      await expect(data).resolves.toHaveProperty("sessionId");
    });

    it("should throw an error when merchant have sift disabled", async () => {
      const merchantSettings = {
        ...merchantSettingsResponse,
        prodBaconKey: "",
        sandboxBaconKey: null
      };

      const data = siftScienceService.createSiftScienceAntiFraudSession(
        userIdMock,
        merchantSettings
      );

      await expect(data).rejects.toHaveProperty("code", "E023");
    });

    it("should throw an error when load script fails", async () => {
      mockLoadScript(true);

      const data = siftScienceService.createSiftScienceAntiFraudSession(
        userIdMock,
        merchantSettingsResponse
      );

      await expect(data).rejects.toHaveProperty("code", "E023");
    });
  });

  describe("isSiftScienceEnabled - method", () => {
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

    it("should return false when merchant have siftScience enabled", () => {
      merchantSettingsMock.prodBaconKey = "87978798";

      const isEnabled =
        siftScienceService.isSiftScienceDisabled(merchantSettingsMock);

      expect(isEnabled).toBeFalsy();
    });

    it("should return true when merchant have siftScience disabled", () => {
      const isEnabled =
        siftScienceService.isSiftScienceDisabled(merchantSettingsMock);

      expect(isEnabled).toBeTruthy();
    });
  });
});
