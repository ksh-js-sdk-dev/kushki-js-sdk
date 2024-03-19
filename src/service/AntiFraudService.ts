import { IKushki } from "repository/IKushki.ts";
import { SecureInitRequest } from "types/secure_init_request";
import { KushkiError } from "infrastructure/KushkiError.ts";
import { ERRORS } from "infrastructure/ErrorEnum.ts";
import { KushkiGateway } from "gateway/KushkiGateway.ts";
import { SecureInitResponse } from "types/secure_init_response";
import { MerchantSettingsResponse } from "types/merchant_settings_response";
import { CREDIT_CARD_ESPECIFICATIONS } from "src/constant/CreditCardEspecifications.ts";
import { CybersourceJwtResponse } from "types/cybersource_jwt_response";
import { ErrorResponse } from "types/error_response";
import { Cardinal3DSProvider } from "provider/Cardinal3DSProvider.ts";
import { CardTokenResponse } from "types/card_token_response";
import { TokenResponse } from "types/token_response";

export class AntiFraudService {
  private static readonly _active3dsecure: string = "active_3dsecure";
  private static readonly _paymentSetupCompleteEvent: string =
    "payments.setupComplete";

  public static async requestSecureInit(
    kushkiInstance: IKushki,
    request: SecureInitRequest
  ): Promise<SecureInitResponse | ErrorResponse> {
    const gateway: KushkiGateway = new KushkiGateway();

    this._checkSecureInitCardLength(request);

    const merchantSettings: MerchantSettingsResponse =
      await gateway.requestMerchantSettings(kushkiInstance);

    if (!this._is3DSSecureEnabled(merchantSettings))
      throw new KushkiError(ERRORS.E017, ERRORS.E017.message);

    const jwtResponse = await this._getCybersourceJwt(
      merchantSettings,
      kushkiInstance,
      gateway,
      request.card.number
    );

    const jwt: SecureInitResponse = { jwt: jwtResponse! };

    if (this._isSandboxEnabled(merchantSettings)) return jwt;

    this._request3DSToken(() => {
      return jwt;
    });

    return jwt;
  }

  public static async validate3DS(
    kushkiInstance: IKushki,
    cardTokenResponse: CardTokenResponse
  ): Promise<TokenResponse> {
    const cardinal3DSProvider: Cardinal3DSProvider = new Cardinal3DSProvider();

    return cardinal3DSProvider.validateCardinal3dsToken(
      kushkiInstance,
      cardTokenResponse
    );
  }

  private static _checkSecureInitCardLength(request: SecureInitRequest): void {
    if (request.card.number.length < 6 || request.card.number.length > 19)
      throw new KushkiError(ERRORS.E016, ERRORS.E016.message);
  }

  private static _is3DSSecureEnabled(
    merchantSettings: MerchantSettingsResponse
  ) {
    return merchantSettings[this._active3dsecure] === true;
  }

  private static async _getCybersourceJwt(
    merchantSettings: MerchantSettingsResponse,
    kushkiInstance: IKushki,
    kushkiGateway: KushkiGateway,
    cardNumber: string | undefined
  ): Promise<string | undefined> {
    if (
      this._is3DSSecureEnabled(merchantSettings) &&
      cardNumber !== undefined
    ) {
      if (this._isSandboxEnabled(merchantSettings))
        this._initCybersourceSandbox(kushkiInstance, kushkiGateway);
    }

    return await this._initCybersource(
      cardNumber!,
      kushkiInstance,
      kushkiGateway
    );
  }

  private static _isSandboxEnabled(merchantSettings: MerchantSettingsResponse) {
    return !!merchantSettings.sandboxEnable;
  }

  private static _request3DSToken(callback: () => void) {
    window.Cardinal.on(AntiFraudService._paymentSetupCompleteEvent, () => {
      callback();
    });
  }

  private static async _initCybersourceSandbox(
    kushkiInstance: IKushki,
    kushkiGateway: KushkiGateway
  ): Promise<string> {
    const cybersourceResponse: CybersourceJwtResponse =
      await kushkiGateway.requestCybersourceJwt(kushkiInstance);

    return cybersourceResponse.jwt;
  }

  private static async _initCybersource(
    cardNumber: string,
    kushkiInstance: IKushki,
    kushkiGateway: KushkiGateway
  ): Promise<string> {
    this._loadCardinalScript(kushkiInstance.isInTest());

    const cybersourceResponse: CybersourceJwtResponse =
      await kushkiGateway.requestCybersourceJwt(kushkiInstance);

    this._initializeCardinal(cybersourceResponse.jwt, cardNumber);

    return cybersourceResponse.jwt;
  }

  private static _loadCardinalScript(isTest: boolean) {
    const lastScript = document.getElementById("cardinal_sc_id");

    if (lastScript) lastScript.remove();

    const head = document.getElementsByTagName("head")[0];
    const script = document.createElement("script");

    script.id = "cardinal_sc_id";
    script.src = isTest
      ? "https://songbirdstag.cardinalcommerce.com/cardinalcruise/v1/songbird.js"
      : "https://songbird.cardinalcommerce.com/cardinalcruise/v1/songbird.js";

    head.appendChild(script);
  }

  private static _initializeCardinal(jwt: string, cardNumber: string) {
    window.Cardinal.setup("init", {
      jwt,
      order: {
        Consumer: {
          Account: {
            AccountNumber: this._getBinFromCreditCardNumber(cardNumber)
          }
        }
      }
    });
  }

  private static _getBinFromCreditCardNumber(value: string): string {
    const cardValue: string = value.replace(/\D/g, "");

    return cardValue.slice(
      CREDIT_CARD_ESPECIFICATIONS.cardInitialBinPlace,
      CREDIT_CARD_ESPECIFICATIONS.cardFinalBinPlace
    );
  }
}
