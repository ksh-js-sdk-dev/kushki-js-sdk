import { KushkiGateway } from "./KushkiGateway";
import axios, { AxiosError } from "axios";
import { CardTokenRequest, TokenResponse } from "Kushki/card";
import { CONTAINER } from "infrastructure/Container";
import { IDENTIFIERS } from "src/constant/Identifiers";
import { Mock } from "ts-mockery";
import { Kushki } from "Kushki";
import { EnvironmentEnum } from "infrastructure/EnvironmentEnum";

jest.mock("axios");

describe("KushkiGateway - Test", () => {
  let kushkiGateway: KushkiGateway;
  let mockKushki: Kushki;

  beforeEach(async () => {
    CONTAINER.snapshot();

    kushkiGateway = CONTAINER.get(IDENTIFIERS.KushkiGateway);

    mockKushki = Mock.of<Kushki>({
      getBaseUrl: () => EnvironmentEnum.uat,
      getPublicCredentialId: () => "123456"
    });
  });

  afterEach(() => {
    CONTAINER.restore();
    jest.clearAllMocks();
  });

  describe("requestBinInfo - Test", () => {
    it("when called requestBinInfo return data on success", async () => {
      const mockData = { brand: "Visa" };
      const binBody = { bin: "123456" };

      const axiosGetSpy = jest.fn(() => {
        return Promise.resolve({
          data: mockData
        });
      });

      jest.spyOn(axios, "get").mockImplementation(axiosGetSpy);

      const result = await kushkiGateway.requestBinInfo(mockKushki, binBody);

      expect(result).toEqual(mockData);
    });

    it("When requestBinInfo throws an AxiosError", async () => {
      const binBody = { bin: "123456" };

      jest.spyOn(axios, "get").mockRejectedValue(new AxiosError(""));

      try {
        await kushkiGateway.requestBinInfo(mockKushki, binBody);
      } catch (error: any) {
        expect(error.code).toEqual("E001");
      }
    });
  });

  describe("requestToken - Test", () => {
    const mockToken: TokenResponse = { token: "123456789" };
    const requestTokenBody: CardTokenRequest = {
      card: {
        cvv: "123",
        expiryMonth: "12",
        expiryYear: "34",
        name: "Test",
        number: "4242424242424242"
      },
      currency: "USD",
      totalAmount: 10
    };

    it("when called requestToken return data on success", async () => {
      const axiosPostSpy = jest.fn(() => {
        return Promise.resolve({
          data: mockToken
        });
      });

      jest.spyOn(axios, "post").mockImplementation(axiosPostSpy);

      const tokenResponse: TokenResponse = await kushkiGateway.requestToken(
        mockKushki,
        requestTokenBody
      );

      expect(tokenResponse).toEqual(mockToken);
    });

    it("When requestToken throws an AxiosError", async () => {
      jest.spyOn(axios, "post").mockRejectedValue(new AxiosError(""));

      try {
        await kushkiGateway.requestToken(mockKushki, requestTokenBody);
      } catch (error: any) {
        expect(error.code).toEqual("E002");
      }
    });
  });

  describe("requestCreateSubscriptionToken - Test", () => {
    const mockToken: TokenResponse = { token: "123456789" };
    const requestSubscriptionTokenBody: CardTokenRequest = {
      card: {
        cvv: "123",
        expiryMonth: "12",
        expiryYear: "34",
        name: "Test",
        number: "4242424242424242"
      },
      currency: "USD"
    };

    it("when called requestCreateSubscriptionToken return data on success", async () => {
      const axiosPostSpy = jest.fn(() => {
        return Promise.resolve({
          data: mockToken
        });
      });

      jest.spyOn(axios, "post").mockImplementation(axiosPostSpy);

      const tokenResponse: TokenResponse =
        await kushkiGateway.requestCreateSubscriptionToken(
          mockKushki,
          requestSubscriptionTokenBody
        );

      expect(tokenResponse).toEqual(mockToken);
    });

    it("When requestCreateSubscriptionToken throws an AxiosError", async () => {
      jest.spyOn(axios, "post").mockRejectedValue(new AxiosError(""));

      try {
        await kushkiGateway.requestCreateSubscriptionToken(
          mockKushki,
          requestSubscriptionTokenBody
        );
      } catch (error: any) {
        expect(error.code).toEqual("E002");
      }
    });
  });

  describe("merchantSettings - Test", () => {
    it("when called merchantSettings return data on success", async () => {
      const mockData = {
        country: "Ecuador",
        merchantName: "ipsum dolor",
        processorName: "exercitation deserunt velit",
        prodBaconKey: null,
        sandboxBaconKey: null,
        sandboxEnable: false
      };

      const axiosGetSpy = jest.fn(() => {
        return Promise.resolve({
          data: mockData
        });
      });

      jest.spyOn(axios, "get").mockImplementation(axiosGetSpy);

      const result = await kushkiGateway.requestMerchantSettings(mockKushki);

      expect(result).toEqual(mockData);
    });

    it("When merchantSettings throws an AxiosError", async () => {
      jest.spyOn(axios, "get").mockRejectedValue(new AxiosError(""));

      try {
        await kushkiGateway.requestMerchantSettings(mockKushki);
      } catch (error: any) {
        expect(error.code).toEqual("E003");
      }
    });
  });
});
