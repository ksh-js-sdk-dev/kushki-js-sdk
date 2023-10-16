import { KushkiGateway } from "gateway/KushkiGateway.ts";
import { CONTAINER } from "infrastructure/Container.ts";
import { ERRORS } from "infrastructure/ErrorEnum.ts";
import { ErrorTypeEnum } from "infrastructure/ErrorTypeEnum.ts";
import { InputModelEnum } from "infrastructure/InputModel.enum.ts";
import { FieldOptions } from "src/interfaces/FieldOptions.ts";
import { IKushki } from "Kushki";
import KushkiHostedFields from "libs/zoid/HostedField.ts";
import {
  CardFieldValues,
  CardOptions,
  CardTokenResponse,
  DeferredByBinOptionsResponse,
  DeferredInputValues,
  Field,
  FieldInstance,
  Fields,
  TokenResponse
} from "module/Payment.ts";
import "reflect-metadata";
import { IKushkiGateway } from "repository/IKushkiGateway.ts";
import { ICard } from "repository/ICard.ts";
import { ISiftScienceProvider } from "repository/ISiftScienceProvider.ts";
import { CREDIT_CARD_ESPECIFICATIONS } from "src/constant/CreditCardEspecifications.ts";
import { IDENTIFIERS } from "src/constant/Identifiers.ts";
import { BinInfoResponse } from "types/bin_info_response";
import { DeferredValues } from "types/card_fields_values";
import { CybersourceJwtResponse } from "types/cybersource_jwt_response";
import {
  FieldTypeEnum,
  FieldValidity,
  FormValidity
} from "types/form_validity";
import { MerchantSettingsResponse } from "types/merchant_settings_response";
import { SecureOtpResponse } from "types/secure_otp_response";
import { SiftScienceObject } from "types/sift_science_object";
import { CountryEnum } from "infrastructure/CountryEnum.ts";
import { KushkiError, KushkiErrorAttr } from "infrastructure/KushkiError.ts";
import { OTPEnum } from "infrastructure/OTPEnum.ts";
import { OTPEventEnum } from "infrastructure/OTPEventEnum.ts";
import { Styles } from "types/card_options";
import { buildCssStyle } from "utils/BuildCssStyle.ts";
import { UtilsProvider } from "src/provider/UtilsProvider.ts";
import { PathEnum } from "infrastructure/PathEnum.ts";
import { ICardinal3DSProvider } from "repository/ICardinal3DSProvider.ts";
import { ISandbox3DSProvider } from "repository/ISandbox3DSProvider.ts";

export class Card implements ICard {
  private readonly options: CardOptions;
  private readonly kushkiInstance: IKushki;
  private inputValues: CardFieldValues;
  private currentBin: string;
  private currentBinHasDeferredOptions: boolean;
  private readonly _gateway: IKushkiGateway;
  private readonly _siftScienceService: ISiftScienceProvider;
  private readonly _cardinal3DSProvider: ICardinal3DSProvider;
  private readonly _sandbox3DSProvider: ISandbox3DSProvider;
  private readonly listenerFieldValidity: string = "fieldValidity";
  private readonly listenerFieldFocus: string = "fieldFocus";
  private readonly listenerFieldBlur: string = "fieldBlur";
  private readonly listenerFieldSubmit: string = "fieldSubmit";
  private readonly otpValidation: string = "otpValidation";
  private readonly otpInputOTP: string = "onInputOTP";
  private readonly deferredDefaultWidth: number = 300;
  private firstHostedFieldType: string = "";

  private constructor(kushkiInstance: IKushki, options: CardOptions) {
    this.options = this.setDefaultValues(options);
    this.kushkiInstance = kushkiInstance;
    this.inputValues = {};
    this.currentBin = "";
    this.currentBinHasDeferredOptions = false;
    this._gateway = CONTAINER.get<KushkiGateway>(IDENTIFIERS.KushkiGateway);
    this._siftScienceService = CONTAINER.get<ISiftScienceProvider>(
      IDENTIFIERS.SiftScienceService
    );
    this._cardinal3DSProvider = CONTAINER.get<ICardinal3DSProvider>(
      IDENTIFIERS.Cardinal3DSProvider
    );
    this._sandbox3DSProvider = CONTAINER.get<ISandbox3DSProvider>(
      IDENTIFIERS.Sandbox3DSProvider
    );
  }

  public static async initCardToken(
    kushkiInstance: IKushki,
    options: CardOptions
  ): Promise<Card> {
    try {
      this.validParamsInitCardToken(kushkiInstance, options);

      const payment: Card = new Card(kushkiInstance, options);

      await payment.initFields(options.fields, options.styles);

      payment.showContainers();

      await payment.hideDeferredOptions();
      await payment.hideOTPInput();

      return payment;
    } catch (error) {
      return await UtilsProvider.validErrors(error, ERRORS.E012);
    }
  }

  public async requestToken(): Promise<TokenResponse> {
    try {
      const { isFormValid } = this.getFormValidity();

      if (!isFormValid) {
        throw new KushkiError(ERRORS.E007);
      }

      const merchantSettings: MerchantSettingsResponse =
        await this._gateway.requestMerchantSettings(this.kushkiInstance);

      const siftScienceSession: SiftScienceObject =
        this._siftScienceService.createSiftScienceSession(
          this.getBinFromCreditCardNumberSift(this.currentBin),
          this.currentBin.slice(-4),
          this.kushkiInstance,
          merchantSettings
        );

      const jwt: string | undefined = await this.getJwtIf3dsEnabled(
        merchantSettings
      );

      if (jwt) {
        return this.buildTokenResponse(
          await this.request3DSToken(jwt, merchantSettings, siftScienceSession)
        );
      } else {
        const cardTokenResponse: CardTokenResponse =
          await this.requestTokenGateway(
            merchantSettings,
            jwt,
            siftScienceSession
          );
        const deferredValues: DeferredValues = this.getDeferredValues();

        await this.validationOTPFLow(cardTokenResponse, deferredValues);

        return Promise.resolve(
          this.buildTokenResponse({
            deferred: deferredValues,
            token: cardTokenResponse.token
          })
        );
      }
    } catch (error) {
      return await UtilsProvider.validErrors(error, ERRORS.E002);
    }
  }

  public onFieldValidity(
    event: (fieldEvent: FormValidity | FieldValidity) => void,
    fieldType?: FieldTypeEnum
  ): void {
    this.addEventListener(this.listenerFieldValidity, event, fieldType);
  }

  public reset(fieldType: FieldTypeEnum): Promise<void> {
    if (Object.values(InputModelEnum).includes(fieldType as InputModelEnum)) {
      this.inputValues[fieldType]?.hostedField?.updateProps({
        brandIcon: "",
        reset: true
      });

      this.inputValues[fieldType]?.hostedField?.updateProps({
        reset: false
      });

      return Promise.resolve();
    } else {
      return Promise.reject(new KushkiError(ERRORS.E009));
    }
  }

  public focus(fieldType: FieldTypeEnum): Promise<void> {
    if (Object.values(InputModelEnum).includes(fieldType as InputModelEnum)) {
      this.inputValues[fieldType]?.hostedField?.updateProps({
        isFocusActive: true
      });

      this.inputValues[fieldType]?.hostedField?.updateProps({
        isFocusActive: false
      });

      return Promise.resolve();
    } else {
      return Promise.reject(new KushkiError(ERRORS.E008));
    }
  }

  public onFieldFocus(
    event: (fieldEvent: FormValidity | FieldValidity) => void,
    fieldType?: FieldTypeEnum
  ): void {
    this.addEventListener(this.listenerFieldFocus, event, fieldType);
  }

  public onFieldBlur(
    event: (fieldEvent: FormValidity | FieldValidity) => void,
    fieldType?: FieldTypeEnum
  ): void {
    this.addEventListener(this.listenerFieldBlur, event, fieldType);
  }

  public onFieldSubmit(
    event: (fieldEvent: FormValidity | FieldValidity) => void,
    fieldType?: FieldTypeEnum
  ): void {
    this.addEventListener(this.listenerFieldSubmit, event, fieldType);
  }

  public onOTPValidation(
    onRequired: () => void,
    onError: (error: KushkiErrorAttr) => void,
    onSuccess: () => void
  ): void {
    window.addEventListener(this.otpValidation, ((
      e: CustomEvent<{ otp: OTPEventEnum }>
    ) => {
      const fieldEvent: { otp: OTPEventEnum } = e.detail!;

      const errorOTP = ERRORS.E008;

      const eventActions: Record<
        OTPEventEnum,
        (error?: KushkiErrorAttr) => void
      > = {
        [OTPEventEnum.SUCCESS]: () => {
          onSuccess();
          this.inputValues.otp?.hostedField?.updateProps({
            otpValidationError: false
          });
        },
        [OTPEventEnum.ERROR]: () => {
          this.inputValues.otp?.hostedField?.updateProps({
            otpValidationError: true
          });
          onError(errorOTP);
        },
        [OTPEventEnum.REQUIRED]: onRequired
      };

      eventActions[fieldEvent.otp]();
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

      if (inputName === InputModelEnum.DEFERRED)
        formValid = this.validateDeferredValues();
    }

    const eventFormValidity: CustomEvent<FormValidity> =
      this.buildEventFormValidity(this.inputValues, undefined);

    dispatchEvent(eventFormValidity);

    return this.buildFieldsValidity(this.inputValues, undefined, formValid);
  }

  private buildTokenResponse = (
    tokenResponseRaw: TokenResponse
  ): TokenResponse => {
    const tokenResponseCreated: TokenResponse = {
      token: tokenResponseRaw.token
    };

    /* istanbul ignore next */
    if (
      !tokenResponseRaw.deferred ||
      tokenResponseRaw.deferred.creditType === ""
    )
      return tokenResponseCreated;

    if (tokenResponseRaw.deferred.creditType === "all") {
      tokenResponseCreated.deferred = {
        months: tokenResponseRaw.deferred.months
      };
    } else {
      tokenResponseCreated.deferred = {
        creditType: tokenResponseRaw.deferred.creditType,
        graceMonths: tokenResponseRaw.deferred.graceMonths,
        months: tokenResponseRaw.deferred.months
      };
    }

    return tokenResponseCreated;
  };

  private async request3DSToken(
    jwt: string,
    merchantSettings: MerchantSettingsResponse,
    siftScienceSession?: SiftScienceObject
  ): Promise<TokenResponse> {
    const deferredValues: DeferredValues = this.getDeferredValues();

    if (merchantSettings.sandboxEnable) {
      return this.getSandboxToken(
        jwt,
        merchantSettings,
        deferredValues,
        siftScienceSession
      );
    } else {
      const tokenResponse = await this.getCardinalToken(
        jwt,
        merchantSettings,
        deferredValues,
        siftScienceSession
      );

      await this.validationOTPFLow(tokenResponse, deferredValues);

      return tokenResponse;
    }
  }

  private async getSandboxToken(
    jwt: string,
    merchantSettings: MerchantSettingsResponse,
    deferredValues: DeferredValues,
    siftScienceSession?: SiftScienceObject
  ) {
    const token = await this.requestTokenGateway(
      merchantSettings,
      jwt,
      siftScienceSession
    );

    await this.validationOTPFLow(token, deferredValues);

    return this._sandbox3DSProvider.validateSandbox3dsToken(
      this.kushkiInstance,
      token,
      deferredValues
    );
  }

  private async getCardinalToken(
    jwt: string,
    merchantSettings: MerchantSettingsResponse,
    deferredValues: DeferredValues,
    siftScienceSession?: SiftScienceObject
  ) {
    return new Promise<CardTokenResponse>((resolve, reject) => {
      this._cardinal3DSProvider.onSetUpComplete(async () => {
        try {
          const token =
            await this._cardinal3DSProvider.validateCardinal3dsToken(
              this.kushkiInstance,
              await this.requestTokenGateway(
                merchantSettings,
                jwt,
                siftScienceSession
              ),
              deferredValues
            );

          resolve(token);
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  private async getJwtIf3dsEnabled(
    merchantSettings: MerchantSettingsResponse
  ): Promise<string | undefined> {
    if (merchantSettings.active_3dsecure) {
      const jwtResponse: CybersourceJwtResponse =
        await this._gateway.requestCybersourceJwt(this.kushkiInstance);

      if (merchantSettings.sandboxEnable)
        this._sandbox3DSProvider.initSandbox();
      else
        await this._cardinal3DSProvider.initCardinal(
          this.kushkiInstance,
          jwtResponse.jwt,
          this.currentBin
        );

      return jwtResponse.jwt;
    } else {
      return undefined;
    }
  }

  private async requestTokenGateway(
    merchantSettings: MerchantSettingsResponse,
    jwt?: string,
    siftScienceSession?: SiftScienceObject
  ): Promise<CardTokenResponse> {
    try {
      const deferredValues: DeferredValues =
        this.buildGetDeferredValuesToRequestToken(merchantSettings);
      const requestPath: string = this.options.isSubscription
        ? PathEnum.card_subscription_token
        : PathEnum.card_token;

      const token = await this.inputValues[
        this.firstHostedFieldType
      ].hostedField.requestPaymentToken(
        this.kushkiInstance,
        this.options,
        requestPath,
        jwt,
        siftScienceSession,
        deferredValues
      );

      return Promise.resolve(token);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  private getDeferredValues = (
    deferredInstance = this.inputValues.deferred
  ): DeferredValues => {
    if (!deferredInstance || !deferredInstance.value) return {};

    if (typeof deferredInstance.value !== "object") return {};

    return deferredInstance.value;
  };

  private buildGetDeferredValuesToRequestToken = (
    merchantSettings: MerchantSettingsResponse
  ): DeferredValues => {
    const deferredValuesToRequestToken: DeferredValues = {};
    const deferredValues = this.getDeferredValues();

    if (deferredValues.isDeferred)
      deferredValuesToRequestToken.isDeferred = deferredValues.isDeferred;

    if (
      merchantSettings.country === CountryEnum.CHL &&
      deferredValues.isDeferred
    )
      deferredValuesToRequestToken.months = deferredValues.months;

    return deferredValuesToRequestToken;
  };

  private validateDeferredValues = (): boolean => {
    let deferredValuesAreValid: boolean = true;

    if (
      !this.inputValues.deferred ||
      !this.inputValues.deferred.value ||
      Object.keys(this.inputValues.deferred.value).length === 0
    )
      return deferredValuesAreValid;

    const deferredValues: DeferredValues = this.getDeferredValues();

    if (!deferredValues.isDeferred) {
      this.inputValues.deferred.validity.isValid = deferredValuesAreValid;

      return deferredValuesAreValid;
    }

    const deferredTypeIsSelected: boolean = deferredValues.creditType !== "";

    deferredValuesAreValid =
      Boolean(deferredValues.isDeferred) && deferredTypeIsSelected;

    this.inputValues.deferred.validity.isValid = deferredValuesAreValid;

    if (!deferredValuesAreValid) {
      this.inputValues.deferred.validity.errorType =
        ErrorTypeEnum.DEFERRED_TYPE_REQUERED;
      this.inputValues.deferred?.hostedField?.updateProps({
        deferredOptions: {
          isValid: false
        }
      });

      return deferredValuesAreValid;
    }

    const deferredMonthsIsSelected: boolean = deferredValues.months !== 0;

    deferredValuesAreValid =
      Boolean(deferredValues.isDeferred) && deferredMonthsIsSelected;

    this.inputValues.deferred.validity.isValid = deferredValuesAreValid;

    if (!deferredValuesAreValid) {
      this.inputValues.deferred.validity.errorType =
        ErrorTypeEnum.DEFERRED_MONTHS_REQUERED;
      this.inputValues.deferred?.hostedField?.updateProps({
        deferredOptions: {
          isValid: false
        }
      });
    }

    return deferredValuesAreValid;
  };

  private setDefaultValues(options: CardOptions): CardOptions {
    return {
      ...options,
      isSubscription: Boolean(options.isSubscription)
    };
  }

  private async handleOnChangeOTP(value: string) {
    this.inputValues = {
      ...this.inputValues,
      [InputModelEnum.OTP]: {
        ...this.inputValues[InputModelEnum.OTP],
        value: value
      }
    };

    if (
      this.inputValues.otp?.value !== undefined &&
      this.inputValues.otp?.value.toString().length === 3
    ) {
      const event: CustomEvent<{ otpValue: string }> = new CustomEvent<{
        otpValue: string;
      }>(this.otpInputOTP, {
        detail: {
          otpValue: this.inputValues.otp.value as string
        }
      });

      dispatchEvent(event);
    }
  }

  private createCustomEvent(listener: string, fieldType: string) {
    const event: CustomEvent<FormValidity> = new CustomEvent<FormValidity>(
      listener,
      {
        detail: this.buildFieldsValidity(
          this.inputValues,
          fieldType as FieldTypeEnum
        )
      }
    );

    dispatchEvent(event);

    const eventField: CustomEvent<FormValidity> = new CustomEvent<FormValidity>(
      `${listener}${fieldType}`,
      {
        detail: this.buildFieldsValidity(
          this.inputValues,
          fieldType as FieldTypeEnum
        )
      }
    );

    dispatchEvent(eventField);
  }

  private handleOnFocus(fieldType: string) {
    this.createCustomEvent(this.listenerFieldFocus, fieldType);
  }

  private handleOnSubmit(fieldType: string) {
    this.createCustomEvent(this.listenerFieldSubmit, fieldType);
  }

  private handleOnBlur(fieldType: string) {
    this.createCustomEvent(this.listenerFieldBlur, fieldType);
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
      this.inputValues,
      field
    );

    dispatchEvent(event);

    const eventField: CustomEvent<FormValidity> = new CustomEvent<FormValidity>(
      `${this.listenerFieldValidity}${field}`,
      {
        detail: this.buildFieldsValidity(
          this.inputValues,
          field as FieldTypeEnum
        )
      }
    );

    dispatchEvent(eventField);
  }

  private async handleOnBinChange(bin: string) {
    if (!bin) {
      this.inputValues.deferred?.hostedField?.updateProps({
        deferredOptions: {
          bin: "",
          options: []
        }
      });
      this.inputValues.deferred?.hostedField?.hide();

      return;
    }
    if (this.currentBin !== bin) {
      this.currentBin = bin;
      this.currentBinHasDeferredOptions = false;
      try {
        const { brand, cardType }: BinInfoResponse =
          await this._gateway.requestBinInfo(this.kushkiInstance, {
            bin
          });

        this.inputValues.cardNumber?.hostedField?.updateProps({
          brandIcon: brand
        });

        if (cardType !== "credit")
          await this.inputValues.deferred?.hostedField?.hide();

        if (cardType === "credit" && !this.options.isSubscription) {
          const deferredResponse: DeferredByBinOptionsResponse[] =
            await this._gateway.requestDeferredInfo(this.kushkiInstance, {
              bin
            });

          await this.inputValues.deferred?.hostedField?.updateProps({
            deferredOptions: {
              bin,
              options: deferredResponse
            }
          });

          this.currentBinHasDeferredOptions =
            Array.isArray(deferredResponse) && deferredResponse.length > 0;
          if (this.currentBinHasDeferredOptions)
            await this.inputValues.deferred?.hostedField?.show();
          else await this.inputValues.deferred?.hostedField?.hide();
        }
      } catch (error) {
        this.inputValues.cardNumber?.hostedField?.updateProps({
          brandIcon: "",
          deferredOptions: {
            bin,
            options: []
          }
        });
      }
    } else if (this.currentBinHasDeferredOptions) {
      await this.inputValues.deferred?.hostedField?.show();
    }
  }

  private onChangeDeferred(values: DeferredInputValues) {
    const deferredValues = this.getDeferredValues({
      selector: "",
      validity: { isValid: true },
      value: values
    });

    this.inputValues.deferred!.value = deferredValues;

    if (deferredValues.isDeferred) {
      this.inputValues.deferred?.hostedField?.resize({
        height: 125,
        width: this.deferredDefaultWidth
      });
    }

    if (deferredValues.isDeferred && deferredValues.creditType !== "") {
      this.inputValues.deferred?.hostedField?.resize({
        height: 160,
        width: this.deferredDefaultWidth
      });
    }
  }

  private buildFieldOptions(
    field: Field,
    fieldType: InputModelEnum,
    styles?: Styles
  ) {
    const options: FieldOptions = {
      ...field,
      fieldType,
      handleOnBinChange: (bin: string) => this.handleOnBinChange(bin),
      handleOnBlur: (field: string) => this.handleOnBlur(field),
      handleOnFocus: (field: string) => this.handleOnFocus(field),
      handleOnOtpChange: (code: string) => this.handleOnChangeOTP(code),
      handleOnSubmit: (field: string) => this.handleOnSubmit(field),
      handleOnValidity: (field: InputModelEnum, fieldValidity: FieldValidity) =>
        this.handleOnValidity(field, fieldValidity),
      styles: buildCssStyle(styles || {})
    };

    if (fieldType === InputModelEnum.DEFERRED) {
      options.handleOnDeferredChange = (values: DeferredInputValues) =>
        this.onChangeDeferred(values);
    }

    return options;
  }

  private initFields(
    optionsFields: { [k: string]: Field },
    styles?: Styles
  ): Promise<void[]> {
    for (const fieldKey in optionsFields) {
      const field = optionsFields[fieldKey];
      const options = this.buildFieldOptions(
        field,
        fieldKey as InputModelEnum,
        styles
      );
      let hostedField;

      if (this.firstHostedFieldType) {
        hostedField = KushkiHostedFields(options);
      } else {
        hostedField = KushkiHostedFields({ ...options, isFirst: true });
        this.firstHostedFieldType = fieldKey;
      }

      this.inputValues[fieldKey] = {
        hostedField,
        selector: field.selector,
        validity: {
          isValid: false
        }
      };
    }
    if (this.inputValues.deferred) {
      this.inputValues.deferred.validity = { isValid: true };
    }
    if (this.inputValues.otp) {
      this.inputValues.otp.validity = { isValid: true };
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
          field!.hostedField?.render(`#${field!.selector}`) as Promise<void>
      )
    );
  };

  private buildFieldsValidity = (
    inputValues: CardFieldValues,
    field?: FieldTypeEnum,
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
    let formValid: boolean = true;

    for (const inputName in inputValues) {
      if (
        Object.values(InputModelEnum).includes(inputName as InputModelEnum) &&
        inputName !== InputModelEnum.OTP &&
        inputValues[inputName].validity
      ) {
        fieldsValidity[inputName as keyof Fields] = {
          errorType: inputValues[inputName].validity.errorType,
          isValid: inputValues[inputName].validity.isValid
        };
      }
      const validityProps: FieldValidity = this.inputValues[inputName].validity;
      const isInputInValid: boolean = !validityProps.isValid;

      if (isInputInValid) formValid = false;
    }

    return {
      fields: fieldsValidity,
      isFormValid: isFormValid ?? formValid,
      triggeredBy: field
    };
  };

  private buildEventFormValidity = (
    inputValues: CardFieldValues,
    field?: FieldTypeEnum
  ): CustomEvent<FormValidity> => {
    return new CustomEvent<FormValidity>(this.listenerFieldValidity, {
      detail: this.buildFieldsValidity(inputValues, field)
    });
  };

  private getBinFromCreditCardNumberSift(value: string): string {
    return value.slice(
      CREDIT_CARD_ESPECIFICATIONS.cardInitialBinPlace,
      CREDIT_CARD_ESPECIFICATIONS.cardFinalBinPlaceSift
    );
  }

  private hideDeferredOptions = (): Promise<void> => {
    if (!this.inputValues.deferred || !this.inputValues.deferred?.hostedField)
      return Promise.resolve();

    return new Promise<void>((resolve, reject) => {
      this.inputValues.deferred?.hostedField
        ?.resize({ height: 75, width: this.deferredDefaultWidth })
        .then(() => this.inputValues.deferred?.hostedField?.hide())
        .then(() => resolve())
        .catch((error: any) => reject(error));
    });
  };

  private async getOtpInput(secureId: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      let countTries = 0;

      window.addEventListener(this.otpInputOTP, (async (
        e: CustomEvent<{ otpValue: string }>
      ): Promise<void> => {
        countTries += 1;

        if (countTries <= 3) {
          const otpInputValue: { otpValue: string } = e.detail!;

          const resultValidationOTP = await this.validationOTP(
            otpInputValue.otpValue,
            secureId
          );

          if (resultValidationOTP) resolve(true);
          /* istanbul ignore next*/
          if (!resultValidationOTP) {
            this.dispatchEventOTPValidation(OTPEventEnum.ERROR);
          }
          /* istanbul ignore next*/
          if (!resultValidationOTP && countTries === 3) {
            reject(new KushkiError(ERRORS.E008));
          }
        }
      }) as unknown as EventListener);
    });
  }

  private async validationOTPFLow(
    tokenResponse: CardTokenResponse,
    deferredValues: DeferredValues
  ) {
    const inputOTPValidation: TokenResponse | undefined =
      await this.validInputOTP(
        tokenResponse.token,
        deferredValues,
        tokenResponse.secureService,
        tokenResponse.secureId
      );

    if (inputOTPValidation !== undefined)
      return this.buildTokenResponse(inputOTPValidation);
  }

  private async validInputOTP(
    token: string,
    deferredValues: DeferredValues,
    secureService?: string,
    secureId?: string
  ): Promise<TokenResponse | undefined> {
    const hasOTP: boolean =
      secureService === OTPEnum.secureService && secureId !== "";

    if (hasOTP) {
      this.showOtpAndHideInputs();
      const otpInputSuccess: boolean = await this.getOtpInput(secureId!);

      if (otpInputSuccess) {
        this.dispatchEventOTPValidation(OTPEventEnum.SUCCESS);

        return Promise.resolve({
          deferred: deferredValues,
          token: token
        });
      }
    }

    return undefined;
  }

  /* istanbul ignore next*/
  private async validationOTP(
    otpValue: string,
    secureId: string
  ): Promise<boolean> {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        const secureOTPResponse: SecureOtpResponse =
          await this._gateway.requestSecureServiceValidation(
            this.kushkiInstance,
            {
              otpValue: otpValue ?? "",
              secureService: OTPEnum.secureService,
              secureServiceId: secureId
            }
          );

        if (
          "code" in secureOTPResponse &&
          secureOTPResponse.code === OTPEnum.secureCodeSuccess
        )
          resolve(true);
        else {
          this.dispatchEventOTPValidation(OTPEventEnum.ERROR);
          resolve(false);
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  private hideOTPInput = (): Promise<void> => {
    if (!this.inputValues.otp) return Promise.resolve();

    return this.inputValues.otp?.hostedField?.hide();
  };

  private buildEventOtpValidation = (
    inputOtp: OTPEventEnum
  ): CustomEvent<{ otp: OTPEventEnum }> => {
    return new CustomEvent<{ otp: OTPEventEnum }>(this.otpValidation, {
      detail: {
        otp: inputOtp
      }
    });
  };

  private showOtpAndHideInputs = (): void => {
    this.dispatchEventOTPValidation(OTPEventEnum.REQUIRED);
    this.inputValues.otp?.hostedField?.show();
  };

  private dispatchEventOTPValidation = (eventOTP: OTPEventEnum) => {
    const eventOtpValidity: CustomEvent<{ otp: OTPEventEnum }> =
      this.buildEventOtpValidation(eventOTP);

    dispatchEvent(eventOtpValidity);
  };

  /* istanbul ignore next*/
  private addEventListener(
    listener: string,
    event: (fieldEvent: FormValidity | FieldValidity) => void,
    fieldType?: FieldTypeEnum
  ): void {
    if (fieldType) {
      window.addEventListener(`${listener}${fieldType}`, ((
        e: CustomEvent<FormValidity>
      ) => {
        event(e.detail!.fields![fieldType as keyof Fields] || e.detail!);
      }) as EventListener);
    } else {
      window.addEventListener(listener, ((e: CustomEvent<FormValidity>) => {
        event(e.detail!);
      }) as EventListener);
    }
  }

  private static validParamsInitCardToken(
    kushkiInstance: IKushki,
    options: CardOptions
  ): void {
    if (!options || !kushkiInstance) {
      throw new KushkiError(ERRORS.E012);
    }
  }
}
