import { IKushki } from "repository/IKushki.ts";
import { BankListResponse } from "types/bank_list_response";
import { KushkiGateway } from "gateway/KushkiGateway.ts";
import { CONTAINER } from "infrastructure/Container.ts";
import { IDENTIFIERS } from "src/constant/Identifiers.ts";

export class TransferService {
  public static requestBankList(
    kushkiInstance: IKushki
  ): Promise<BankListResponse> {
    const gateway = CONTAINER.get<KushkiGateway>(IDENTIFIERS.KushkiGateway);

    return gateway.requestBankList(kushkiInstance);
  }
}
