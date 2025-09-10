import { ApplePayGetTokenRequest } from "types/apple_pay_get_token_request";
import { ApplePayStartSessionRequest } from "types/apple_pay_start_session_request";
import { BinInfoResponse } from "types/bin_info_response";
import { IKushki } from "Kushki";
import { CardTokenResponse, DeferredByBinOptionsResponse } from "Kushki/Card";
import { BinBody } from "types/bin_body";
import { BrandByMerchantResponse } from "types/brand_by_merchant_response";
import { MerchantSettingsResponse } from "types/merchant_settings_response";
import { CybersourceJwtResponse } from "types/cybersource_jwt_response";
import { SecureOtpRequest } from "types/secure_otp_request";
import { SecureOtpResponse } from "types/secure_otp_response";
import { BankListResponse } from "types/bank_list_response";
import { CommissionConfigurationRequest } from "types/commission_configuration_request";
import { CommissionConfigurationResponse } from "types/commission_configuration_response";
import { SubscriptionUserIdResponse } from "types/subscription_user_id_response";
import { DeviceTokenRequest } from "types/device_token_request";

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
    kushkiInstance: IKushki,
    subscriptionId?: string
  ): Promise<CybersourceJwtResponse>;

  /**
   * Request Secure validation
   */
  requestSecureServiceValidation(
    kushkiInstance: IKushki,
    body: SecureOtpRequest
  ): Promise<SecureOtpResponse>;

  /**
   * Request Bank List
   */
  requestBankList(kushkiInstance: IKushki): Promise<BankListResponse>;

  /**
   * Request Commission Configuration
   */
  requestCommissionConfiguration(
    kushkiInstance: IKushki,
    body: CommissionConfigurationRequest
  ): Promise<CommissionConfigurationResponse>;

  /**
   * Request Commission Configuration
   */
  requestSubscriptionUserId(
    kushkiInstance: IKushki,
    subscriptionId: string
  ): Promise<SubscriptionUserIdResponse>;

  /**
   * Request Device Token for one-click payment or subscription on-demand
   */
  requestDeviceToken(
    kushkiInstance: IKushki,
    body: DeviceTokenRequest
  ): Promise<CardTokenResponse>;

  /**
   * Request Brand Logos by Merchant
   */
  requestBrandLogos(
    kushkiInstance: IKushki
  ): Promise<BrandByMerchantResponse[]>;

  startApplePaySession(
    kushkiInstance: IKushki,
    body: ApplePayStartSessionRequest
  ): Promise<object>;

  getApplePayToken(
    kushkiInstance: IKushki,
    body: ApplePayGetTokenRequest
  ): Promise<CardTokenResponse>;
}
