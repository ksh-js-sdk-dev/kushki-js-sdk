export interface ICardApplePay {
  onClick(callback: () => void): void;
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
