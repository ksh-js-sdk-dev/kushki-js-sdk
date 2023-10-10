/**
 * Interface Sift Science Service file.
 */
import { IKushki } from "Kushki";
import { MerchantSettingsResponse } from "types/merchant_settings_response";
import { SiftScienceObject } from "types/sift_science_object";

export interface ISiftScienceProvider {
  /**
   *  create createSiftScienceSession
   */
  createSiftScienceSession(
    processor: string,
    clientIdentification: string,
    kushkiInstance: IKushki,
    merchantSettingsResponse: MerchantSettingsResponse,
    userId?: string
  ): SiftScienceObject;
}
