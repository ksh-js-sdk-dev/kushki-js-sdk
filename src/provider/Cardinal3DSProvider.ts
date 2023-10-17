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
import { ICardinal3DSProvider } from "repository/ICardinal3DSProvider.ts";
import { injectable } from "inversify";
import {
  CardinalValidationCodeEnum,
  ICardinalValidation
} from "infrastructure/CardinalValidationEnum.ts";

declare global {
  // tslint:disable-next-line
  interface Window {
    // tslint:disable-next-line:no-any
    Cardinal: any;
  }
}

@injectable()
export class Cardinal3DSProvider implements ICardinal3DSProvider {
  private readonly _gateway: IKushkiGateway;
  constructor() {
    this._gateway = CONTAINER.get<KushkiGateway>(IDENTIFIERS.KushkiGateway);
  }

  public async initCardinal(
    kushkiInstance: IKushki,
    jwt: string,
    cardBin: string
  ) {
    if (kushkiInstance.isInTest()) await import("libs/cardinal/Staging.ts");
    else await import("libs/cardinal/Prod.ts");

    await this._setupCardinal(jwt, cardBin);
  }

  public async onSetUpComplete(callback: () => void): Promise<void> {
    if (await this._isCardinalInitialized()) {
      callback();
    } else
      window.Cardinal.on("payments.setupComplete", () => {
        callback();
      });
  }

  public async validateCardinal3dsToken(
    kushkiInstance: IKushki,
    cardTokenResponse: CardTokenResponse,
    deferredValues: DeferredValues
  ): Promise<TokenResponse> {
    if (tokenNotNeedsAuth(cardTokenResponse)) {
      return Promise.resolve({
        deferred: deferredValues,
        secureId: cardTokenResponse.secureId,
        secureService: cardTokenResponse.secureService,
        token: cardTokenResponse.token
      });
    }
    if (tokenHasAllSecurityProperties(cardTokenResponse, false)) {
      await this._launch3DSCardinalValidation(
        kushkiInstance,
        cardTokenResponse
      );

      return Promise.resolve({
        deferred: deferredValues,
        token: cardTokenResponse.token
      });
    }

    return Promise.reject(new KushkiError(ERRORS.E005));
  }

  private async _launch3DSCardinalValidation(
    kushkiInstance: IKushki,
    token: CardTokenResponse
  ): Promise<CardTokenResponse> {
    this._launchCardinalModal(token);

    if (
      await this._onCardinalPaymentValidation(kushkiInstance, token.secureId!)
    )
      return Promise.resolve(token);
    else return Promise.reject(new KushkiError(ERRORS.E006));
  }

  private async _onCardinalPaymentValidation(
    kushkiInstance: IKushki,
    secureServiceId: string
  ): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      window.Cardinal.on(
        "payments.validated",
        async (data: ICardinalValidation) => {
          if (data.ActionCode !== CardinalValidationCodeEnum.SUCCESS)
            return reject(new KushkiError(ERRORS.E005));

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
          } finally {
            window.Cardinal.off("payments.setupComplete");
            window.Cardinal.off("payments.validated");
          }
        }
      );
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
