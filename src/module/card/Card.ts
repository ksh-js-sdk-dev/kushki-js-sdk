import KushkiHostedFields from "libs/HostedField.ts";
import { Kushki } from "Kushki";
import {
  CardFieldValues,
  CardOptions,
  CardTokenRequest,
  Field,
  Fields,
  TokenResponse
} from "Kushki/card";
import { ICard } from "repository/ICard.ts";
import { InputModelEnum } from "infrastructure/InputModel.enum.ts";
import { FieldInstance } from "types/card_fields_values";
import "reflect-metadata";
import { IKushkiGateway } from "repository/IKushkiGateway";
import { IDENTIFIERS } from "src/constant/Identifiers";
import { CONTAINER } from "infrastructure/Container";
import { KushkiGateway } from "gateway/KushkiGateway";
import { MerchantSettingsResponse } from "types/merchant_settings_response";
import { CybersourceJwtResponse } from "types/cybersource_jwt_response";
import { ERRORS } from "infrastructure/ErrorEnum.ts";
import { SecureOtpResponse } from "types/secure_otp_response";

declare global {
  // tslint:disable-next-line
  interface Window {
    // tslint:disable-next-line:no-any
    Cardinal: any;
  }
}
import { FieldOptions } from "infrastructure/interfaces/FieldOptions.ts";
import { FieldValidity, FormValidity } from "types/form_validity";
import { ErrorTypeEnum } from "infrastructure/ErrorTypeEnum.ts";

export class Card implements ICard {
  private readonly options: CardOptions;
  private readonly kushkiInstance: Kushki;
  private inputValues: CardFieldValues;
  private currentBin: string;
  private readonly _gateway: IKushkiGateway;
  private readonly listenerFieldValidity: string = "fieldValidity";

  private constructor(kushkiInstance: Kushki, options: CardOptions) {
    this.options = this.setDefaultValues(options);
    this.kushkiInstance = kushkiInstance;
    this.inputValues = {};
    this.currentBin = "";
    this._gateway = CONTAINER.get<KushkiGateway>(IDENTIFIERS.KushkiGateway);
  }

  public static initCardToken(
    kushkiInstance: Kushki,
    options: CardOptions
  ): Promise<Card> {
    return new Promise<Card>((resolve, reject) => {
      try {
        const card: Card = new Card(kushkiInstance, options);

        card
          .initFields(options.fields)
          .then(() => {
            card.showContainers();
            resolve(card);
          })
          .catch(
            /* istanbul ignore next */
            (expect) => reject(expect)
          );
      } catch (error) {
        reject(error);
      }
    });
  }

  public async requestToken(): Promise<TokenResponse> {
    try {
      const merchantSettings: MerchantSettingsResponse =
        await this._gateway.requestMerchantSettings(this.kushkiInstance);

      const jwt: string | undefined = await this.getJwtIf3dsEnabled(
        merchantSettings
      );

      if (jwt) {
        const token = await this.request3DSToken(jwt);

        return Promise.resolve(token);
      } else return this.requestTokenGateway();
    } catch (error) {
      return Promise.reject(error);
    } finally {
      window.Cardinal.off("payments.setupComplete");
      window.Cardinal.off("payments.validated");
    }
  }

  private async request3DSToken(jwt: string) {
    const token: TokenResponse = await this.getCardinal3dsToken(jwt);

    return this.validate3dsToken(token);
  }

  private validate3dsToken(token: TokenResponse) {
    if (this.tokenNotNeedsAuth(token)) {
      return Promise.resolve(token);
    }
    if (this.hasAllSecurityProperties(token)) return this.validate3DS(token);

    return Promise.reject(ERRORS.E005);
  }

  private hasAllSecurityProperties(token: TokenResponse): boolean {
    return !!(
      token.security &&
      token.security.authRequired &&
      token.security.acsURL &&
      token.security.paReq &&
      token.security.authenticationTransactionId
    );
  }

  private tokenNotNeedsAuth(token: TokenResponse): boolean {
    return (
      !!(
        token.security &&
        (!token.security.authRequired ||
          +token.security.specificationVersion < 2)
      ) || !token.security
    );
  }

  private async validate3DS(token: TokenResponse) {
    this.launchCardinal(token);

    if (await this.completeCardinal(token.secureId!))
      return Promise.resolve(token);
    else return Promise.reject(ERRORS.E006);
  }

  private async completeCardinal(secureServiceId: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      return window.Cardinal.on("payments.validated", async () => {
        try {
          const secureValidation: SecureOtpResponse =
            await this._gateway.requestSecureServiceValidation(
              this.kushkiInstance,
              {
                secureServiceId,
                otpValue: ""
              }
            );

          resolve(this.is3dsValid(secureValidation));
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  private is3dsValid(secureOtpResponse: SecureOtpResponse): boolean {
    return (
      "message" in secureOtpResponse &&
      ((secureOtpResponse.message === "3DS000" &&
        secureOtpResponse.code === "ok") ||
        (secureOtpResponse.code === "3DS000" &&
          secureOtpResponse.message === "ok"))
    );
  }

  private launchCardinal(token: TokenResponse) {
    window.Cardinal.continue(
      "cca",
      {
        AcsUrl: token.security!.acsURL!,
        Payload: token.security!.paReq!
      },
      {
        OrderDetails: {
          TransactionId: token.security!.authenticationTransactionId!
        }
      }
    );
  }

  private async getCardinal3dsToken(jwt: string): Promise<TokenResponse> {
    return new Promise<TokenResponse>(async (resolve, reject) => {
      const requestToken = async () => {
        try {
          resolve(await this.requestTokenGateway(jwt));
        } catch (error) {
          reject(error);
        }
      };

      if (await this.isCardinalInitialized()) {
        await requestToken();
      } else
        window.Cardinal.on("payments.setupComplete", async () => {
          await requestToken();
        });
    });
  }

  private async isCardinalInitialized(): Promise<boolean> {
    try {
      const cardinalStatus = await window.Cardinal.complete({
        Status: "Success"
      });

      return !!cardinalStatus;

    } catch (error) {
      return false;
    }
  }

  private async getJwtIf3dsEnabled(
    merchantSettings: MerchantSettingsResponse
  ): Promise<string | undefined> {
    if (merchantSettings.active_3dsecure) {
      const jwtResponse: CybersourceJwtResponse =
        await this._gateway.requestCybersourceJwt(this.kushkiInstance);
      await this.initCardinal(jwtResponse.jwt);

      return jwtResponse.jwt;
    } else {
      return undefined;
    }
  }

  private async initCardinal(jwt: string) {
    if (this.kushkiInstance.isInTest()) await import("libs/cardinal/staging");
    else await import("libs/cardinal/prod");

    await this.setupCardinal(jwt);
  }

  private async setupCardinal(jwt: string) {
    const accountNumber = this.inputValues[
      InputModelEnum.CARD_NUMBER
    ]?.value!.replace(/\s+/g, "");

    if (await this.isCardinalInitialized()) {
      window.Cardinal.trigger("accountNumber.update", accountNumber);
      window.Cardinal.trigger("jwt.update", jwt);
    } else {
      window.Cardinal.setup("init", {
        jwt,
        order: {
          Consumer: {
            Account: {
              AccountNumber: accountNumber
            }
          }
        }
      });
    }
  }

  private requestTokenGateway(jwt?: string) {
    if (this.options.isSubscription)
      return this._gateway.requestCreateSubscriptionToken(
        this.kushkiInstance,
        this.buildTokenBody(jwt)
      );

    return this._gateway.requestToken(
      this.kushkiInstance,
      this.buildTokenBody(jwt)
    );
  }

  public onFieldValidity(event: (fieldEvent: FormValidity) => void): void {
    window.addEventListener(this.listenerFieldValidity, ((
      e: CustomEvent<FormValidity>
    ) => {
      const fieldEvent: FormValidity = e.detail!;

      event(fieldEvent);
    }) as EventListener);
  }

  private buildTokenBody(jwt?: string): CardTokenRequest {
    const { cardholderName, cardNumber, expirationDate, cvv } =
      this.inputValues;
    const { currency } = this.options;

    return {
      jwt,
      card: {
        cvv: cvv!.value!,
        expiryMonth: expirationDate!.value!.split("/")[0]!,
        expiryYear: expirationDate!.value!.split("/")[1]!,
        name: cardholderName!.value!,
        number: cardNumber!.value!.replace(/\s+/g, "")
      },
      currency,
      ...this.buildTotalAmount()
    };
  }

  private buildTotalAmount() {
    const { amount } = this.options;

    if (this.options.isSubscription && !amount) return {};

    return (
      amount && {
        totalAmount: amount.iva + amount.subtotalIva + amount.subtotalIva0
      }
    );
  }

  private setDefaultValues(options: CardOptions): CardOptions {
    return {
      ...options,
      isSubscription: Boolean(options.isSubscription)
    };
  }

  private handleOnChange(field: string, value: string) {
    /* istanbul ignore next*/
    this.inputValues = {
      ...this.inputValues,
      [field]: { ...this.inputValues[field], value: value }
    };

    if (field === InputModelEnum.CARD_NUMBER) {
      this.onChangeCardNumber(value);
    }
  }

  private handleOnFocus(field: string, value: string) {
    field;
    value;
  }

  private handleOnBlur(field: string, value: string) {
    field;
    value;
  }

  private handleOnValidity(
    field: InputModelEnum,
    fieldValidity: FieldValidity
  ): void {
    this.inputValues = {
      ...this.inputValues,
      [field]: {
        ...this.inputValues[field],
        validity: {
          errorType: fieldValidity.errorType,
          isValid: fieldValidity.isValid
        }
      }
    };

    const event: CustomEvent<FormValidity> = new CustomEvent<FormValidity>(
      this.listenerFieldValidity,
      {
        detail: this.buildFieldsValidity(this.inputValues)
      }
    );

    dispatchEvent(event);
  }

  private async handleSetCardNumber(cardNumber: string) {
    const newBin: string = cardNumber.substring(0, 8);

    if (this.currentBin !== newBin) {
      this.currentBin = newBin;

      try {
        const { brand } = await this._gateway.requestBinInfo(
          this.kushkiInstance,
          {
            bin: newBin
          }
        );

        this.inputValues.cardNumber?.hostedField?.updateProps({
          brandIcon: brand
        });
      } catch (error) {
        this.inputValues.cardNumber?.hostedField?.updateProps({
          brandIcon: ""
        });
      }
    }
  }

  private onChangeCardNumber(value: string) {
    const cardNumber: string = value.replace(/ /g, "");

    if (cardNumber.length >= 8) this.handleSetCardNumber(cardNumber);
  }

  private initFields(optionsFields: { [k: string]: Field }): Promise<void[]> {
    for (const fieldKey in optionsFields) {
      const field: Field = optionsFields[fieldKey];
      const options: FieldOptions = {
        ...field,
        handleOnBlur: (field: string, value: string) =>
          this.handleOnBlur(field, value),
        handleOnChange: (field: string, value: string) => {
          return this.handleOnChange(field, value);
        },
        handleOnFocus: (field: string, value: string) =>
          this.handleOnFocus(field, value),
        handleOnValidity: (
          field: InputModelEnum,
          fieldValidity: FieldValidity
        ) => this.handleOnValidity(field, fieldValidity)
      };

      const hostedField = KushkiHostedFields(options);

      this.inputValues[field.fieldType] = {
        hostedField,
        selector: field.selector,
        validity: {
          isValid: false
        }
      };
    }

    this.hideContainers();

    return this.renderFields();
  }

  private hideContainers() {
    this.getContainers().forEach((htmlElement) => {
      if (!htmlElement) throw new Error("element don't exist");

      htmlElement!.style.cssText += "display:none";
    });
  }

  private showContainers() {
    this.getContainers().forEach((htmlElement) => {
      /* istanbul ignore next */
      if (!htmlElement) throw new Error("element don't exist");

      htmlElement!.removeAttribute("style");
    });
  }

  private getContainers() {
    return Object.values<FieldInstance>(this.inputValues).map((fieldInstance) =>
      document.getElementById(`${fieldInstance.selector}`)
    );
  }

  private renderFields = async (): Promise<void[]> => {
    return Promise.all(
      Object.values<FieldInstance>(this.inputValues).map(
        (field) =>
          field.hostedField?.render(`#${field.selector}`) as Promise<void>
      )
    );
  };

  private buildFieldsValidity = (
    inputValues: CardFieldValues
  ): FormValidity => {
    const defaultValidity: FieldValidity = {
      errorType: ErrorTypeEnum.EMPTY,
      isValid: false
    };
    const fieldsValidity: Fields = {
      cardholderName: defaultValidity,
      cardNumber: defaultValidity,
      cvv: defaultValidity,
      deferred: defaultValidity,
      expirationDate: defaultValidity
    };

    for (const inputName in inputValues) {
      if (Object.values(InputModelEnum).includes(inputName as InputModelEnum)) {
        fieldsValidity[inputName as keyof Fields] = {
          errorType: inputValues[inputName].validity.errorType,
          isValid: inputValues[inputName].validity.isValid
        };
      }
    }

    return { fields: fieldsValidity, isFormValid: false };
  };
}
