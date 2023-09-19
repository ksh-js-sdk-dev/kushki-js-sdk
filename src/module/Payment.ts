import { KushkiGateway } from "gateway/KushkiGateway.ts";
import { CONTAINER } from "infrastructure/Container.ts";
import { ERRORS } from "infrastructure/ErrorEnum.ts";
import { ErrorTypeEnum } from "infrastructure/ErrorTypeEnum.ts";
import { InputModelEnum } from "infrastructure/InputModel.enum.ts";
import { FieldOptions } from "infrastructure/interfaces/FieldOptions.ts";
import {
  DeferredByBinResponse,
  DeferredInputValues,
  FieldInstance,
  Kushki
} from "Kushki";
import KushkiHostedFields from "libs/HostedField.ts";
import {
  CardFieldValues,
  CardOptions,
  CardTokenRequest,
  Field,
  Fields,
  TokenResponse
} from "module/index.ts";
import "reflect-metadata";
import { IKushkiGateway } from "repository/IKushkiGateway.ts";
import { IPayment } from "repository/IPayment.ts";
import { ISiftScienceService } from "repository/ISiftScienceService.ts";
import { CREDIT_CARD_ESPECIFICATIONS } from "src/constant/CreditCardEspecifications.ts";
import { IDENTIFIERS } from "src/constant/Identifiers.ts";
import { BinInfoResponse } from "types/bin_info_response";
import { DeferredValues } from "types/card_fields_values";
import { CybersourceJwtResponse } from "types/cybersource_jwt_response";
import { FieldValidity, FormValidity } from "types/form_validity";
import { MerchantSettingsResponse } from "types/merchant_settings_response";
import { SecureOtpResponse } from "types/secure_otp_response";
import { SiftScienceObject } from "types/sift_science_object";
import { KushkiCardinalSandbox } from "@kushki/cardinal-sandbox-js";

declare global {
  // tslint:disable-next-line
  interface Window {
    // tslint:disable-next-line:no-any
    Cardinal: any;
  }
}

export class Payment implements IPayment {
  private readonly options: CardOptions;
  private readonly kushkiInstance: Kushki;
  private inputValues: CardFieldValues;
  private currentBin: string;
  private readonly _gateway: IKushkiGateway;
  private readonly _siftScienceService: ISiftScienceService;
  private readonly listenerFieldValidity: string = "fieldValidity";

  private constructor(kushkiInstance: Kushki, options: CardOptions) {
    this.options = this.setDefaultValues(options);
    this.kushkiInstance = kushkiInstance;
    this.inputValues = {};
    this.currentBin = "";
    this._gateway = CONTAINER.get<KushkiGateway>(IDENTIFIERS.KushkiGateway);
    this._siftScienceService = CONTAINER.get<ISiftScienceService>(
      IDENTIFIERS.SiftScienceService
    );
  }

  public static async initCardToken(
    kushkiInstance: Kushki,
    options: CardOptions
  ): Promise<Payment> {
    // eslint-disable-next-line no-useless-catch
    try {
      const payment: Payment = new Payment(kushkiInstance, options);

      await payment.initFields(options.fields);

      payment.showContainers();

      await payment.hideDeferredOptions();

      return payment;
    } catch (error) {
      throw error;
    }
  }

  public async requestToken(): Promise<TokenResponse> {
    try {
      const { isFormValid } = this.getFormValidity();

      if (!isFormValid) {
        return Promise.reject(ERRORS.E007);
      }

      const merchantSettings: MerchantSettingsResponse =
        await this._gateway.requestMerchantSettings(this.kushkiInstance);

      const cardValue: string = this.inputValues
        .cardNumber!.value!.toString()
        .replace(/\s+/g, "");

      const scienceSession: SiftScienceObject =
        this._siftScienceService.createSiftScienceSession(
          this.getBinFromCreditCardNumberSift(cardValue),
          cardValue.slice(-4),
          this.kushkiInstance,
          merchantSettings
        );

      const jwt: string | undefined = await this.getJwtIf3dsEnabled(
        merchantSettings
      );

      if (jwt) {
        return await this.request3DSToken(
          jwt,
          merchantSettings.sandboxEnable,
          scienceSession
        );
      } else return await this.requestTokenGateway(jwt, scienceSession);
      // eslint-disable-next-line no-useless-catch
    } catch (error) {
      throw error;
    } finally {
      if (window.Cardinal) {
        window.Cardinal.off("payments.setupComplete");
        window.Cardinal.off("payments.validated");
      }
    }
  }

  public onFieldValidity(event: (fieldEvent: FormValidity) => void): void {
    window.addEventListener(this.listenerFieldValidity, ((
      e: CustomEvent<FormValidity>
    ) => {
      const fieldEvent: FormValidity = e.detail!;

      event(fieldEvent);
    }) as EventListener);
  }

  public getFormValidity(): FormValidity {
    let formValid: boolean = true;

    for (const inputName in this.inputValues) {
      const validityProps: FieldValidity = this.inputValues[inputName].validity;
      const isInputInValid: boolean = !validityProps.isValid;
      const isErrorTypeValid: boolean = Boolean(validityProps.errorType);

      if (isInputInValid) formValid = false;
      if (isInputInValid && !isErrorTypeValid)
        validityProps.errorType = ErrorTypeEnum.EMPTY;
    }

    const eventFormValidity: CustomEvent<FormValidity> =
      this.buildEventFormValidity(this.inputValues);

    dispatchEvent(eventFormValidity);

    return this.buildFieldsValidity(this.inputValues, formValid);
  }

  private async request3DSToken(
    jwt: string,
    isSandboxEnabled?: boolean,
    scienceSession?: SiftScienceObject
  ): Promise<TokenResponse> {
    let token: TokenResponse;

    if (isSandboxEnabled)
      token = await this.requestTokenGateway(jwt, scienceSession);
    else token = await this.getCardinal3dsToken(jwt, scienceSession);

    return this.validate3dsToken(token, isSandboxEnabled);
  }

  private validate3dsToken(
    token: TokenResponse,
    isSandboxEnabled?: boolean
  ): Promise<TokenResponse> {
    if (this.tokenNotNeedsAuth(token)) {
      return Promise.resolve(token);
    }
    if (this.hasAllSecurityProperties(token, isSandboxEnabled))
      return this.validate3DS(token, isSandboxEnabled);

    return Promise.reject(ERRORS.E005);
  }

  private hasAllSecurityProperties(
    token: TokenResponse,
    isSandboxEnabled?: boolean
  ): boolean {
    const validateVersion = (): boolean =>
      isSandboxEnabled
        ? true
        : +token.security!.specificationVersion.split(".")[0] >= 2;

    return !!(
      token.security &&
      token.security.authRequired &&
      token.security.acsURL !== undefined &&
      token.security.paReq !== undefined &&
      token.security.authenticationTransactionId &&
      validateVersion()
    );
  }

  private tokenNotNeedsAuth(token: TokenResponse): boolean {
    return (
      !!(token.security && !token.security.authRequired) || !token.security
    );
  }

  private async validate3DS(
    token: TokenResponse,
    isSandboxEnabled?: boolean
  ): Promise<TokenResponse> {
    this.launchPaymentValidation(token, isSandboxEnabled);

    if (await this.completePaymentValidation(token.secureId!, isSandboxEnabled))
      return Promise.resolve(token);
    else return Promise.reject(ERRORS.E006);
  }

  private async completePaymentValidation(
    secureServiceId: string,
    isSandboxEnabled?: boolean
  ): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const secureValidation = async () => {
        try {
          const secureValidation: SecureOtpResponse =
            await this._gateway.requestSecureServiceValidation(
              this.kushkiInstance,
              {
                otpValue: "",
                secureServiceId
              }
            );

          resolve(this.is3dsValid(secureValidation));
        } catch (error) {
          reject(error);
        }
      };

      if (isSandboxEnabled)
        KushkiCardinalSandbox.on(
          "payments.validated",
          async (isErrorFlow?: boolean) => {
            if (isErrorFlow === true) reject(ERRORS.E005);
            else await secureValidation();
          }
        );
      else
        window.Cardinal.on("payments.validated", async () => {
          await secureValidation();
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

  private launchPaymentValidation(
    token: TokenResponse,
    isSandboxEnabled?: boolean
  ) {
    if (isSandboxEnabled)
      KushkiCardinalSandbox.continue(
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
    else
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

  private async getCardinal3dsToken(
    jwt: string,
    scienceSession?: SiftScienceObject
  ): Promise<TokenResponse> {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise<TokenResponse>(async (resolve, reject) => {
      const requestToken = async () => {
        try {
          resolve(await this.requestTokenGateway(jwt, scienceSession));
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

      if (merchantSettings.sandboxEnable) KushkiCardinalSandbox.init();
      else await this.initCardinal(jwtResponse.jwt);

      return jwtResponse.jwt;
    } else {
      return undefined;
    }
  }

  private async initCardinal(jwt: string) {
    if (this.kushkiInstance.isInTest())
      await import("libs/cardinal/staging.ts");
    else await import("libs/cardinal/prod.ts");

    await this.setupCardinal(jwt);
  }

  private async setupCardinal(jwt: string) {
    const accountNumber = this.inputValues[InputModelEnum.CARD_NUMBER]
      ?.value!.toString()
      .replace(/\s+/g, "");

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

  private requestTokenGateway(
    jwt?: string,
    scienceSession?: SiftScienceObject
  ) {
    if (this.options.isSubscription)
      return this._gateway.requestCreateSubscriptionToken(
        this.kushkiInstance,
        this.buildTokenBody(jwt, scienceSession)
      );

    return this._gateway.requestToken(
      this.kushkiInstance,
      this.buildTokenBody(jwt, scienceSession)
    );
  }

  private buildTokenBody(
    jwt?: string,
    scienceSession?: SiftScienceObject
  ): CardTokenRequest {
    const { cardholderName, cardNumber, expirationDate, cvv } =
      this.inputValues;
    const { currency } = this.options;

    const deferredValues = this.getDeferredValues();

    return {
      ...scienceSession,
      card: {
        cvv: String(cvv!.value!),
        expiryMonth: String(expirationDate!.value!).split("/")[0]!,
        expiryYear: String(expirationDate!.value!).split("/")[1]!,
        name: String(cardholderName!.value!),
        number: String(cardNumber!.value!).replace(/\s+/g, "")
      },
      currency,
      isDeferred: deferredValues.isDeferred,
      jwt,
      months: deferredValues.months,
      ...this.buildTotalAmount()
    };
  }

  private getDeferredValues = (): DeferredValues => {
    if (!this.inputValues.deferred || !this.inputValues.deferred.value)
      return {};

    if (typeof this.inputValues.deferred.value !== "object") return {};

    return this.inputValues.deferred.value;
  };

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

    const event: CustomEvent<FormValidity> = this.buildEventFormValidity(
      this.inputValues
    );

    dispatchEvent(event);
  }

  private async handleSetCardNumber(cardNumber: string) {
    const newBin: string = cardNumber.substring(0, 8);

    if (this.currentBin !== newBin) {
      this.currentBin = newBin;

      try {
        const { brand, cardType }: BinInfoResponse =
          await this._gateway.requestBinInfo(this.kushkiInstance, {
            bin: newBin
          });

        this.inputValues.cardNumber?.hostedField?.updateProps({
          brandIcon: brand
        });
        /* istanbul ignore next */
        if (cardType === "credit" && !this.options.isSubscription)
          this._gateway
            .requestDeferredInfo(this.kushkiInstance, {
              bin: newBin
            })
            .then(
              (deferredOptions: DeferredByBinResponse[]) =>
                this.inputValues.deferred?.hostedField?.updateProps({
                  deferredOptions
                })
            )
            .then(() => this.inputValues.deferred?.hostedField?.show());
      } catch (error) {
        this.inputValues.cardNumber?.hostedField?.updateProps({
          brandIcon: ""
        });
      }
    }
  }

  private onChangeDeferred(values: DeferredInputValues) {
    this.inputValues.deferred!.value = values;
  }

  private onFocusDeferred(values: DeferredInputValues) {
    values;
  }

  private onBlurDeferred(values: DeferredInputValues) {
    values;
  }

  private onChangeCardNumber(value: string) {
    const cardNumber: string = value.replace(/ /g, "");

    if (cardNumber.length >= 8) this.handleSetCardNumber(cardNumber);
  }

  private buildFieldOptions(field: Field) {
    const options: FieldOptions = {
      ...field,
      handleOnBlur: (field: string, value: string) =>
        this.handleOnBlur(field, value),
      handleOnChange: (field: string, value: string) => {
        return this.handleOnChange(field, value);
      },
      handleOnFocus: (field, value: string) => this.handleOnFocus(field, value),
      handleOnValidity: (field: InputModelEnum, fieldValidity: FieldValidity) =>
        this.handleOnValidity(field, fieldValidity)
    };

    if (field.fieldType === InputModelEnum.DEFERRED) {
      options.handleOnChange = (values: DeferredInputValues) =>
        this.onChangeDeferred(values);
      options.handleOnFocus = (values: DeferredInputValues) =>
        this.onFocusDeferred(values);
      options.handleOnBlur = (values: DeferredInputValues) =>
        this.onBlurDeferred(values);
    }

    return options;
  }

  private initFields(optionsFields: { [k: string]: Field }): Promise<void[]> {
    for (const fieldKey in optionsFields) {
      const field = optionsFields[fieldKey];
      const options = this.buildFieldOptions(field);

      const hostedField = KushkiHostedFields(options);

      this.inputValues[field.fieldType] = {
        hostedField,
        selector: field.selector,
        validity: {
          isValid: false
        }
      };
    }

    if (this.inputValues.deferred)
      this.inputValues.deferred.validity = { isValid: true };

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
          field!.hostedField?.render(`#${field!.selector}`) as Promise<void>
      )
    );
  };

  private buildFieldsValidity = (
    inputValues: CardFieldValues,
    isFormValid?: boolean
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

    return { fields: fieldsValidity, isFormValid: isFormValid ?? false };
  };

  private buildEventFormValidity = (
    inputValues: CardFieldValues
  ): CustomEvent<FormValidity> => {
    return new CustomEvent<FormValidity>(this.listenerFieldValidity, {
      detail: this.buildFieldsValidity(inputValues)
    });
  };

  private getBinFromCreditCardNumberSift(value: string): string {
    return value.slice(
      CREDIT_CARD_ESPECIFICATIONS.cardInitialBinPlace,
      CREDIT_CARD_ESPECIFICATIONS.cardFinalBinPlaceSift
    );
  }

  private hideDeferredOptions = (): Promise<void> => {
    if (!this.inputValues.deferred) return Promise.resolve();

    return new Promise<void>((resolve, reject) => {
      this.resizeField(400, 300, this.inputValues.deferred)
        .then(() => this.inputValues.deferred?.hostedField?.hide())
        .then(() => resolve())
        .catch((error: any) => reject(error));
    });
  };

  private resizeField = (
    width: number,
    height: number,
    field?: FieldInstance
  ): Promise<void> => {
    /* istanbul ignore next*/
    if (!field) return Promise.resolve();

    return field.hostedField?.resize({ height, width });
  };
}
