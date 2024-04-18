import { KushkiGateway } from "gateway/KushkiGateway.ts";
import { ERRORS } from "infrastructure/ErrorEnum.ts";
import { ErrorTypeEnum } from "infrastructure/ErrorTypeEnum.ts";
import { InputModelEnum } from "infrastructure/InputModel.enum.ts";
import { FieldOptions } from "src/interfaces/FieldOptions.ts";
import { IKushki } from "Kushki";
import {
  DestroyKushkiHostedFields,
  KushkiHostedFields
} from "libs/zoid/HostedField.ts";
import {
  CardFieldValues,
  CardOptions,
  CardTokenResponse,
  DeferredByBinOptionsResponse,
  DeferredInputValues,
  Field,
  TokenResponse
} from "module/Card.ts";
import { IKushkiGateway } from "repository/IKushkiGateway.ts";
import { ICard } from "repository/ICard.ts";
import { ISiftScienceProvider } from "repository/ISiftScienceProvider.ts";
import { CREDIT_CARD_ESPECIFICATIONS } from "src/constant/CreditCardEspecifications.ts";
import { BinInfoResponse } from "types/bin_info_response";
import { DeferredValues } from "types/card_fields_values";
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
import { IRollbarGateway } from "repository/IRollbarGateway.ts";
import { RollbarGateway } from "gateway/RollbarGateway.ts";
import { SiftScienceProvider } from "src/provider/SiftScienceProvider.ts";
import { Cardinal3DSProvider } from "src/provider/Cardinal3DSProvider.ts";
import { Sandbox3DSProvider } from "src/provider/Sandbox3DSProvider.ts";
import { getJwtIf3dsEnabled } from "utils/3DSUtils.ts";
import {
  addEventListener,
  buildCustomHeaders,
  dispatchCustomEvent,
  focusField,
  hideContainers,
  renderFields,
  resetField,
  showContainers,
  updateValidity,
  validateInitParams
} from "utils/HostedFieldsUtils.ts";
import { FieldEventsEnum } from "infrastructure/FieldEventsEnum.ts";

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
  private readonly otpValidation: string = "otpValidation";
  private readonly otpInputOTP: string = "onInputOTP";
  private readonly deferredDefaultWidth: number = 300;
  private firstHostedFieldType: string = "";
  private rollbar: IRollbarGateway;

  private constructor(kushkiInstance: IKushki, options: CardOptions) {
    this.options = this.setDefaultValues(options);
    this.kushkiInstance = kushkiInstance;
    this.inputValues = {};
    this.currentBin = "";
    this.currentBinHasDeferredOptions = false;
    this._gateway = new KushkiGateway();
    this._siftScienceService = new SiftScienceProvider();
    this._cardinal3DSProvider = new Cardinal3DSProvider();
    this._sandbox3DSProvider = new Sandbox3DSProvider();

    this.rollbar = new RollbarGateway();
    this.rollbar.init(kushkiInstance.getOptions());
  }

  public getInputs(): CardFieldValues {
    return this.inputValues;
  }

  public static async initCardToken(
    kushkiInstance: IKushki,
    options: CardOptions
  ): Promise<Card> {
    try {
      validateInitParams(kushkiInstance, options);

      const payment: Card = new Card(kushkiInstance, options);

      await payment.initFields(options.fields, options.styles);

      showContainers(payment.getInputs());

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

      const jwt: string | undefined = await getJwtIf3dsEnabled({
        accountNumber: this.currentBin,
        cardinal3DS: this._cardinal3DSProvider,
        gateway: this._gateway,
        kushkiInstance: this.kushkiInstance,
        merchantSettings,
        sandbox3DS: this._sandbox3DSProvider
      });

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
    addEventListener(FieldEventsEnum.VALIDITY, event, fieldType);
  }

  public reset(fieldType: FieldTypeEnum): Promise<void> {
    return resetField(this.inputValues, fieldType);
  }

  public focus(fieldType: FieldTypeEnum): Promise<void> {
    return focusField(this.inputValues, fieldType);
  }

  public onFieldFocus(
    event: (fieldEvent: FormValidity | FieldValidity) => void,
    fieldType?: FieldTypeEnum
  ): void {
    addEventListener(FieldEventsEnum.FOCUS, event, fieldType);
  }

  public onFieldBlur(
    event: (fieldEvent: FormValidity | FieldValidity) => void,
    fieldType?: FieldTypeEnum
  ): void {
    addEventListener(FieldEventsEnum.BLUR, event, fieldType);
  }

  public onFieldSubmit(
    event: (fieldEvent: FormValidity | FieldValidity) => void,
    fieldType?: FieldTypeEnum
  ): void {
    addEventListener(FieldEventsEnum.SUBMIT, event, fieldType);
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

    return dispatchCustomEvent(
      this.inputValues,
      FieldEventsEnum.VALIDITY,
      undefined,
      formValid
    );
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
  ): Promise<TokenResponse> {
    const tokenResponse: CardTokenResponse = await this.requestTokenGateway(
      merchantSettings,
      jwt,
      siftScienceSession
    );

    return this._cardinal3DSProvider.validateCardinal3dsToken(
      this.kushkiInstance,
      tokenResponse,
      deferredValues
    );
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
      const headers = buildCustomHeaders();

      const token = await this.inputValues[
        this.firstHostedFieldType
      ].hostedField.requestPaymentToken(
        this.kushkiInstance,
        this.options,
        requestPath,
        headers,
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

  private handleOnValidity(
    field: InputModelEnum,
    fieldValidity: FieldValidity
  ): void {
    this.inputValues = updateValidity(this.inputValues, field, fieldValidity);

    dispatchCustomEvent(this.inputValues, FieldEventsEnum.VALIDITY, field);
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
        height: 110,
        width: this.deferredDefaultWidth
      });
    }

    if (deferredValues.isDeferred && deferredValues.creditType === "all") {
      this.inputValues.deferred?.hostedField?.resize({
        height: 110,
        width: this.deferredDefaultWidth
      });
    } else if (deferredValues.isDeferred && deferredValues.creditType !== "") {
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
      handleOnBlur: (field: string) =>
        dispatchCustomEvent(this.inputValues, FieldEventsEnum.BLUR, field),
      handleOnFocus: (field: string) =>
        dispatchCustomEvent(this.inputValues, FieldEventsEnum.FOCUS, field),
      handleOnOtpChange: (code: string) => this.handleOnChangeOTP(code),
      handleOnSubmit: (field: string) =>
        dispatchCustomEvent(this.inputValues, FieldEventsEnum.SUBMIT, field),
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
    DestroyKushkiHostedFields();

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

    hideContainers(this.inputValues);

    return renderFields(this.inputValues);
  }

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
        this.rollbar.error(error);
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
}
