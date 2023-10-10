/**
 * SiftScienceProvider Unit Tests
 */
import { CONTAINER } from "infrastructure/Container.ts";
import { IKushki } from "Kushki";
import { Mock } from "ts-mockery";
import { EnvironmentEnum } from "infrastructure/EnvironmentEnum.ts";
import { ISiftScienceProvider } from "repository/ISiftScienceProvider.ts";
import { IDENTIFIERS } from "src/constant/Identifiers.ts";
import { MerchantSettingsResponse } from "types/merchant_settings_response";
import { SiftScienceEnum } from "infrastructure/SiftScienceEnum.ts";

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

  afterEach(() => {
    CONTAINER.restore();
  });

  beforeEach(async () => {
    CONTAINER.snapshot();

    mockKushki = Mock.of<IKushki>({
      getBaseUrl: () => EnvironmentEnum.prod,
      getEnvironmentSift: () => SiftScienceEnum.prod,
      getPublicCredentialId: () => "123456",
      isInTest: () => false
    });
  });

  it("test createSiftScienceSession request with environment uat - success", async () => {
    siftScienceService = CONTAINER.get<ISiftScienceProvider>(
      IDENTIFIERS.SiftScienceService
    );

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
    siftScienceService = CONTAINER.get<ISiftScienceProvider>(
      IDENTIFIERS.SiftScienceService
    );

    const data = await siftScienceService.createSiftScienceSession(
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

    siftScienceService = CONTAINER.get<ISiftScienceProvider>(
      IDENTIFIERS.SiftScienceService
    );

    const data = siftScienceService.createSiftScienceSession(
      processor,
      clientIdentification,
      mockKushki,
      merchantSettings
    );

    expect(data).toHaveProperty("userId", undefined);
    expect(data).toHaveProperty("sessionId", undefined);
  });
});
