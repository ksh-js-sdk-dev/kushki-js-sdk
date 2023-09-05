import { KushkiGateway } from "./KushkiGateway";
import axios from "axios";
import { Kushki } from "Kushki";

jest.mock("axios");

describe("KushkiGateway", () => {
  let kushkiGateway: KushkiGateway;
  let kushkiInstance: Kushki;

  beforeEach(async () => {
    kushkiGateway = new KushkiGateway();
    kushkiInstance = await Kushki.init({ publicCredentialId: "1234" });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("when called requestBinInfo return data on success", async () => {
    const mockData = { brand: "Visa" };
    const binBody = { bin: "123456" };

    const axiosGetSpy = jest.fn(() => {
      return Promise.resolve({
        data: mockData
      });
    });

    jest.spyOn(axios, "get").mockImplementation(axiosGetSpy);

    const result = await kushkiGateway.requestBinInfo(kushkiInstance, binBody);

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
});
