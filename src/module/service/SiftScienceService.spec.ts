/**
 * SiftScienceService Unit Tests
 */
import { CONTAINER } from "infrastructure/Container";
import { Kushki } from "Kushki";
import { Mock } from "ts-mockery";
import { EnvironmentEnum } from "infrastructure/EnvironmentEnum";
import { ISiftScienceService } from "repository/ISiftScienceService";
import { IDENTIFIERS } from "src/constant/Identifiers";

describe("SiftScience Gateway - ", () => {
  let siftScienceService: ISiftScienceService;
  let mockKushki: Kushki;
  const processor: string = "kushki";
  const clientIdentification: string = "2014098375";

  afterEach(() => {
    CONTAINER.restore();
  });

  beforeEach(async () => {
    CONTAINER.snapshot();

    mockKushki = Mock.of<Kushki>({
      getBaseUrl: () => EnvironmentEnum.prod,
      getPublicCredentialId: () => "123456"
    });
  });

  function unbindBind(
    identifier: symbol,
    mockObject: object | (() => void)
  ): void {
    CONTAINER.unbind(identifier);
    CONTAINER.bind(identifier).toConstantValue(mockObject);
  }

  it("test createSiftScienceSession request with environment uat - success", async () => {
    const mockSiftScience = {
      createSiftScienceSession: () => {
        return {
          sessionId: "447a1ca8-c4e2-11ec-9d64-0242ac120002",
          userId: "123456"
        };
      }
    };

    const kushkiGatewayMock = {
      requestMerchantSettings: () => {
        return {
          country: "Ecuador",
          merchantName: "ipsum dolor",
          processorName: "exercitation deserunt velit",
          prodBaconKey: "hello123",
          sandboxBaconKey: null,
          sandboxEnable: false
        };
      }
    };

    unbindBind(IDENTIFIERS.KushkiGateway, kushkiGatewayMock);
    unbindBind(IDENTIFIERS.SiftScienceService, mockSiftScience);

    siftScienceService = CONTAINER.get<ISiftScienceService>(
      IDENTIFIERS.SiftScienceService
    );

    const data = await siftScienceService.createSiftScienceSession(
      processor,
      clientIdentification,
      mockKushki
    );

    expect(data).toHaveProperty("userId");
    expect(data).toHaveProperty("sessionId");
  });

  it("test createSiftScienceSession request with environment prod - success", async () => {
    const mockSiftScience = {
      createSiftScienceSession: () => {
        return {
          sessionId: "447a1ca8-c4e2-11ec-9d64-0242ac120002",
          userId: "123456"
        };
      }
    };

    const kushkiGatewayMock = {
      requestMerchantSettings: () => {
        return {
          country: "Ecuador",
          merchantName: "ipsum dolor",
          processorName: "exercitation deserunt velit",
          prodBaconKey: "hello123",
          sandboxBaconKey: null,
          sandboxEnable: false
        };
      }
    };

    unbindBind(IDENTIFIERS.KushkiGateway, kushkiGatewayMock);
    unbindBind(IDENTIFIERS.SiftScienceService, mockSiftScience);

    siftScienceService = CONTAINER.get<ISiftScienceService>(
      IDENTIFIERS.SiftScienceService
    );

    const data = await siftScienceService.createSiftScienceSession(
      processor,
      clientIdentification,
      mockKushki
    );

    expect(data).toHaveProperty("userId");
    expect(data).toHaveProperty("sessionId");
  });

  it("test createSiftScienceSession request - without env", async () => {
    const mockSiftScience = {
      createSiftScienceSession: () => {
        return {
          sessionId: null,
          userId: null
        };
      }
    };

    const kushkiGatewayMock = {
      requestMerchantSettings: () => {
        return {
          country: "Ecuador",
          merchantName: "ipsum dolor",
          processorName: "exercitation deserunt velit",
          prodBaconKey: "hello123",
          sandboxBaconKey: null,
          sandboxEnable: false
        };
      }
    };

    unbindBind(IDENTIFIERS.KushkiGateway, kushkiGatewayMock);
    unbindBind(IDENTIFIERS.SiftScienceService, mockSiftScience);

    siftScienceService = CONTAINER.get<ISiftScienceService>(
      IDENTIFIERS.SiftScienceService
    );

    const data = await siftScienceService.createSiftScienceSession(
      processor,
      clientIdentification,
      mockKushki
    );

    expect(data).toHaveProperty("userId", null);
    expect(data).toHaveProperty("sessionId", null);
  });
});
