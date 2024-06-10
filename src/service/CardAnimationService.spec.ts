import { CardAnimationService } from "service/CardAnimationService.ts";
import {
  MasterCardBrandingRequest,
  VisaBrandingRequest
} from "types/card_branding_request";
import { VisaAnimationProvider } from "provider/VisaAnimationProvider.ts";
import { MasterCardAnimationProvider } from "provider/MasterCardAnimationProvider.ts";

jest.mock("provider/VisaAnimationProvider.ts");
jest.mock("provider/MasterCardAnimationProvider.ts");

describe("CardAnimationService - class - tests", () => {
  const initVisaAnimationMock: jest.Mock = jest.fn();
  const initMastercardAnimationMock: jest.Mock = jest.fn();

  const mockVisaProvider = () => {
    // @ts-ignore
    VisaAnimationProvider.mockImplementation(() => ({
      initAnimation: initVisaAnimationMock.mockResolvedValue(undefined)
    }));
  };

  const mockMastercardProvider = () => {
    // @ts-ignore
    MasterCardAnimationProvider.mockImplementation(() => ({
      initAnimation: initMastercardAnimationMock.mockResolvedValue(undefined)
    }));
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockVisaProvider();
    mockMastercardProvider();
  });

  it("should call visa provider when send request with visa brand", async () => {
    const opts: VisaBrandingRequest = {
      brand: "visa"
    };

    const response =
      CardAnimationService.requestInitCardBrandingAnimation(opts);

    await expect(response).resolves.toBeUndefined();
    expect(initMastercardAnimationMock).toHaveBeenCalledTimes(0);
    expect(initVisaAnimationMock).toHaveBeenCalledTimes(1);
  });

  it("should call mastercard provider when send request with mastercard brand", async () => {
    const opts: MasterCardBrandingRequest = {
      brand: "mastercard"
    };

    const response =
      CardAnimationService.requestInitCardBrandingAnimation(opts);

    await expect(response).resolves.toBeUndefined();
    expect(initMastercardAnimationMock).toHaveBeenCalledTimes(1);
    expect(initVisaAnimationMock).toHaveBeenCalledTimes(0);
  });

  it("should throws error when send incorrect brand in request", async () => {
    const opts = {
      brand: "BP"
    };

    const response =
      // @ts-ignore
      CardAnimationService.requestInitCardBrandingAnimation(opts);

    await expect(response).rejects.toHaveProperty("code", "E022");
    expect(initMastercardAnimationMock).toHaveBeenCalledTimes(0);
    expect(initVisaAnimationMock).toHaveBeenCalledTimes(0);
  });
});
