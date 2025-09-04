import { ERRORS } from "infrastructure/ErrorEnum.ts";
import { KushkiError } from "infrastructure/KushkiError.ts";
import { UtilsProvider } from "provider/UtilsProvider.ts";
import { ICardApplePay } from "repository/ICardApplePay.ts";
import { IKushki } from "repository/IKushki.ts";
import { ApplePayOptions } from "types/apple_pay_options";

declare global {
  // tslint:disable-next-line
  interface Window {
    // tslint:disable-next-line:no-any
    ApplePaySession: any;
  }
}

export class CardApplePay implements ICardApplePay {
  private readonly _appleSdkId: string = "apple-pay-sdk";
  private readonly _appleSdkCdn: string =
    "https://applepay.cdn-apple.com/jsapi/1.latest/apple-pay-sdk.js";
  private readonly _appleButtonContainer: string = "kushki-apple-pay-button";
  private readonly _appleButtonElement: string = "apple-pay-button";
  // @ts-ignore
  private readonly kushkiInstance: IKushki;
  private readonly buttonOptions: ApplePayOptions;
  private onClickAppleButtonCallback: () => void;

  private constructor(kushkiInstance: IKushki, options: ApplePayOptions) {
    this.kushkiInstance = kushkiInstance;
    this.buttonOptions = options;
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

    button.setAttribute("buttonstyle", this.buttonOptions.style);
    button.setAttribute("type", this.buttonOptions.type);
    button.setAttribute("locale", this.buttonOptions.locale);
    button.addEventListener("click", () => {
      this.onClickAppleButtonCallback();
    });

    container.textContent = "";
    container.appendChild(button);
  }
}
