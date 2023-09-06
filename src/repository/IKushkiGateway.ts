import { BinInfoResponse } from "types/bin_info_response";
import { Kushki } from "Kushki";
import { BinBody } from "types/bin_body";

export interface IKushkiGateway {
  /**
   * Request deferred information by bin to Kushki API
   */
  requestBinInfo(
    kushkiInstance: Kushki,
    body: BinBody
  ): Promise<BinInfoResponse>;
}
