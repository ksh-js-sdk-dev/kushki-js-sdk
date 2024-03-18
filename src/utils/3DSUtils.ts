import { CardTokenResponse } from "types/card_token_response";
import { SecureOtpResponse } from "types/secure_otp_response";
import { MerchantSettingsResponse } from "types/merchant_settings_response";
import { CybersourceJwtResponse } from "types/cybersource_jwt_response";
import { IKushki } from "repository/IKushki.ts";
import { ISandbox3DSProvider } from "repository/ISandbox3DSProvider.ts";
import { ICardinal3DSProvider } from "repository/ICardinal3DSProvider.ts";
import { IKushkiGateway } from "repository/IKushkiGateway.ts";
import { Buffer } from "buffer";

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

export const getJwtIf3dsEnabled = async (
  merchantSettings: MerchantSettingsResponse,
  kushkiInstance: IKushki,
  gateway: IKushkiGateway,
  sandbox3DS: ISandbox3DSProvider,
  cardinal3DS: ICardinal3DSProvider,
  accountNumber: string,
  subscriptionId?: string
): Promise<string | undefined> => {
  if (merchantSettings.active_3dsecure) {
    const jwtResponse: CybersourceJwtResponse =
      await gateway.requestCybersourceJwt(kushkiInstance, subscriptionId);
    const bin = subscriptionId
      ? Buffer.from(jwtResponse.identifier!, "base64").toString("ascii")
      : accountNumber;

    if (merchantSettings.sandboxEnable) sandbox3DS.initSandbox();
    else await cardinal3DS.initCardinal(kushkiInstance, jwtResponse.jwt, bin);

    return jwtResponse.jwt;
  } else {
    return undefined;
  }
};
