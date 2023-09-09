/**
 * SiftScience Service file
 */
import { inject, injectable } from "inversify";
import "reflect-metadata";
import { IKushkiGateway } from "repository/IKushkiGateway";
import { ISiftScienceService } from "repository/ISiftScienceService";
import { MerchantSettingsResponse } from "types/merchant_settings_response";
import { Kushki } from "Kushki";
import { v4 } from "uuid";
import { SiftScienceEnum } from "infrastructure/SiftScienceEnum";
import { SiftScienceObject } from "types/sift_science_object";
import { IDENTIFIERS } from "src/constant/Identifiers";

/**
 * Implementation
 */
@injectable()
export class SiftScienceService implements ISiftScienceService {
  private readonly _gateway: IKushkiGateway;

  constructor(@inject(IDENTIFIERS.KushkiGateway) gateway: IKushkiGateway) {
    this._gateway = gateway;
  }

  public createSiftScienceSession(
    processor: string,
    clientIdentification: string,
    kushkiInstance: Kushki
  ): Promise<SiftScienceObject> {
    return new Promise<SiftScienceObject>(
      // eslint-disable-next-line no-async-promise-executor
      async (resolve, reject) => {
        try {
          const merchant = await this._gateway.requestMerchantSettings(
            kushkiInstance
          );

          const siftEnvironment: string = kushkiInstance.getEnvironment()
            ? SiftScienceEnum.uat
            : SiftScienceEnum.prod;

          if (this._validateMerchantSettings(siftEnvironment, merchant))
            return {
              sessionId: null,
              userId: null
            };

          const userId: string = `${kushkiInstance.getPublicCredentialId()}${processor}${clientIdentification}`;
          const sessionId: string = v4();

          resolve({
            sessionId,
            userId
          });
        } catch (error) {
          reject(error);
        }
      }
    );
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
