/**
 * SiftScience Service file
 */
import { injectable } from "inversify";
import "reflect-metadata";
import { ISiftScienceService } from "repository/ISiftScienceService";
import { MerchantSettingsResponse } from "types/merchant_settings_response";
import { Kushki } from "Kushki";
import { v4 } from "uuid";
import { SiftScienceObject } from "types/sift_science_object";

/**
 * Implementation
 */
@injectable()
export class SiftScienceService implements ISiftScienceService {
  public createSiftScienceSession(
    processor: string,
    clientIdentification: string,
    kushkiInstance: Kushki,
    merchantSettingsResponse: MerchantSettingsResponse,
    userId?: string
  ): SiftScienceObject {
    const siftEnvironment: string = kushkiInstance.getEnvironmentSift();

    if (
      this._validateMerchantSettings(siftEnvironment, merchantSettingsResponse)
    )
      return {
        sessionId: null,
        userId: null
      };

    const userIdNew: string =
      userId ||
      `${kushkiInstance.getPublicCredentialId()}${processor}${clientIdentification}`;
    const sessionId: string = v4();

    return {
      sessionId,
      userId: userIdNew
    };
  }

  private _validateMerchantSettings(
    siftEnvironment: string,
    merchantSettings: MerchantSettingsResponse
  ): boolean {
    return (
      merchantSettings[siftEnvironment] === "" ||
      merchantSettings[siftEnvironment] === null
    );
  }
}
