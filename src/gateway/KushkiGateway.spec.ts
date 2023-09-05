import { KushkiGateway } from "./KushkiGateway";
import axios, { AxiosError } from "axios";
import { Kushki } from "Kushki";
import { CardTokenRequest, TokenResponse } from "Kushki/card";

jest.mock("axios");

describe("KushkiGateway - Test", () => {
  let kushkiGateway: KushkiGateway;
  let kushkiInstance: Kushki;

  beforeEach(async () => {
    kushkiGateway = new KushkiGateway();
    kushkiInstance = await Kushki.init({ publicCredentialId: "1234" });
  });

  afterEach(() => {
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

      const result = await kushkiGateway.requestBinInfo(
        kushkiInstance,
        binBody
      );

      expect(result).toEqual(mockData);
    });

    it("When requestBinInfo throws an error", async () => {
      const binBody = { bin: "123456" };

      jest.spyOn(axios, "get").mockRejectedValue(new Error(""));

      try {
        await kushkiGateway.requestBinInfo(kushkiInstance, binBody);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    });

    it("When requestBinInfo throws an AxiosError", () => {
      const binBody = { bin: "123456" };

      jest.spyOn(axios, "get").mockRejectedValue(new AxiosError(""));

      kushkiGateway.requestBinInfo(kushkiInstance, binBody).catch((error) => {
        expect(error["code"]).toEqual("E001");
      });
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
        kushkiInstance,
        requestTokenBody
      );

      expect(tokenResponse).toEqual(mockToken);
    });

    it("When requestToken throws an AxiosError", async () => {
      jest.spyOn(axios, "post").mockRejectedValue(new AxiosError(""));

      try {
        await kushkiGateway.requestToken(kushkiInstance, requestTokenBody);
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
          kushkiInstance,
          requestSubscriptionTokenBody
        );

      expect(tokenResponse).toEqual(mockToken);
    });

    it("When requestCreateSubscriptionToken throws an AxiosError", async () => {
      jest.spyOn(axios, "post").mockRejectedValue(new AxiosError(""));

      try {
        await kushkiGateway.requestCreateSubscriptionToken(
          kushkiInstance,
          requestSubscriptionTokenBody
        );
      } catch (error: any) {
        expect(error.code).toEqual("E002");
      }
    });
  });
});
