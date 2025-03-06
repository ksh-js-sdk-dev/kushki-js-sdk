import { KushkiGateway } from "gateway/KushkiGateway.ts";
import { ERRORS } from "infrastructure/ErrorEnum.ts";
import {
  FieldEventsEnum,
  FieldsMethodTypesEnum
} from "infrastructure/FieldEventsEnum.ts";
import { InputModelEnum } from "infrastructure/InputModel.enum.ts";
import { KushkiError } from "infrastructure/KushkiError.ts";
import {
  DestroyKushkiHostedFields,
  KushkiHostedFields
} from "libs/zoid/HostedField.ts";
import { UtilsProvider } from "provider/UtilsProvider.ts";
import { ICardPayouts } from "repository/ICardPayouts.ts";
import { IKushki } from "repository/IKushki.ts";
import { IKushkiGateway } from "repository/IKushkiGateway.ts";
import { FieldOptions } from "src/interfaces/FieldOptions.ts";
import { BinInfoResponse } from "types/bin_info_response";
import { CardFieldValues } from "types/card_fields_values";
import { CardPayoutOptions, Field, Styles } from "types/card_payout_options";
import {
  FieldTypeEnum,
  FieldValidity,
  FormValidity
} from "types/form_validity";
import { CardPayoutTokenResponse } from "types/card_payout_token_response";
import { buildCssStyle } from "utils/BuildCssStyle.ts";
import {
  addEventListener,
  buildCustomHeaders,
  buildFieldsValidity,
  dispatchCustomEvent,
  focusField,
  getInitialFieldValidation,
  hideContainers,
  renderFields,
  resetField,
  showContainers,
  updateValidity,
  validateInitParams
} from "utils/HostedFieldsUtils.ts";

export class CardPayouts implements ICardPayouts {
  private readonly kushkiInstance: IKushki;
  private readonly options: CardPayoutOptions;
  private readonly _gateway: IKushkiGateway;
  private inputValues: CardFieldValues;
  private firstHostedFieldType: string;
  private currentBin: string;

  private constructor(kushkiInstance: IKushki, options: CardPayoutOptions) {
    this.kushkiInstance = kushkiInstance;
    this.options = options;
    this._gateway = new KushkiGateway();
    this.inputValues = {};
    this.firstHostedFieldType = "";
    this.currentBin = "";
  }

  public getInputs(): CardFieldValues {
    return this.inputValues;
  }

  public static async initCardPayoutToken(
    kushkiInstance: IKushki,
    options: CardPayoutOptions
  ): Promise<CardPayouts> {
    validateInitParams(
      kushkiInstance,
      options,
      FieldsMethodTypesEnum.CARD_PAYOUT_TOKEN
    );

    const payment: CardPayouts = new CardPayouts(kushkiInstance, options);

    await payment.initFields(options.fields, options.styles);

    showContainers(payment.getInputs());

    return payment;
  }

  public async requestCardPayoutToken(): Promise<CardPayoutTokenResponse> {
    try {
      const isFormValid: boolean = await this.inputValues[
        this.firstHostedFieldType
      ].hostedField.requestFormValidity();

      if (!isFormValid) {
        throw new KushkiError(ERRORS.E007);
      }

      const headers = buildCustomHeaders();

      return await this.inputValues[
        this.firstHostedFieldType
      ].hostedField.requestCardPayoutToken(
        this.kushkiInstance,
        headers,
        this.options.paymentType
      );
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

  public getFormValidity(): FormValidity {
    return buildFieldsValidity(this.inputValues);
  }

  private initFields(
    optionsFields: { [k: string]: Field },
    styles?: Styles
  ): Promise<void[]> {
    DestroyKushkiHostedFields();

    for (const fieldKey in optionsFields) {
      const field: Field = optionsFields[fieldKey];
      const options: FieldOptions = this.buildFieldOptions(
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
          isValid: getInitialFieldValidation(options)
        }
      };
    }

    hideContainers(this.inputValues);

    return renderFields(this.inputValues);
  }

  private handleOnValidity(
    field: InputModelEnum,
    fieldValidity: FieldValidity
  ): void {
    this.inputValues = updateValidity(this.inputValues, field, fieldValidity);

    dispatchCustomEvent(this.inputValues, FieldEventsEnum.VALIDITY, field);
  }

  private async handleOnBinChange(bin: string): Promise<void> {
    const updateHostedFieldBrand = (brandIcon: string) => {
      this.inputValues.cardNumber?.hostedField?.updateProps({
        brandIcon
      });
    };
    const clearHostedFieldBrand = () => {
      updateHostedFieldBrand("");
      this.currentBin = "";
    };

    if (!bin) {
      clearHostedFieldBrand();

      return;
    }

    if (this.currentBin !== bin) {
      this.currentBin = bin;
      try {
        const { brand }: BinInfoResponse = await this._gateway.requestBinInfo(
          this.kushkiInstance,
          {
            bin
          }
        );

        updateHostedFieldBrand(brand);
      } catch (error) {
        clearHostedFieldBrand();
      }
    }
  }

  private buildFieldOptions(
    field: Field,
    fieldType: InputModelEnum,
    styles?: Styles
  ): FieldOptions {
    return {
      ...field,
      fields: this.options.fields,
      fieldType,
      handleOnBinChange: (bin: string) => this.handleOnBinChange(bin),
      handleOnBlur: (field: string) =>
        dispatchCustomEvent(this.inputValues, FieldEventsEnum.BLUR, field),
      handleOnFocus: (field: string) =>
        dispatchCustomEvent(this.inputValues, FieldEventsEnum.FOCUS, field),
      handleOnSubmit: (field: string) =>
        dispatchCustomEvent(this.inputValues, FieldEventsEnum.SUBMIT, field),
      handleOnValidity: (field: InputModelEnum, fieldValidity: FieldValidity) =>
        this.handleOnValidity(field, fieldValidity),
      isInTest: this.kushkiInstance.isInTest(),
      styles: buildCssStyle(styles || {}),
      tokenProcessType: FieldsMethodTypesEnum.CARD_PAYOUT_TOKEN
    };
  }
}
