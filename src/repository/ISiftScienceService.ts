/**
 * Interface Sift Science Service file.
 */
import { Kushki } from "Kushki";
import { MerchantSettingsResponse } from "types/merchant_settings_response";
import { SiftScienceObject } from "types/sift_science_object";

export interface ISiftScienceService {
  /**
   *  create createSiftScienceSession
   */
  createSiftScienceSession(
    processor: string,
    clientIdentification: string,
    kushkiInstance: Kushki,
    merchantSettingsResponse: MerchantSettingsResponse,
    userId?: string
  ): SiftScienceObject;
}
