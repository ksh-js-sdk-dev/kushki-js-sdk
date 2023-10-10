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

declare global {
  // tslint:disable-next-line
  interface Window {
    // tslint:disable-next-line:no-any
    Cardinal: any;
  }
}
export class Cardinal3DSProvider {
  private readonly _kushkiInstance: IKushki;
  private readonly _gateway: IKushkiGateway;
  constructor(kushkiInstance: IKushki) {
    this._kushkiInstance = kushkiInstance;
    this._gateway = CONTAINER.get<KushkiGateway>(IDENTIFIERS.KushkiGateway);
  }

  public async initCardinal(jwt: string, cardBin: string) {
    if (this._kushkiInstance.isInTest())
      await import("libs/cardinal/staging.ts");
    else await import("libs/cardinal/prod.ts");

    await this._setupCardinal(jwt, cardBin);
  }

  public async getCardinal3dsToken(callback: () => void): Promise<void> {
    if (await this._isCardinalInitialized()) {
      callback();
    } else
      window.Cardinal.on("payments.setupComplete", async () => {
        callback();
      });
  }

  public async validateCardinal3dsToken(
    cardTokenResponse: CardTokenResponse,
    deferredValues: DeferredValues
  ): Promise<TokenResponse> {
    if (tokenNotNeedsAuth(cardTokenResponse)) {
      return Promise.resolve({
        deferred: deferredValues,
        token: cardTokenResponse.token
      });
    }
    if (tokenHasAllSecurityProperties(cardTokenResponse, false)) {
      await this._launch3DSCardinalValidation(cardTokenResponse);

      return Promise.resolve({
        deferred: deferredValues,
        token: cardTokenResponse.token
      });
    }

    return Promise.reject(new KushkiError(ERRORS.E005));
  }

  private async _launch3DSCardinalValidation(
    token: CardTokenResponse
  ): Promise<CardTokenResponse> {
    this._launchCardinalModal(token);

    if (await this._onCardinalPaymentValidation(token.secureId!))
      return Promise.resolve(token);
    else return Promise.reject(new KushkiError(ERRORS.E006));
  }

  private async _onCardinalPaymentValidation(
    secureServiceId: string
  ): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      window.Cardinal.on("payments.validated", async () => {
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
      });
    });
  }

  private _launchCardinalModal(token: CardTokenResponse) {
    const ccaParameters = {
      AcsUrl: token.security!.acsURL!,
      Payload: token.security!.paReq!
    };
    const ccaOrderDetails = {
      OrderDetails: {
        TransactionId: token.security!.authenticationTransactionId!
      }
    };

    window.Cardinal.continue("cca", ccaParameters, ccaOrderDetails);
  }

  private async _setupCardinal(jwt: string, cardBin: string) {
    if (await this._isCardinalInitialized()) {
      window.Cardinal.trigger("accountNumber.update", cardBin);
      window.Cardinal.trigger("jwt.update", jwt);
    } else {
      window.Cardinal.setup("init", {
        jwt,
        order: {
          Consumer: {
            Account: {
              AccountNumber: cardBin
            }
          }
        }
      });
    }
  }

  private async _isCardinalInitialized(): Promise<boolean> {
    try {
      const cardinalStatus = await window.Cardinal.complete({
        Status: "Success"
      });

      return !!cardinalStatus;
    } catch (error) {
      return false;
    }
  }
}
