import { IKushki } from "repository/IKushki.ts";
import { DeviceTokenRequest } from "types/device_token_request";
import { BrandByMerchantResponse } from "types/brand_by_merchant_response";
import { MerchantSettingsResponse } from "types/merchant_settings_response";
import { IKushkiGateway } from "repository/IKushkiGateway.ts";
import { KushkiGateway } from "gateway/KushkiGateway.ts";
import { SiftScienceObject } from "types/sift_science_object";
import { SiftScienceProvider } from "provider/SiftScienceProvider.ts";
import { ISiftScienceProvider } from "repository/ISiftScienceProvider.ts";
import { getJwtIf3dsEnabled, SECURE_3DS_FIELD } from "utils/3DSUtils.ts";
import { ICardinal3DSProvider } from "repository/ICardinal3DSProvider.ts";
import { ISandbox3DSProvider } from "repository/ISandbox3DSProvider.ts";
import { Cardinal3DSProvider } from "provider/Cardinal3DSProvider.ts";
import { Sandbox3DSProvider } from "provider/Sandbox3DSProvider.ts";
import { CardTokenResponse } from "types/card_token_response";
import { TokenResponse } from "types/token_response";
import { SubscriptionUserIdResponse } from "types/subscription_user_id_response";

export class CardService {
  private readonly _kushkiInstance: IKushki;
  private readonly _gateway: IKushkiGateway;
  private readonly _siftScience: ISiftScienceProvider;
  private readonly _cardinal3DSProvider: ICardinal3DSProvider;
  private readonly _sandbox3DSProvider: ISandbox3DSProvider;
  private _isSandboxEnabled: boolean;
  private _isActive3dsecure: boolean;

  constructor(kushkiInstance: IKushki) {
    this._kushkiInstance = kushkiInstance;
    this._gateway = new KushkiGateway();
    this._siftScience = new SiftScienceProvider();
    this._cardinal3DSProvider = new Cardinal3DSProvider();
    this._sandbox3DSProvider = new Sandbox3DSProvider();
    this._isSandboxEnabled = false;
    this._isActive3dsecure = false;
  }
  public static async requestDeviceToken(
    kushkiInstance: IKushki,
    body: DeviceTokenRequest
  ): Promise<TokenResponse> {
    const service: CardService = new CardService(kushkiInstance);

    const request: DeviceTokenRequest =
      await service.createDeviceTokenRequestBody(body);

    return service._requestDeviceToken(request);
  }

  public static requestBrandsByMerchant(
    kushkiInstance: IKushki
  ): Promise<BrandByMerchantResponse[]> {
    const gateway: IKushkiGateway = new KushkiGateway();

    return gateway.requestBrandLogos(kushkiInstance);
  }

  public async createDeviceTokenRequestBody(
    body: DeviceTokenRequest
  ): Promise<DeviceTokenRequest> {
    const merchantSettings: MerchantSettingsResponse =
      await this._getMerchantSettings();
    const siftScienceObject: SiftScienceObject =
      await this._getSiftScienceObject(body, merchantSettings);
    const jwt: string | undefined = await this._getJwtIf3dsEnabled(
      merchantSettings,
      body
    );

    return this._buildRequestObject(
      body,
      siftScienceObject,
      merchantSettings,
      jwt
    );
  }

  public async validateToken(token: CardTokenResponse): Promise<TokenResponse> {
    if (this._isNecessaryValidation(token))
      if (this._isSandboxEnabled) return this._validateSandboxToken(token);
      else return this._validateCardinalToken(token);
    else
      return {
        token: token.token
      };
  }

  private _isNecessaryValidation(token: CardTokenResponse): boolean {
    return <boolean>(
      (this._isActive3dsecure &&
        token.secureService &&
        token.secureService === SECURE_3DS_FIELD)
    );
  }

  private async _getMerchantSettings(): Promise<MerchantSettingsResponse> {
    const merchantSettings: MerchantSettingsResponse =
      await this._gateway.requestMerchantSettings(this._kushkiInstance);

    if (merchantSettings.sandboxEnable) this._isSandboxEnabled = true;
    if (merchantSettings.active_3dsecure) this._isActive3dsecure = true;

    return merchantSettings;
  }

  private async _getJwtIf3dsEnabled(
    merchantSettings: MerchantSettingsResponse,
    body: DeviceTokenRequest
  ): Promise<string | undefined> {
    return getJwtIf3dsEnabled({
      accountNumber: "",
      cardinal3DS: this._cardinal3DSProvider,
      gateway: this._gateway,
      kushkiInstance: this._kushkiInstance,
      merchantSettings,
      sandbox3DS: this._sandbox3DSProvider,
      subscriptionId: body.subscriptionId
    });
  }

  private async _getSiftScienceObject(
    body: DeviceTokenRequest,
    merchantSettings: MerchantSettingsResponse
  ): Promise<SiftScienceObject> {
    if (body.userId && body.sessionId)
      return { sessionId: body.sessionId, userId: body.userId };

    if (
      this._siftScience.isSiftScienceEnabled(
        this._kushkiInstance,
        merchantSettings
      )
    )
      return this._createSubscriptionSiftScienceObject(body, merchantSettings);

    return {};
  }

  private async _createSubscriptionSiftScienceObject(
    body: DeviceTokenRequest,
    merchantSettings: MerchantSettingsResponse
  ): Promise<SiftScienceObject> {
    const userId: SubscriptionUserIdResponse =
      await this._gateway.requestSubscriptionUserId(
        this._kushkiInstance,
        body.subscriptionId
      );

    return this._siftScience.createSiftScienceSession(
      body.subscriptionId,
      "",
      this._kushkiInstance,
      merchantSettings,
      userId.userId
    );
  }

  private _buildRequestObject(
    body: DeviceTokenRequest,
    siftScienceObject: SiftScienceObject,
    merchantSettings: MerchantSettingsResponse,
    jwt?: string
  ): DeviceTokenRequest {
    if (!merchantSettings.sandboxEnable && jwt)
      return {
        ...body,
        ...siftScienceObject,
        jwt
      };
    else
      return {
        subscriptionId: body.subscriptionId,
        ...siftScienceObject,
        jwt
      };
  }

  private _requestDeviceToken(
    body: DeviceTokenRequest
  ): Promise<TokenResponse> {
    if (body.jwt)
      if (this._isSandboxEnabled) return this._getSandboxToken(body);
      else return this._getCardinalToken(body);

    return this._gateway.requestDeviceToken(this._kushkiInstance, body);
  }

  private async _getCardinalToken(
    body: DeviceTokenRequest
  ): Promise<TokenResponse> {
    const token: CardTokenResponse = await this._gateway.requestDeviceToken(
      this._kushkiInstance,
      body
    );

    return this._validateCardinalToken(token);
  }

  private async _getSandboxToken(
    body: DeviceTokenRequest
  ): Promise<TokenResponse> {
    const token: CardTokenResponse = await this._gateway.requestDeviceToken(
      this._kushkiInstance,
      body
    );

    return this._validateSandboxToken(token);
  }

  private async _validateCardinalToken(
    token: CardTokenResponse
  ): Promise<TokenResponse> {
    return this._cardinal3DSProvider.validateCardinal3dsToken(
      this._kushkiInstance,
      token
    );
  }

  private async _validateSandboxToken(
    token: CardTokenResponse
  ): Promise<TokenResponse> {
    return this._sandbox3DSProvider.validateSandbox3dsToken(
      this._kushkiInstance,
      token
    );
  }
}
