import { IKushki } from "repository/IKushki.ts";
import { BankListResponse } from "types/bank_list_response";
import { KushkiGateway } from "gateway/KushkiGateway.ts";

export class TransferService {
  public static requestBankList(
    kushkiInstance: IKushki
  ): Promise<BankListResponse> {
    const gateway = new KushkiGateway();

    return gateway.requestBankList(kushkiInstance);
  }
}
