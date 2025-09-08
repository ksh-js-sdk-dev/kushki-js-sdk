import { ApplePayGetTokenOptions } from "types/apple_pay_get_token_options";
import { CardTokenResponse } from "types/card_token_response";

export interface ICardApplePay {
  onClick(callback: () => void): void;

  requestApplePayToken(
    options: ApplePayGetTokenOptions
  ): Promise<CardTokenResponse>;
}

/**
 *  Apple session object structure
 */
export interface IAppleSession {
  completePayment: (merchantSession: object) => void;
  completeMerchantValidation: (merchantSession: object) => void;
  abort: () => void;
  validationURL: string;
}
