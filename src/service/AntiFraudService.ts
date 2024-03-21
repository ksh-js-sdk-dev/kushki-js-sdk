import { IKushki } from "repository/IKushki.ts";
import { SecureInitRequest } from "types/secure_init_request";
import { KushkiError } from "infrastructure/KushkiError.ts";
import { ERRORS } from "infrastructure/ErrorEnum.ts";
import { KushkiGateway } from "gateway/KushkiGateway.ts";
import { SecureInitResponse } from "types/secure_init_response";
import { MerchantSettingsResponse } from "types/merchant_settings_response";
import { CREDIT_CARD_ESPECIFICATIONS } from "src/constant/CreditCardEspecifications.ts";
import { Cardinal3DSProvider } from "provider/Cardinal3DSProvider.ts";
import { CardTokenResponse } from "types/card_token_response";
import { TokenResponse } from "types/token_response";
import { getJwtIf3dsEnabled } from "utils/3DSUtils.ts";
import { Sandbox3DSProvider } from "provider/Sandbox3DSProvider.ts";
import { get } from "lodash";
import { ThreeDSEnum } from "infrastructure/ThreeDSEnum.ts";

export class AntiFraudService {
  public static async requestSecureInit(
    kushkiInstance: IKushki,
    secureInitRequest: SecureInitRequest
  ): Promise<SecureInitResponse> {
    const gateway: KushkiGateway = new KushkiGateway();
    const sandbox3DSProvider: Sandbox3DSProvider = new Sandbox3DSProvider();
    const cardianl3DSProvider: Cardinal3DSProvider = new Cardinal3DSProvider();

    this._checkSecureInitCardLength(secureInitRequest);

    const cardBin: string = this._getBinFromCreditCardNumber(
      secureInitRequest.card.number
    );

    const merchantSettings: MerchantSettingsResponse =
      await gateway.requestMerchantSettings(kushkiInstance);

    const jwtResponse = await getJwtIf3dsEnabled(
      merchantSettings,
      kushkiInstance,
      gateway,
      sandbox3DSProvider,
      cardianl3DSProvider,
      cardBin
    );

    const jwt: SecureInitResponse = { jwt: jwtResponse! };

    if (this._isSandboxEnabled(merchantSettings)) return jwt;

    await cardianl3DSProvider.onSetUpComplete(() => {
      return jwt;
    });

    return jwt;
  }

  public static async requestValidate3DS(
    kushkiInstance: IKushki,
    cardTokenResponse: CardTokenResponse
  ): Promise<TokenResponse> {
    const cardinal3DSProvider: Cardinal3DSProvider = new Cardinal3DSProvider();
    const cardinalSandboxProvider: Sandbox3DSProvider =
      new Sandbox3DSProvider();

    if (cardTokenResponse.security === undefined)
      throw new KushkiError(ERRORS.E012);

    if (
      get(cardTokenResponse, "security.paReq", ThreeDSEnum.SANDBOX) ===
      ThreeDSEnum.SANDBOX
    )
      return cardinalSandboxProvider.validateSandbox3dsToken(
        kushkiInstance,
        cardTokenResponse
      );

    return cardinal3DSProvider.validateCardinal3dsToken(
      kushkiInstance,
      cardTokenResponse
    );
  }

  private static _checkSecureInitCardLength(request: SecureInitRequest): void {
    if (request.card.number.length < 6 || request.card.number.length > 19)
      throw new KushkiError(ERRORS.E016, ERRORS.E016.message);
  }

  private static _isSandboxEnabled(merchantSettings: MerchantSettingsResponse) {
    return !!merchantSettings.sandboxEnable;
  }
  private static _getBinFromCreditCardNumber(value: string): string {
    const cardValue: string = value.replace(/\D/g, "");

    return cardValue.slice(
      CREDIT_CARD_ESPECIFICATIONS.cardInitialBinPlace,
      CREDIT_CARD_ESPECIFICATIONS.cardFinalBinPlace
    );
  }
}
