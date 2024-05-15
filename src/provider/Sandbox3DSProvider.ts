import { IKushki } from "Kushki";
import { CardTokenResponse } from "types/card_token_response";
import { KushkiError } from "infrastructure/KushkiError.ts";
import { ERRORS } from "infrastructure/ErrorEnum.ts";
import {
  is3dsValid,
  tokenHasAllSecurityProperties,
  tokenNotNeedsAuth
} from "utils/3DSUtils.ts";
import { SecureOtpResponse } from "types/secure_otp_response";
import { IKushkiGateway } from "repository/IKushkiGateway.ts";
import { KushkiGateway } from "gateway/KushkiGateway.ts";
import { KushkiCardinalSandbox } from "@kushki/cardinal-sandbox-js";
import { ISandbox3DSProvider } from "repository/ISandbox3DSProvider.ts";

export class Sandbox3DSProvider implements ISandbox3DSProvider {
  private readonly _gateway: IKushkiGateway;
  constructor() {
    this._gateway = new KushkiGateway();
  }

  public initSandbox() {
    KushkiCardinalSandbox.init();
  }

  public async validateSandbox3dsToken(
    kushkiInstance: IKushki,
    cardTokenResponse: CardTokenResponse
  ): Promise<CardTokenResponse> {
    if (tokenNotNeedsAuth(cardTokenResponse)) {
      return cardTokenResponse;
    }
    if (tokenHasAllSecurityProperties(cardTokenResponse, true)) {
      await this._launch3DSSandboxValidation(kushkiInstance, cardTokenResponse);

      return cardTokenResponse;
    }

    return Promise.reject(new KushkiError(ERRORS.E005));
  }

  private async _launch3DSSandboxValidation(
    kushkiInstance: IKushki,
    token: CardTokenResponse
  ): Promise<CardTokenResponse> {
    this._launchSandboxModal(token);

    if (await this._onSandboxPaymentValidation(kushkiInstance, token.secureId!))
      return Promise.resolve(token);
    else return Promise.reject(new KushkiError(ERRORS.E006));
  }

  private async _onSandboxPaymentValidation(
    kushkiInstance: IKushki,
    secureServiceId: string
  ): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      KushkiCardinalSandbox.on(
        "payments.validated",
        async (isErrorFlow?: boolean) => {
          if (isErrorFlow) {
            return reject(new KushkiError(ERRORS.E005));
          }

          try {
            const secureValidation: SecureOtpResponse =
              await this._gateway.requestSecureServiceValidation(
                kushkiInstance,
                {
                  otpValue: "",
                  secureServiceId
                }
              );

            return resolve(is3dsValid(secureValidation));
          } catch (error) {
            return reject(new KushkiError(ERRORS.E006));
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
