import { CardTokenResponse } from "types/card_token_response";
import { SecureOtpResponse } from "types/secure_otp_response";

export const tokenNotNeedsAuth = (token: CardTokenResponse): boolean => {
  return !!(token.security && !token.security.authRequired) || !token.security;
};

export const tokenHasAllSecurityProperties = (
  token: CardTokenResponse,
  isSandboxEnabled?: boolean
): boolean => {
  const validateVersion = (): boolean =>
    isSandboxEnabled
      ? true
      : +token.security!.specificationVersion.split(".")[0] >= 2;

  return !!(
    token.security &&
    token.security.authRequired &&
    token.security.acsURL !== undefined &&
    token.security.paReq !== undefined &&
    token.security.authenticationTransactionId &&
    validateVersion()
  );
};

export const is3dsValid = (secureOtpResponse: SecureOtpResponse): boolean => {
  return (
    "message" in secureOtpResponse &&
    ((secureOtpResponse.message === "3DS000" &&
      secureOtpResponse.code === "ok") ||
      (secureOtpResponse.code === "3DS000" &&
        secureOtpResponse.message === "ok"))
  );
};
