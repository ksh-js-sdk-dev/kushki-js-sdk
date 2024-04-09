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
import { get, isNil } from "lodash";
import { ThreeDSEnum } from "infrastructure/ThreeDSEnum.ts";

export class AntiFraudService {
  private static MIN_CARD_NUMBER_LENGTH = 6;
  private static MAX_CARD_NUMBER_LENGTH = 19;
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

    this._check3DSSecureEnabled(merchantSettings);

    const jwtResponse = await getJwtIf3dsEnabled({
      accountNumber: cardBin,
      cardinal3DS: cardianl3DSProvider,
      gateway,
      kushkiInstance,
      merchantSettings,
      sandbox3DS: sandbox3DSProvider
    });

    return { jwt: jwtResponse! };
  }

  public static async requestValidate3DS(
    kushkiInstance: IKushki,
    cardTokenResponse: CardTokenResponse
  ): Promise<TokenResponse> {
    const cardinal3DSProvider: Cardinal3DSProvider = new Cardinal3DSProvider();
    const cardinalSandboxProvider: Sandbox3DSProvider =
      new Sandbox3DSProvider();

    if (isNil(cardTokenResponse.security)) throw new KushkiError(ERRORS.E012);

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
    if (
      request.card.number.length < this.MIN_CARD_NUMBER_LENGTH ||
      request.card.number.length > this.MAX_CARD_NUMBER_LENGTH
    )
      throw new KushkiError(ERRORS.E018, ERRORS.E018.message);
  }

  private static _check3DSSecureEnabled(
    merchantSettings: MerchantSettingsResponse
  ): void {
    if (!merchantSettings.active_3dsecure)
      throw new KushkiError(ERRORS.E019, ERRORS.E019.message);
  }

  private static _getBinFromCreditCardNumber(value: string): string {
    const cardValue: string = value.replace(/\D/g, "");

    return cardValue.slice(
      CREDIT_CARD_ESPECIFICATIONS.cardInitialBinPlace,
      CREDIT_CARD_ESPECIFICATIONS.cardFinalBinPlace
    );
  }
}
