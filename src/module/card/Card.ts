import KushkiHostedFields from "libs/HostedField.ts";
import { Kushki } from "Kushki";
import {
  CardFieldValues,
  CardOptions,
  CardTokenRequest,
  Field,
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

export class Card implements ICard {
  private readonly options: CardOptions;
  private readonly kushkiInstance: Kushki;
  private inputValues: CardFieldValues;
  private currentBin: string;
  private readonly _gateway: IKushkiGateway;

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

  public requestToken(): Promise<TokenResponse> {
    if (this.options.isSubscription)
      return this._gateway.requestCreateSubscriptionToken(
        this.kushkiInstance,
        this.buildTokenBody()
      );
    else
      return this._gateway.requestToken(
        this.kushkiInstance,
        this.buildTokenBody()
      );
  }

  private buildTokenBody(): CardTokenRequest {
    const { cardholderName, cardNumber, expirationDate, cvv } =
      this.inputValues;
    const { currency } = this.options;

    return {
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
      const field = optionsFields[fieldKey];
      const options = {
        ...field,
        handleOnChange: (field: string, value: string) => {
          return this.handleOnChange(field, value);
        },
        handleOnFocus: (field: string, value: string) =>
          this.handleOnFocus(field, value),
        handleOnBlur: (field: string, value: string) =>
          this.handleOnBlur(field, value)
      };

      const hostedField = KushkiHostedFields(options);

      this.inputValues[field.fieldType] = {
        hostedField,
        selector: field.selector
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
}
