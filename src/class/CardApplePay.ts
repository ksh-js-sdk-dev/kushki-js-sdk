import { KushkiGateway } from "gateway/KushkiGateway.ts";
import { CardBrandsEnum } from "infrastructure/CardBrandsEnum.ts";
import { ERRORS } from "infrastructure/ErrorEnum.ts";
import { KushkiError } from "infrastructure/KushkiError.ts";
import { UtilsProvider } from "provider/UtilsProvider.ts";
import { IAppleSession, ICardApplePay } from "repository/ICardApplePay.ts";
import { IKushki } from "repository/IKushki.ts";
import { IKushkiGateway } from "repository/IKushkiGateway.ts";
import { ApplePayGetTokenOptions } from "types/apple_pay_get_token_options";
import { ApplePaymentEvent } from "types/apple_pay_get_token_request";
import { ApplePayOptions } from "types/apple_pay_options";
import { CardTokenResponse } from "types/card_token_response";

declare global {
  interface Window {
    ApplePaySession: any;
  }
}

export class CardApplePay implements ICardApplePay {
  private readonly _emptyContent: string = "";
  private readonly _appleSdkId: string = "apple-pay-sdk";
  private readonly _appleSdkCdn: string =
    "https://applepay.cdn-apple.com/jsapi/1.latest/apple-pay-sdk.js";
  private readonly _appleButtonContainer: string = "kushki-apple-pay-button";
  private readonly _appleButtonElement: string = "apple-pay-button";
  private readonly _requiredMerchantCapabilities: string = "supports3DS";
  private readonly _maxCompatibleVersion: number = 16;
  private readonly _minCompatibleVersion: number = 1;
  private readonly _kushkiInstance: IKushki;
  private readonly _gateway: IKushkiGateway;
  private readonly _buttonOptions: ApplePayOptions;
  private onClickAppleButtonCallback: () => void;

  private constructor(kushkiInstance: IKushki, options: ApplePayOptions) {
    this._kushkiInstance = kushkiInstance;
    this._buttonOptions = options;
    this._gateway = new KushkiGateway();
    this.onClickAppleButtonCallback = () => {};
  }

  public static async initApplePayButton(
    kushkiInstance: IKushki,
    options: ApplePayOptions
  ): Promise<ICardApplePay> {
    const payment = new CardApplePay(kushkiInstance, options);

    await payment.loadApplePayScript();
    payment.buildAppleButton();

    return payment;
  }

  public onClick(callback: () => void): void {
    this.onClickAppleButtonCallback = callback;
  }

  public requestApplePayToken(
    options: ApplePayGetTokenOptions
  ): Promise<CardTokenResponse> {
    if (this.isNotPaymentAvailable()) {
      throw new KushkiError(ERRORS.E025);
    }

    const sessionParams = {
      countryCode: options.countryCode,
      currencyCode: options.currencyCode,
      merchantCapabilities: [this._requiredMerchantCapabilities],
      supportedNetworks: [CardBrandsEnum.VISA, CardBrandsEnum.MASTER_CARD],
      total: {
        amount: options.amount.toString(),
        label: options.displayName
      },
      ...options.optionalApplePayFields
    };

    const session = new window.ApplePaySession(
      this.getSupportedApplePayVersion(),
      sessionParams
    );

    return new Promise<CardTokenResponse>((resolve, reject) => {
      session.onvalidatemerchant = (event: ApplePaymentEvent) =>
        this.onValidateMerchant(event, session, options, reject);

      session.onpaymentauthorized = async (event: ApplePaymentEvent) =>
        this.onPaymentAuthorized(event, session, resolve, reject);

      session.begin();
    });
  }

  private async loadApplePayScript(): Promise<void> {
    try {
      await UtilsProvider.loadScript(this._appleSdkId, this._appleSdkCdn, true);
    } catch (_err) {
      throw new KushkiError(ERRORS.E024);
    }
  }

  private isNotPaymentAvailable(): boolean {
    return !window.ApplePaySession || !window.ApplePaySession.canMakePayments();
  }

  private getSupportedApplePayVersion(): number {
    for (
      let v = this._maxCompatibleVersion;
      v >= this._minCompatibleVersion;
      v--
    )
      if (window.ApplePaySession.supportsVersion(v)) return v;

    return 0;
  }

  private buildAppleButton(): void {
    if (this.isNotPaymentAvailable()) {
      throw new KushkiError(ERRORS.E025);
    }

    const container: HTMLElement | null = document.getElementById(
      this._appleButtonContainer
    );

    if (!container) {
      throw new KushkiError(ERRORS.E024);
    }

    const button: HTMLElement = document.createElement(
      this._appleButtonElement
    );

    button.setAttribute("buttonstyle", this._buttonOptions.style);
    button.setAttribute("type", this._buttonOptions.type);
    button.setAttribute("locale", this._buttonOptions.locale);
    button.addEventListener("click", () => {
      this.onClickAppleButtonCallback();
    });

    container.textContent = this._emptyContent;
    container.appendChild(button);
  }

  private async onValidateMerchant(
    event: ApplePaymentEvent,
    session: IAppleSession,
    options: ApplePayGetTokenOptions,
    reject: (reason: any) => void
  ): Promise<void> {
    try {
      const merchantSession = await this._gateway.startApplePaySession(
        this._kushkiInstance,
        {
          clientDomain: CardApplePay.getClientDomain(),
          displayName: options.displayName,
          validationURL: event.validationURL
        }
      );

      session.completeMerchantValidation(merchantSession);
    } catch (err) {
      session.abort();
      reject(err);
    }
  }

  private async onPaymentAuthorized(
    event: ApplePaymentEvent,
    session: IAppleSession,
    resolve: (token: CardTokenResponse) => void,
    reject: (reason: any) => void
  ): Promise<void> {
    try {
      const appleToken = event.payment.token.paymentData;
      const kushkiToken = await this._gateway.getApplePayToken(
        this._kushkiInstance,
        appleToken
      );

      session.completePayment(window.ApplePaySession.STATUS_SUCCESS);

      resolve(kushkiToken);
    } catch (err) {
      session.abort();
      reject(err);
    }
  }

  public static getClientDomain(): string {
    let domain = window.location.href;
    const isInIframe = window.self !== window.top;
    const parentRef = window.location.ancestorOrigins;
    const haveParent = parentRef && parentRef.length;

    if (isInIframe)
      if (haveParent) domain = parentRef[parentRef.length - 1];
      else domain = document.referrer;

    return new URL(domain).hostname;
  }
}
