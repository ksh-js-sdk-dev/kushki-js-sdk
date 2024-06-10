/**
 * Interface Sift Science Service file.
 */
import { MerchantSettingsResponse } from "types/merchant_settings_response";
import { SiftScienceObject } from "types/sift_science_object";

export interface ISiftScienceProvider {
  /**
   *  create SiftScience Session for internal process
   */
  createSiftScienceSession(
    processor: string,
    clientIdentification: string,
    merchantSettingsResponse: MerchantSettingsResponse,
    userId?: string
  ): Promise<SiftScienceObject>;

  /**
   *  create Sift Science Session for independent process
   */
  createSiftScienceAntiFraudSession(
    userId: string,
    merchantSettingsResponse: MerchantSettingsResponse
  ): Promise<SiftScienceObject>;

  /**
   *  check if siftScience is disabled
   */
  isSiftScienceDisabled(
    merchantSettingsResponse: MerchantSettingsResponse
  ): boolean;
}
