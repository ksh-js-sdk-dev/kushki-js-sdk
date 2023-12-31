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
    return new Promise<void>((resolve) => {
      this._loadCardinalScript(kushkiInstance.isInTest(), async () => {
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
        resolve();
      });
    });
  }

  public async onSetUpComplete(callback: () => void): Promise<void> {
    await window.Cardinal.on("payments.setupComplete", () => {
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

  private _loadCardinalScript(isTest: boolean, onLoad: () => void) {
    const last_script = document.getElementById("cardinal_sc_id");

    if (last_script) last_script.remove();

    const head = document.getElementsByTagName("head")[0];
    const script = document.createElement("script");

    script.id = "cardinal_sc_id";
    script.src = isTest
      ? "https://songbirdstag.cardinalcommerce.com/cardinalcruise/v1/songbird.js"
      : "https://songbird.cardinalcommerce.com/cardinalcruise/v1/songbird.js";

    head.appendChild(script);

    script.onload = onLoad;
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
          if (data.ActionCode !== CardinalValidationCodeEnum.SUCCESS) {
            this._offCardinalEvents();

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
          } finally {
            this._offCardinalEvents();
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

  private _offCardinalEvents() {
    window.Cardinal.off("payments.setupComplete");
    window.Cardinal.off("payments.validated");
  }
}
