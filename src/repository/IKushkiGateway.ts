import { BinInfoResponse } from "types/bin_info_response";
import { DeferredByBinOptionsResponse } from "Kushki";
import { BinBody } from "types/bin_body";
import { CardTokenRequest, CardTokenResponse } from "src/module";
import { MerchantSettingsResponse } from "types/merchant_settings_response";
import { CybersourceJwtResponse } from "types/cybersource_jwt_response";
import { SecureOtpRequest } from "types/secure_otp_request";
import { SecureOtpResponse } from "types/secure_otp_response";

export interface IKushkiGateway {
  /**
   * Request bin card information
   */
  requestBinInfo(body: BinBody): Promise<BinInfoResponse>;

  /**
   * Request deferred card information
   * @param kushkiInstance
   * @param body
   */
  requestDeferredInfo(body: BinBody): Promise<DeferredByBinOptionsResponse[]>;
  /**
   * Request card Token
   */
  requestToken(body: CardTokenRequest): Promise<CardTokenResponse>;

  /**
   * Request card Subscription Token
   */
  requestCreateSubscriptionToken(
    body: CardTokenRequest
  ): Promise<CardTokenResponse>;

  /**
   * Request card Merchant Settings
   */
  requestMerchantSettings(): Promise<MerchantSettingsResponse>;

  /**
   * Request Cybersource JWT
   */
  requestCybersourceJwt(): Promise<CybersourceJwtResponse>;

  /**
   * Request Secure validation
   */
  requestSecureServiceValidation(
    body: SecureOtpRequest
  ): Promise<SecureOtpResponse>;
}
