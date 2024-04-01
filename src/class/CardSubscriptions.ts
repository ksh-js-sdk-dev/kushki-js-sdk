import { IKushki } from "repository/IKushki.ts";
import { Field, Styles } from "types/card_options";
import { InputModelEnum } from "infrastructure/InputModel.enum.ts";
import { FieldOptions } from "src/interfaces/FieldOptions.ts";
import { buildCssStyle } from "utils/BuildCssStyle.ts";
import KushkiHostedFields from "libs/zoid/HostedField.ts";
import { CardFieldValues, FieldInstance } from "types/card_fields_values";

export class CardSubscriptions {
  private readonly kushkiInstance: IKushki;
  private inputValues: CardFieldValues;

  private constructor(kushkiInstance: IKushki) {
    this.kushkiInstance = kushkiInstance;
    this.inputValues = {};
  }

  public static async initSecureDeviceToken(
    kushkiInstance: IKushki,
    optionFields: Field
  ): Promise<CardSubscriptions> {
    const payment: CardSubscriptions = new CardSubscriptions(kushkiInstance);
    payment.initFields(optionFields);
    await payment.renderFields();

    return payment;
  }

  private printEvent(field: string, event: string) {
    console.log(field, event);
  }

  private buildFieldOptions(
    field: Field,
    styles?: Styles
  ) {
    const options: FieldOptions = {
      ...field,
      fieldType: InputModelEnum.SUBSCRIPTIONS_CVV,
      handleOnBlur: (field: string) => this.printEvent(field, "blur"),
      handleOnFocus: (field: string) => this.printEvent(field, "focus"),
      handleOnSubmit: (field: string) => this.printEvent(field, "submit"),
      styles: buildCssStyle(styles || {})
    };

    return options;
  }

  private initFields(optionFields: Field, styles?: Styles) {
    const options: FieldOptions = this.buildFieldOptions(optionFields, styles);
    const hostedField = KushkiHostedFields(options);

    this.inputValues.cvv = {
      hostedField,
      selector: optionFields.selector,
      validity: {
        isValid: false
      }
    };
  }

  private renderFields = async (): Promise<void[]> => {
    return Promise.all(
      Object.values<FieldInstance>(this.inputValues).map(
        (field) =>
          field!.hostedField?.render(`#${field!.selector}`) as Promise<void>
      )
    );
  };
}
