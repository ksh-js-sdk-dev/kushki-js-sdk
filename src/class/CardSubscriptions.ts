import { ERRORS } from "infrastructure/ErrorEnum.ts";
import {
  FieldEventsEnum,
  FieldsMethodTypesEnum
} from "infrastructure/FieldEventsEnum.ts";
import { InputModelEnum } from "infrastructure/InputModel.enum.ts";
import { KushkiError } from "infrastructure/KushkiError.ts";
import { PathEnum } from "infrastructure/PathEnum.ts";
import {
  DestroyKushkiHostedFields,
  KushkiHostedFields
} from "libs/zoid/HostedField.ts";
import { UtilsProvider } from "provider/UtilsProvider.ts";
import { ICardSubscriptions } from "repository/ICardSubscriptions.ts";
import { IKushki } from "repository/IKushki.ts";
import { CardService } from "service/CardService.ts";
import { FieldOptions } from "src/interfaces/FieldOptions.ts";
import { CardFieldValues } from "types/card_fields_values";
import { Field, Styles } from "types/card_options";
import { CardTokenResponse } from "types/card_token_response";
import { DeviceTokenRequest } from "types/device_token_request";
import {
  FieldTypeEnum,
  FieldValidity,
  FormValidity
} from "types/form_validity";
import { SecureDeviceTokenOptions } from "types/secure_device_token_request";
import { TokenResponse } from "types/token_response";
import { buildCssStyle } from "utils/BuildCssStyle.ts";
import {
  addEventListener,
  buildCustomHeaders,
  buildFieldsValidity,
  dispatchCustomEvent,
  focusField,
  hideContainers,
  renderFields,
  resetField,
  showContainers,
  updateValidity,
  validateInitParams
} from "utils/HostedFieldsUtils.ts";

export class CardSubscriptions implements ICardSubscriptions {
  private readonly kushkiInstance: IKushki;
  private readonly options: SecureDeviceTokenOptions;
  private inputValues: CardFieldValues;

  private constructor(
    kushkiInstance: IKushki,
    options: SecureDeviceTokenOptions
  ) {
    this.kushkiInstance = kushkiInstance;
    this.options = options;
    this.inputValues = {};
  }

  public getInputs(): CardFieldValues {
    return this.inputValues;
  }

  public static async initSecureDeviceToken(
    kushkiInstance: IKushki,
    options: SecureDeviceTokenOptions
  ): Promise<CardSubscriptions> {
    validateInitParams(
      kushkiInstance,
      options,
      FieldsMethodTypesEnum.DEVICE_TOKEN
    );

    const payment: CardSubscriptions = new CardSubscriptions(
      kushkiInstance,
      options
    );

    payment.initCvvField(options.fields.cvv, options.styles);

    hideContainers(payment.getInputs());
    await renderFields(payment.getInputs());
    showContainers(payment.getInputs());

    return payment;
  }

  public async requestDeviceToken(): Promise<TokenResponse> {
    try {
      const isFormValid =
        await this.inputValues.cvv!.hostedField!.requestFormValidity();

      if (!isFormValid) {
        throw new KushkiError(ERRORS.E007);
      }

      const cardService = new CardService(this.kushkiInstance);

      const requestTokenBody: DeviceTokenRequest =
        await cardService.createDeviceTokenRequestBody(this.options.body);

      const tokenResponse: CardTokenResponse =
        await this.inputValues.cvv!.hostedField!.requestSecureDeviceToken(
          this.kushkiInstance,
          requestTokenBody,
          `${PathEnum.device_token}${requestTokenBody.subscriptionId}/tokens`,
          buildCustomHeaders()
        );

      return cardService.validateToken(tokenResponse);
    } catch (error) {
      return await UtilsProvider.validErrors(error, ERRORS.E002);
    }
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

  public onFieldValidity(
    event: (fieldEvent: FormValidity | FieldValidity) => void,
    fieldType?: FieldTypeEnum
  ): void {
    addEventListener(FieldEventsEnum.VALIDITY, event, fieldType);
  }

  public getFormValidity(): FormValidity {
    return buildFieldsValidity(this.inputValues);
  }

  public focus(): Promise<void> {
    return focusField(this.inputValues, InputModelEnum.CVV);
  }

  public reset(): Promise<void> {
    return resetField(this.inputValues, InputModelEnum.CVV);
  }

  private handleOnValidity(
    field: InputModelEnum,
    fieldValidity: FieldValidity
  ) {
    this.inputValues = updateValidity(this.inputValues, field, fieldValidity);

    dispatchCustomEvent(this.inputValues, FieldEventsEnum.VALIDITY, field);
  }

  private buildCvvOptions(field: Field, styles?: Styles) {
    const options: FieldOptions = {
      ...field,
      fieldType: InputModelEnum.SUBSCRIPTIONS_CVV,
      handleOnBlur: (field: string) =>
        dispatchCustomEvent(this.inputValues, FieldEventsEnum.BLUR, field),
      handleOnFocus: (field: string) =>
        dispatchCustomEvent(this.inputValues, FieldEventsEnum.FOCUS, field),
      handleOnSubmit: (field: string) =>
        dispatchCustomEvent(this.inputValues, FieldEventsEnum.SUBMIT, field),
      handleOnValidity: (field: InputModelEnum, fieldValidity: FieldValidity) =>
        this.handleOnValidity(field, fieldValidity),
      isInTest: this.kushkiInstance.isInTest(),
      styles: buildCssStyle(styles || {})
    };

    return options;
  }

  private initCvvField(cvvField: Field, styles?: Styles) {
    DestroyKushkiHostedFields();
    const options: FieldOptions = this.buildCvvOptions(cvvField, styles);
    const hostedField = KushkiHostedFields(options);

    this.inputValues.cvv = {
      hostedField,
      selector: cvvField.selector,
      validity: {
        isValid: false
      }
    };
  }
}
