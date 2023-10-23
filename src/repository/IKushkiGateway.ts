import { BinInfoResponse } from "types/bin_info_response";
import { IKushki } from "Kushki";
import { DeferredByBinOptionsResponse } from "Kushki/Card";
import { BinBody } from "types/bin_body";
import { MerchantSettingsResponse } from "types/merchant_settings_response";
import { CybersourceJwtResponse } from "types/cybersource_jwt_response";
import { SecureOtpRequest } from "types/secure_otp_request";
import { SecureOtpResponse } from "types/secure_otp_response";

export interface IKushkiGateway {
  /**
   * Request bin card information
   */
  requestBinInfo(
    kushkiInstance: IKushki,
    body: BinBody
  ): Promise<BinInfoResponse>;

  /**
   * Request deferred card information
   * @param kushkiInstance
   * @param body
   */
  requestDeferredInfo(
    kushkiInstance: IKushki,
    body: BinBody
  ): Promise<DeferredByBinOptionsResponse[]>;

  /**
   * Request card Merchant Settings
   */
  requestMerchantSettings(
    kushkiInstance: IKushki
  ): Promise<MerchantSettingsResponse>;

  /**
   * Request Cybersource JWT
   */
  requestCybersourceJwt(
    kushkiInstance: IKushki
  ): Promise<CybersourceJwtResponse>;

  /**
   * Request Secure validation
   */
  requestSecureServiceValidation(
    kushkiInstance: IKushki,
    body: SecureOtpRequest
  ): Promise<SecureOtpResponse>;
}
