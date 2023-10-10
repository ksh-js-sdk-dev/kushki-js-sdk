import { IKushki } from "Kushki";
import { TokenResponse } from "types/token_response";
import { CardTokenResponse } from "types/card_token_response";
import { DeferredValues } from "types/card_fields_values";
import { KushkiError } from "infrastructure/KushkiError.ts";
import { ERRORS } from "infrastructure/ErrorEnum.ts";
import {
  is3dsValid,
  tokenHasAllSecurityProperties,
  tokenNotNeedsAuth
} from "utils/3DSUtils.ts";
import { SecureOtpResponse } from "types/secure_otp_response";
import { IKushkiGateway } from "repository/IKushkiGateway.ts";
import { CONTAINER } from "infrastructure/Container.ts";
import { KushkiGateway } from "gateway/KushkiGateway.ts";
import { IDENTIFIERS } from "src/constant/Identifiers.ts";
import { KushkiCardinalSandbox } from "@kushki/cardinal-sandbox-js";

export class Sandbox3DSProvider {
  private readonly _kushkiInstance: IKushki;
  private readonly _gateway: IKushkiGateway;
  constructor(kushkiInstance: IKushki) {
    this._kushkiInstance = kushkiInstance;
    this._gateway = CONTAINER.get<KushkiGateway>(IDENTIFIERS.KushkiGateway);
  }

  public async initSandbox() {
    KushkiCardinalSandbox.init();
  }

  public async validateSandbox3dsToken(
    cardTokenResponse: CardTokenResponse,
    deferredValues: DeferredValues
  ): Promise<TokenResponse> {
    if (tokenNotNeedsAuth(cardTokenResponse)) {
      return Promise.resolve({
        deferred: deferredValues,
        token: cardTokenResponse.token
      });
    }
    if (tokenHasAllSecurityProperties(cardTokenResponse, true)) {
      await this._launch3DSSandboxValidation(cardTokenResponse);

      return Promise.resolve({
        deferred: deferredValues,
        token: cardTokenResponse.token
      });
    }

    return Promise.reject(new KushkiError(ERRORS.E005));
  }

  private async _launch3DSSandboxValidation(
    token: CardTokenResponse
  ): Promise<CardTokenResponse> {
    this._launchSandboxModal(token);

    if (await this._onSandboxPaymentValidation(token.secureId!))
      return Promise.resolve(token);
    else return Promise.reject(new KushkiError(ERRORS.E006));
  }

  private async _onSandboxPaymentValidation(
    secureServiceId: string
  ): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      KushkiCardinalSandbox.on(
        "payments.validated",
        async (isErrorFlow?: boolean) => {
          if (isErrorFlow) reject(new KushkiError(ERRORS.E005));

          try {
            const secureValidation: SecureOtpResponse =
              await this._gateway.requestSecureServiceValidation(
                this._kushkiInstance,
                {
                  otpValue: "",
                  secureServiceId
                }
              );

            resolve(is3dsValid(secureValidation));
          } catch (error) {
            reject(new KushkiError(ERRORS.E006));
          }
        }
      );
    });
  }

  private _launchSandboxModal(token: CardTokenResponse) {
    const ccaParameters = {
      AcsUrl: token.security!.acsURL!,
      Payload: token.security!.paReq!
    };
    const ccaOrderDetails = {
      OrderDetails: {
        TransactionId: token.security!.authenticationTransactionId!
      }
    };

    KushkiCardinalSandbox.continue("cca", ccaParameters, ccaOrderDetails);
  }
}
