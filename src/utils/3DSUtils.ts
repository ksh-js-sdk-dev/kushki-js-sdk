import { CardTokenResponse } from "types/card_token_response";
import { SecureOtpResponse } from "types/secure_otp_response";
import { MerchantSettingsResponse } from "types/merchant_settings_response";
import { CybersourceJwtResponse } from "types/cybersource_jwt_response";
import { IKushki } from "repository/IKushki.ts";
import { ISandbox3DSProvider } from "repository/ISandbox3DSProvider.ts";
import { ICardinal3DSProvider } from "repository/ICardinal3DSProvider.ts";
import { IKushkiGateway } from "repository/IKushkiGateway.ts";
import { Buffer } from "buffer";

export const SECURE_3DS_FIELD = "3dsecure";

export interface GetJwtIf3dsEnabledProps {
  merchantSettings: MerchantSettingsResponse;
  kushkiInstance: IKushki;
  gateway: IKushkiGateway;
  sandbox3DS: ISandbox3DSProvider;
  cardinal3DS: ICardinal3DSProvider;
  accountNumber: string;
  subscriptionId?: string;
}

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
  props: GetJwtIf3dsEnabledProps
): Promise<string | undefined> => {
  if (props.merchantSettings.active_3dsecure) {
    const jwtResponse: CybersourceJwtResponse =
      await props.gateway.requestCybersourceJwt(
        props.kushkiInstance,
        props.subscriptionId
      );
    const bin = props.subscriptionId
      ? Buffer.from(jwtResponse.identifier!, "base64").toString("ascii")
      : props.accountNumber;

    if (props.merchantSettings.sandboxEnable) {
      props.sandbox3DS.initSandbox();

      return jwtResponse.jwt;
    } else {
      await props.cardinal3DS.initCardinal(
        props.kushkiInstance,
        jwtResponse.jwt,
        bin
      );

      return new Promise<string>((resolve) => {
        props.cardinal3DS.onSetUpComplete(async () => {
          resolve(jwtResponse.jwt);
        });
      });
    }
  } else {
    return undefined;
  }
};
