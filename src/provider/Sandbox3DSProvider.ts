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
import { KushkiCardinalSandbox } from "cardinal-sandbox-js-santy";
import { ISandbox3DSProvider } from "repository/ISandbox3DSProvider.ts";
import { injectable } from "inversify";

@injectable()
export class Sandbox3DSProvider implements ISandbox3DSProvider {
  private readonly _gateway: IKushkiGateway;
  constructor() {
    this._gateway = CONTAINER.get<KushkiGateway>(IDENTIFIERS.KushkiGateway);
  }

  public initSandbox() {
    KushkiCardinalSandbox.init();
  }

  public async validateSandbox3dsToken(
    kushkiInstance: IKushki,
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
      await this._launch3DSSandboxValidation(kushkiInstance, cardTokenResponse);

      return Promise.resolve({
        deferred: deferredValues,
        token: cardTokenResponse.token
      });
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
