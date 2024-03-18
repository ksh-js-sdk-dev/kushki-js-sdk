import { KushkiGateway } from "./KushkiGateway";
import axios, { AxiosError } from "axios";
import { Mock } from "ts-mockery";
import { IKushki } from "Kushki";
import { EnvironmentEnum } from "infrastructure/EnvironmentEnum";
import { MerchantSettingsResponse } from "types/merchant_settings_response";
import { CybersourceJwtResponse } from "types/cybersource_jwt_response";
import { SecureOtpResponse } from "types/secure_otp_response";
import { SecureOtpRequest } from "types/secure_otp_request";
import { BankListResponse } from "types/bank_list_response";
import { CommissionConfigurationResponse } from "types/commission_configuration_response";
import { CommissionConfigurationRequest } from "types/commission_configuration_request";
import { SubscriptionUserIdResponse } from "types/subscription_user_id_response";
import { DeviceTokenRequest } from "types/device_token_request";
import { CardTokenResponse } from "types/card_token_response";

jest.mock("axios");

describe("KushkiGateway - Test", () => {
  let kushkiGateway: KushkiGateway;
  let mockKushki: IKushki;

  beforeEach(async () => {
    kushkiGateway = new KushkiGateway();

    mockKushki = Mock.of<IKushki>({
      getBaseUrl: () => EnvironmentEnum.uat,
      getPublicCredentialId: () => "123456"
    });
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

  it("when called requestDeferredInfo return data on success", async () => {
    const mockData = { brand: "Visa" };
    const binBody = { bin: "123456" };

    const axiosGetSpy = jest.fn(() => {
      return Promise.resolve({
        data: mockData
      });
    });

    jest.spyOn(axios, "get").mockImplementation(axiosGetSpy);

    const result = await kushkiGateway.requestDeferredInfo(mockKushki, binBody);

    expect(result).toEqual(mockData);
  });

  it("When requestDeferredInfo throws an AxiosError", async () => {
    const binBody = { bin: "123456" };

    jest.spyOn(axios, "get").mockRejectedValue(new AxiosError(""));

    try {
      await kushkiGateway.requestDeferredInfo(mockKushki, binBody);
    } catch (error: any) {
      expect(error.code).toEqual("E001");
    }
  });

  describe("requestMerchantSettings - Test", () => {
    const mockMerchantSettings: MerchantSettingsResponse = {
      country: "Ecuador",
      merchant_name: "Test",
      merchantName: "Test",
      processor_name: "Test",
      prodBaconKey: "123",
      sandboxBaconKey: "123"
    };

    it("when called requestMerchantSettings return data on success", async () => {
      const axiosGetSpy = jest.fn(() => {
        return Promise.resolve({
          data: mockMerchantSettings
        });
      });

      jest.spyOn(axios, "get").mockImplementation(axiosGetSpy);

      const merchantResponse: MerchantSettingsResponse =
        await kushkiGateway.requestMerchantSettings(mockKushki);

      expect(merchantResponse).toEqual(mockMerchantSettings);
    });

    it("When requestMerchantSettings throws an AxiosError", async () => {
      jest.spyOn(axios, "get").mockRejectedValue(new AxiosError(""));

      try {
        await kushkiGateway.requestMerchantSettings(mockKushki);
      } catch (error: any) {
        expect(error.code).toEqual("E003");
      }
    });
  });

  describe("requestCybersourceJwt - Test", () => {
    const mockCybersourceJwt: CybersourceJwtResponse = {
      jwt: "1234567890"
    };

    it("when called requestCybersourceJwt return data on success", async () => {
      const axiosGetSpy = jest.fn(() => {
        return Promise.resolve({
          data: mockCybersourceJwt
        });
      });

      jest.spyOn(axios, "get").mockImplementation(axiosGetSpy);

      const jwtResponse: CybersourceJwtResponse =
        await kushkiGateway.requestCybersourceJwt(mockKushki);

      expect(jwtResponse).toEqual(mockCybersourceJwt);
    });

    it("when called requestCybersourceJwt with subscriptionId must call axios with queryParam", async () => {
      const axiosGetSpy = jest.fn(() => {
        return Promise.resolve({
          data: mockCybersourceJwt
        });
      });

      const getSpy = jest.spyOn(axios, "get").mockImplementation(axiosGetSpy);

      const jwtResponse: CybersourceJwtResponse =
        await kushkiGateway.requestCybersourceJwt(mockKushki, "12344");

      expect(jwtResponse).toEqual(mockCybersourceJwt);
      expect(getSpy).toHaveBeenCalledWith(
        expect.stringContaining("?subscriptionId=12344"),
        expect.anything()
      );
    });

    it("When requestCybersourceJwt throws an AxiosError", async () => {
      jest.spyOn(axios, "get").mockRejectedValue(new AxiosError(""));

      try {
        await kushkiGateway.requestCybersourceJwt(mockKushki);
      } catch (error: any) {
        expect(error.code).toEqual("E004");
      }
    });
  });

  describe("requestSecureServiceValidation - Test", () => {
    const mockSecureOtpResponse: SecureOtpResponse = { isValid: true };
    const secureOtpBody: SecureOtpRequest = {
      otpValue: "string098765432",
      secureServiceId: "12345678i9"
    };

    it("when called requestSecureServiceValidation return data on success", async () => {
      const axiosPostSpy = jest.fn(() => {
        return Promise.resolve({
          data: mockSecureOtpResponse
        });
      });

      jest.spyOn(axios, "post").mockImplementation(axiosPostSpy);

      const secureOtpResponse: SecureOtpResponse =
        await kushkiGateway.requestSecureServiceValidation(
          mockKushki,
          secureOtpBody
        );

      expect(secureOtpResponse).toEqual(mockSecureOtpResponse);
    });

    it("When requestSecureServiceValidation throws an AxiosError", async () => {
      jest.spyOn(axios, "post").mockRejectedValue(new AxiosError(""));

      try {
        await kushkiGateway.requestSecureServiceValidation(
          mockKushki,
          secureOtpBody
        );
      } catch (error: any) {
        expect(error.code).toEqual("E006");
      }
    });
  });

  describe("requestBankList - Test", () => {
    const mockBankList: BankListResponse = [
      {
        code: "1234567890",
        name: "test1"
      }
    ];

    it("when called requestBankList return data on success", async () => {
      const axiosGetSpy = jest.fn(() => {
        return Promise.resolve({
          data: mockBankList
        });
      });

      jest.spyOn(axios, "get").mockImplementation(axiosGetSpy);

      const bankListResponse: BankListResponse =
        await kushkiGateway.requestBankList(mockKushki);

      expect(bankListResponse).toEqual(mockBankList);
    });

    it("When requestBankList throws an AxiosError", async () => {
      jest.spyOn(axios, "get").mockRejectedValue(new AxiosError(""));

      try {
        await kushkiGateway.requestBankList(mockKushki);
      } catch (error: any) {
        expect(error.code).toEqual("E014");
      }
    });
  });

  describe("requestCommissionConfiguration - Test", () => {
    const request: CommissionConfigurationRequest = {
      currency: "USD",
      totalAmount: 444
    };
    const mockCommissionConfig: CommissionConfigurationResponse = {
      amount: {
        currency: "USD",
        iva: 10,
        subtotalIva: 20,
        subtotalIva0: 30
      },
      commissionMerchantName: "test",
      merchantId: "12334",
      parentMerchantName: "test",
      totalAmount: 444
    };

    it("when called requestCommissionConfiguration return data on success", async () => {
      const axiosPostSpy = jest.fn(() => {
        return Promise.resolve({
          data: mockCommissionConfig
        });
      });

      jest.spyOn(axios, "post").mockImplementation(axiosPostSpy);

      const commissionConfigResponse: CommissionConfigurationResponse =
        await kushkiGateway.requestCommissionConfiguration(mockKushki, request);

      expect(commissionConfigResponse).toEqual(mockCommissionConfig);
    });

    it("When requestCommissionConfiguration throws an AxiosError", async () => {
      jest.spyOn(axios, "post").mockRejectedValue(new AxiosError(""));

      try {
        await kushkiGateway.requestCommissionConfiguration(mockKushki, request);
      } catch (error: any) {
        expect(error.code).toEqual("E015");
      }
    });
  });

  describe("requestSubscriptionUserId - Test", () => {
    const mockUserId: SubscriptionUserIdResponse = {
      userId: "12345"
    };

    it("when called requestSubscriptionUserId return data on success", async () => {
      const axiosPostSpy = jest.fn(() => {
        return Promise.resolve({
          data: mockUserId
        });
      });

      jest.spyOn(axios, "post").mockImplementation(axiosPostSpy);

      const userIdResponse: SubscriptionUserIdResponse =
        await kushkiGateway.requestSubscriptionUserId(mockKushki, "0000");

      expect(userIdResponse).toEqual(mockUserId);
    });

    it("When requestSubscriptionUserId throws an AxiosError", async () => {
      jest.spyOn(axios, "post").mockRejectedValue(new AxiosError(""));

      try {
        await kushkiGateway.requestSubscriptionUserId(mockKushki, "0000");
      } catch (error: any) {
        expect(error.code).toEqual("E016");
      }
    });
  });

  describe("requestDeviceToken - Test", () => {
    const request: DeviceTokenRequest = {
      subscriptionId: "1111"
    };
    const mockCardToken: CardTokenResponse = {
      token: "12121212"
    };

    it("when called requestDeviceToken return data on success", async () => {
      const axiosPostSpy = jest.fn(() => {
        return Promise.resolve({
          data: mockCardToken
        });
      });

      jest.spyOn(axios, "post").mockImplementation(axiosPostSpy);

      const cardTokenResponse: CardTokenResponse =
        await kushkiGateway.requestDeviceToken(mockKushki, request);

      expect(cardTokenResponse).toEqual(mockCardToken);
    });

    it("When requestDeviceToken throws an AxiosError", async () => {
      jest.spyOn(axios, "post").mockRejectedValue(new AxiosError(""));

      try {
        await kushkiGateway.requestDeviceToken(mockKushki, request);
      } catch (error: any) {
        expect(error.code).toEqual("E017");
      }
    });
  });
});
