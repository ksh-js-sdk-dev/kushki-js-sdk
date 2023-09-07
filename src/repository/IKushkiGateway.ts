import { BinInfoResponse } from "types/bin_info_response";
import { Kushki } from "Kushki";
import { BinBody } from "types/bin_body";
import { CardTokenRequest, TokenResponse } from "Kushki/card";
import { MerchantSettingsResponse } from "types/merchant_settings_response";
import { CybersourceJwtResponse } from "types/cybersource_jwt_response";
import { SecureOtpRequest } from "types/secure_otp_request";
import { SecureOtpResponse } from "types/secure_otp_response";

export interface IKushkiGateway {
  /**
   * Request bin card information
   */
  requestBinInfo(
    kushkiInstance: Kushki,
    body: BinBody
  ): Promise<BinInfoResponse>;

  /**
   * Request card Token
   */
  requestToken(
    kushkiInstance: Kushki,
    body: CardTokenRequest
  ): Promise<TokenResponse>;

  /**
   * Request card Subscription Token
   */
  requestCreateSubscriptionToken(
    kushkiInstance: Kushki,
    body: CardTokenRequest
  ): Promise<TokenResponse>;

  /**
   * Request card Merchant Settings
   */
  requestMerchantSettings(
    kushkiInstance: Kushki
  ): Promise<MerchantSettingsResponse>;

  /**
   * Request Cybersource JWT
   */
  requestCybersourceJwt(
    kushkiInstance: Kushki
  ): Promise<CybersourceJwtResponse>;

  /**
   * Request Secure validation
   */
  requestSecureServiceValidation(
    kushkiInstance: Kushki,
    body: SecureOtpRequest
  ): Promise<SecureOtpResponse>;
}
