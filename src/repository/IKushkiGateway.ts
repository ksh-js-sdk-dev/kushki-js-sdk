import { BinInfoResponse } from "types/bin_info_response";
import { Kushki } from "Kushki";
import { BinBody } from "types/bin_body";
import { CardTokenRequest, TokenResponse } from "Kushki/card";
import { MerchantSettingsResponse } from "types/merchant_settings_response";

export interface IKushkiGateway {
  /**
   * Request deferred information by bin to Kushki API
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
   * Send merchant settings request to Kushki API
   */
  requestMerchantSettings(
    kushkiInstance: Kushki
  ): Promise<MerchantSettingsResponse>;
}
