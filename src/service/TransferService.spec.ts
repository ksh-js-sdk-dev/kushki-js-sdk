import { BankListResponse } from "types/bank_list_response";
import { init } from "Kushki";
import { TransferService } from "service/TransferService.ts";
import { KushkiError } from "infrastructure/KushkiError.ts";
import { ERRORS } from "infrastructure/ErrorEnum.ts";
import { KushkiGateway } from "gateway/KushkiGateway.ts";

jest.mock("gateway/KushkiGateway.ts");

describe("TransferService - Test", () => {
  const initKushki = async () => {
    return await init({ inTest: true, publicCredentialId: "1234" });
  };

  const mockKushkiGateway = (bankListMock: Promise<BankListResponse>) => {
    // @ts-ignore
    KushkiGateway.mockImplementation(() => ({
      requestBankList: jest.fn().mockResolvedValue(bankListMock)
    }));
  };

  describe("requestBankList - Test", () => {
    it("should return bank list on success", async () => {
      const bankListMock: BankListResponse = [
        {
          code: "1",
          name: "test"
        }
      ];
      const kushkiInstance = await initKushki();

      mockKushkiGateway(Promise.resolve(bankListMock));

      const response = await TransferService.requestBankList(kushkiInstance);

      expect(response).toEqual(bankListMock);
    });

    it("should return error on gateway fails", async () => {
      const kushkiInstance = await initKushki();

      mockKushkiGateway(Promise.reject(new KushkiError(ERRORS.E014)));

      try {
        await TransferService.requestBankList(kushkiInstance);
      } catch (error: any) {
        expect(error.code).toEqual("E014");
      }
    });
  });
});
