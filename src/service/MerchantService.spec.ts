import { init } from "Kushki";
import { KushkiError } from "infrastructure/KushkiError.ts";
import { ERRORS } from "infrastructure/ErrorEnum.ts";
import { CommissionConfigurationResponse } from "types/commission_configuration_response";
import { MerchantService } from "service/MerchantService.ts";
import { CommissionConfigurationRequest } from "types/commission_configuration_request";
import { KushkiGateway } from "gateway/KushkiGateway.ts";

jest.mock("gateway/KushkiGateway.ts");

describe("MerchantService - Test", () => {
  const initKushki = async () => {
    return await init({ inTest: true, publicCredentialId: "1234" });
  };

  const mockKushkiGateway = (
    commissionConfigMock: Promise<CommissionConfigurationResponse>
  ) => {
    // @ts-ignore
    KushkiGateway.mockImplementation(() => ({
      requestCommissionConfiguration: jest
        .fn()
        .mockResolvedValue(commissionConfigMock)
    }));
  };

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

    it("should return commission configon success", async () => {
      const kushkiInstance = await initKushki();

      mockKushkiGateway(Promise.resolve(mockCommissionConfig));

      const response = await MerchantService.requestCommissionConfiguration(
        kushkiInstance,
        request
      );

      expect(response).toEqual(mockCommissionConfig);
    });

    it("should return error on gateway fails", async () => {
      const kushkiInstance = await initKushki();

      mockKushkiGateway(Promise.reject(new KushkiError(ERRORS.E015)));

      try {
        await MerchantService.requestCommissionConfiguration(
          kushkiInstance,
          request
        );
      } catch (error: any) {
        expect(error.code).toEqual("E015");
      }
    });
  });
});
