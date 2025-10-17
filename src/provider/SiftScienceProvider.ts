/**
 * SiftScience Service file
 */
import { ERRORS } from "infrastructure/ErrorEnum.ts";
import { UtilsProvider } from "provider/UtilsProvider.ts";
import { ISiftScienceProvider } from "repository/ISiftScienceProvider.ts";
import { MerchantSettingsResponse } from "types/merchant_settings_response";
import { IKushki } from "Kushki";
import { v4 } from "uuid";
import { SiftScienceObject } from "types/sift_science_object";
import { KushkiError } from "infrastructure/KushkiError.ts";

/**
 * Implementation
 */
export class SiftScienceProvider implements ISiftScienceProvider {
  private readonly SIFT_SCRIPT_ID = "sift-script";
  private readonly SIFT_SCRIPT_URL = "https://cdn.sift.com/s.js";
  private readonly SIFT_PROPERTY: string = "_sift";
  private readonly _kushkiInstance: IKushki;
  private _siftObject: object[];

  constructor(kushkiInstance: IKushki) {
    this._kushkiInstance = kushkiInstance;
    this._siftObject = [];
  }

  public async createSiftScienceSession(
    processor: string,
    clientIdentification: string,
    merchantSettingsResponse: MerchantSettingsResponse,
    userId?: string
  ): Promise<SiftScienceObject> {
    try {
      if (this.isSiftScienceDisabled(merchantSettingsResponse))
        return {
          sessionId: undefined,
          userId: undefined
        };

      await this._initSiftScience();

      const newUserId: string =
        userId ||
        `${this._kushkiInstance.getPublicCredentialId()}${processor}${clientIdentification}`;
      const sessionId: string = v4();

      this._setSiftProperties(merchantSettingsResponse, newUserId, sessionId);

      return {
        sessionId,
        userId: newUserId
      };
    } catch (error) {
      return Promise.reject(new KushkiError(ERRORS.E023));
    }
  }

  public async createSiftScienceAntiFraudSession(
    userId: string,
    merchantSettingsResponse: MerchantSettingsResponse
  ): Promise<SiftScienceObject> {
    try {
      if (this.isSiftScienceDisabled(merchantSettingsResponse))
        throw new KushkiError(ERRORS.E023);

      await this._initSiftScience();

      const newUserId: string = `${userId}${this._kushkiInstance.getPublicCredentialId()}`;
      const sessionId: string = v4();

      this._setSiftProperties(merchantSettingsResponse, newUserId, sessionId);

      return {
        sessionId,
        userId: newUserId
      };
    } catch (error) {
      return Promise.reject(new KushkiError(ERRORS.E023));
    }
  }

  public isSiftScienceDisabled(
    merchantSettings: MerchantSettingsResponse
  ): boolean {
    const siftEnvironment: string = this._kushkiInstance.getEnvironmentSift();

    return (
      merchantSettings[siftEnvironment] === "" ||
      merchantSettings[siftEnvironment] === null
    );
  }

  private async _initSiftScience(): Promise<void> {
    await UtilsProvider.loadScript(this.SIFT_SCRIPT_ID, this.SIFT_SCRIPT_URL);
  }

  private _setSiftProperties(
    merchantSettings: MerchantSettingsResponse,
    userId: string,
    sessionId: string
  ): void {
    const siftEnvironment: string = this._kushkiInstance.getEnvironmentSift();

    // @ts-ignore
    this._siftObject = window[this.SIFT_PROPERTY] ?? [];

    this._siftObject.push(["_setAccount", merchantSettings[siftEnvironment]]);
    this._siftObject.push(["_setUserId", userId]);
    this._siftObject.push(["_setSessionId", sessionId]);
    this._siftObject.push(["_trackPageview"]);
  }
}
