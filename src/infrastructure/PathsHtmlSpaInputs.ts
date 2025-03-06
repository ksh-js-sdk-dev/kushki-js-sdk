import { InputModelEnum } from "infrastructure/InputModel.enum.ts";

export const PathsHtmlSpaInputs: Record<InputModelEnum, string> = {
  [InputModelEnum.CARDHOLDER_NAME]: "CardHolderName",
  [InputModelEnum.CARD_NUMBER]: "CardNumber",
  [InputModelEnum.DEFERRED]: "Deferred",
  [InputModelEnum.EXPIRATION_DATE]: "ExpirationDate",
  [InputModelEnum.CVV]: "Cvv",
  [InputModelEnum.OTP]: "Otp",
  [InputModelEnum.SUBSCRIPTIONS_CVV]: "SubscriptionsCvv",
  [InputModelEnum.IS_SUBSCRIPTION]: "IsSubscription"
};
