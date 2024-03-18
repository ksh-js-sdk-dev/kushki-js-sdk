import { IKushki } from "repository/IKushki.ts";
import { DeviceTokenRequest } from "types/device_token_request";
import { MerchantSettingsResponse } from "types/merchant_settings_response";
import { IKushkiGateway } from "repository/IKushkiGateway.ts";
import { KushkiGateway } from "gateway/KushkiGateway.ts";
import { SiftScienceObject } from "types/sift_science_object";
import { SiftScienceProvider } from "provider/SiftScienceProvider.ts";
import { ISiftScienceProvider } from "repository/ISiftScienceProvider.ts";
import { getJwtIf3dsEnabled } from "utils/3DSUtils.ts";
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

  private constructor(kushkiInstance: IKushki) {
    this._kushkiInstance = kushkiInstance;
    this._gateway = new KushkiGateway();
    this._siftScience = new SiftScienceProvider();
    this._cardinal3DSProvider = new Cardinal3DSProvider();
    this._sandbox3DSProvider = new Sandbox3DSProvider();
  }
  public static async requestDeviceToken(
    kushkiInstance: IKushki,
    body: DeviceTokenRequest
  ): Promise<TokenResponse> {
    const service: CardService = new CardService(kushkiInstance);

    const merchantSettings: MerchantSettingsResponse =
      await service._getMerchantSettings();
    const siftScienceObject: SiftScienceObject =
      await service._getSiftScienceObject(body, merchantSettings);
    const jwt: string | undefined = await service._getJwtIf3dsEnabled(
      merchantSettings,
      body
    );
    const request: DeviceTokenRequest = service._buildRequestObject(
      body,
      siftScienceObject,
      merchantSettings,
      jwt
    );

    return service._requestDeviceToken(merchantSettings, request);
  }

  private _getMerchantSettings(): Promise<MerchantSettingsResponse> {
    return this._gateway.requestMerchantSettings(this._kushkiInstance);
  }

  private _getJwtIf3dsEnabled(
    merchantSettings: MerchantSettingsResponse,
    body: DeviceTokenRequest
  ): Promise<string | undefined> {
    return getJwtIf3dsEnabled(
      merchantSettings,
      this._kushkiInstance,
      this._gateway,
      this._sandbox3DSProvider,
      this._cardinal3DSProvider,
      "",
      body.subscriptionId
    );
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
    merchantSettings: MerchantSettingsResponse,
    body: DeviceTokenRequest
  ): Promise<TokenResponse> {
    if (body.jwt)
      if (merchantSettings.sandboxEnable) return this._getSandboxToken(body);
      else return this._getCardinalToken(body);

    return this._gateway.requestDeviceToken(this._kushkiInstance, body);
  }

  private async _getCardinalToken(
    body: DeviceTokenRequest
  ): Promise<TokenResponse> {
    return new Promise<CardTokenResponse>((resolve, reject) => {
      this._cardinal3DSProvider.onSetUpComplete(async () => {
        try {
          const token: TokenResponse =
            await this._cardinal3DSProvider.validateCardinal3dsToken(
              this._kushkiInstance,
              await this._gateway.requestDeviceToken(this._kushkiInstance, body)
            );

          resolve(token);
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  private async _getSandboxToken(
    body: DeviceTokenRequest
  ): Promise<TokenResponse> {
    const token: CardTokenResponse = await this._gateway.requestDeviceToken(
      this._kushkiInstance,
      body
    );

    return this._sandbox3DSProvider.validateSandbox3dsToken(
      this._kushkiInstance,
      token
    );
  }
}
