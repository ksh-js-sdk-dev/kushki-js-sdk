import "reflect-metadata";
import { BinBody } from "types/bin_body";
import { BinInfoResponse } from "types/bin_info_response";
import { PathEnum } from "infrastructure/PathEnum.ts";
import { ERRORS } from "infrastructure/ErrorEnum.ts";
import axios from "axios";
import { DeferredByBinOptionsResponse, Kushki } from "Kushki";
import { CardTokenRequest, CardTokenResponse } from "src/module";
import { IKushkiGateway } from "repository/IKushkiGateway";
import { injectable } from "inversify";
import { MerchantSettingsResponse } from "types/merchant_settings_response";
import { CybersourceJwtResponse } from "types/cybersource_jwt_response";
import { SecureOtpRequest } from "types/secure_otp_request";
import { SecureOtpResponse } from "types/secure_otp_response";
import { KushkiError } from "infrastructure/KushkiError.ts";
import { UtilsService } from "service/UtilService.ts";

@injectable()
export class KushkiGateway implements IKushkiGateway {
  private readonly _publicHeader: string = "Public-Merchant-Id";

  public requestBinInfo = async (
    kushkiInstance: Kushki,
    body: BinBody
  ): Promise<BinInfoResponse> => {
    try {
      const url: string = `${kushkiInstance.getBaseUrl()}${PathEnum.bin_info}${
        body.bin
      }`;

      const response = await axios.get(url, {
        headers: this._buildHeader(kushkiInstance.getPublicCredentialId())
      });

      const binInfoResponse: BinInfoResponse = response.data;

      return Promise.resolve(binInfoResponse);
    } catch (error) {
      return Promise.reject(ERRORS.E001);
    }
  };

  public requestDeferredInfo = async (
    kushkiInstance: Kushki,
    body: BinBody
  ): Promise<DeferredByBinOptionsResponse[]> => {
    try {
      const url: string = `${kushkiInstance.getBaseUrl()}${
        PathEnum.deferred_info
      }${body.bin}`;

      const response = await axios.get(url, {
        headers: this._buildHeader(kushkiInstance.getPublicCredentialId())
      });

      const deferredInfoResponse: DeferredByBinOptionsResponse[] =
        response.data;

      return Promise.resolve(deferredInfoResponse);
    } catch (error: any) {
      return Promise.reject(new KushkiError(ERRORS.E001, error.message));
    }
  };

  public requestToken = async (
    kushkiInstance: Kushki,
    body: CardTokenRequest
  ): Promise<CardTokenResponse> => {
    const url: string = `${kushkiInstance.getBaseUrl()}${PathEnum.card_token}`;

    try {
      const { data } = await axios.post<CardTokenResponse>(url, body, {
        headers: this._buildHeader(kushkiInstance.getPublicCredentialId())
      });

      return Promise.resolve(data);
    } catch (error: any) {
      return Promise.reject(new KushkiError(ERRORS.E002, error.message));
    }
  };

  public requestCreateSubscriptionToken = async (
    kushkiInstance: Kushki,
    body: CardTokenRequest
  ): Promise<CardTokenResponse> => {
    const url: string = `${kushkiInstance.getBaseUrl()}${
      PathEnum.card_subscription_token
    }`;

    try {
      const { data } = await axios.post<CardTokenResponse>(url, body, {
        headers: this._buildHeader(kushkiInstance.getPublicCredentialId())
      });

      return Promise.resolve(data);
    } catch (error) {
      return UtilsService.validErrors(error, ERRORS.E002);
    }
  };

  public requestMerchantSettings = async (
    kushkiInstance: Kushki
  ): Promise<MerchantSettingsResponse> => {
    const url: string = `${kushkiInstance.getBaseUrl()}${
      PathEnum.merchant_settings
    }`;

    try {
      const { data } = await axios.get<MerchantSettingsResponse>(url, {
        headers: this._buildHeader(kushkiInstance.getPublicCredentialId())
      });

      return Promise.resolve(data);
    } catch (error: any) {
      return Promise.reject(new KushkiError(ERRORS.E003, error.message));
    }
  };

  public requestCybersourceJwt = async (
    kushkiInstance: Kushki
  ): Promise<CybersourceJwtResponse> => {
    const url: string = `${kushkiInstance.getBaseUrl()}${
      PathEnum.cybersource_jwt
    }`;

    try {
      const { data } = await axios.get<CybersourceJwtResponse>(url, {
        headers: this._buildHeader(kushkiInstance.getPublicCredentialId())
      });

      return Promise.resolve(data);
    } catch (error: any) {
      return Promise.reject(new KushkiError(ERRORS.E004, error.message));
    }
  };

  public requestSecureServiceValidation = async (
    kushkiInstance: Kushki,
    body: SecureOtpRequest
  ): Promise<SecureOtpResponse> => {
    const url: string = `${kushkiInstance.getBaseUrl()}${
      PathEnum.secure_validation
    }`;

    try {
      const { data } = await axios.post<SecureOtpResponse>(url, body, {
        headers: this._buildHeader(kushkiInstance.getPublicCredentialId())
      });

      return Promise.resolve(data);
    } catch (error: any) {
      return Promise.reject(new KushkiError(ERRORS.E006, error.message));
    }
  };

  private _buildHeader(mid: string): object {
    return {
      [this._publicHeader]: mid
    };
  }
}
