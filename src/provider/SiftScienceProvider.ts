/**
 * SiftScience Service file
 */
import { ISiftScienceProvider } from "repository/ISiftScienceProvider.ts";
import { MerchantSettingsResponse } from "types/merchant_settings_response";
import { IKushki } from "Kushki";
import { v4 } from "uuid";
import { SiftScienceObject } from "types/sift_science_object";

/**
 * Implementation
 */
export class SiftScienceProvider implements ISiftScienceProvider {
  public createSiftScienceSession(
    processor: string,
    clientIdentification: string,
    kushkiInstance: IKushki,
    merchantSettingsResponse: MerchantSettingsResponse,
    userId?: string
  ): SiftScienceObject {
    const siftEnvironment: string = kushkiInstance.getEnvironmentSift();

    if (
      this._validateMerchantSettings(siftEnvironment, merchantSettingsResponse)
    )
      return {
        sessionId: undefined,
        userId: undefined
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
