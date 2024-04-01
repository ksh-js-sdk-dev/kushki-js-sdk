import { IKushki } from "repository/IKushki.ts";
import { KushkiGateway } from "gateway/KushkiGateway.ts";
import { CommissionConfigurationResponse } from "types/commission_configuration_response";
import { CommissionConfigurationRequest } from "types/commission_configuration_request";

export class MerchantService {
  public static requestCommissionConfiguration(
    kushkiInstance: IKushki,
    body: CommissionConfigurationRequest
  ): Promise<CommissionConfigurationResponse> {
    const gateway = new KushkiGateway();

    return gateway.requestCommissionConfiguration(kushkiInstance, body);
  }
}
