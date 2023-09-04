import KushkiHostedFields from "libs/HostedField.ts";
import { Kushki, TokenResponse } from "Kushki";
import {
  CardFieldValues,
  CardOptions,
  CardTokenRequest,
  Field
} from "module/card";
import { ICard } from "repository/ICard.ts";
import { InputModelEnum } from "infrastructure/InputModel.enum.ts";
import {
  requestBinInfo,
  requestCreateSubscriptionToken,
  requestToken
} from "gateway/KushkiGateway.ts";
import { FieldInstance } from "types/card_fields_values";

export class Card implements ICard {
  private readonly options: CardOptions;
  private readonly kushkiInstance: Kushki;
  private inputValues: CardFieldValues;
  private currentBin: string;

  private constructor(kushkiInstance: Kushki, options: CardOptions) {
    this.options = this.setDefaultValues(options);
    this.kushkiInstance = kushkiInstance;
    this.inputValues = {};
    this.currentBin = "";
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
    let token: TokenResponse;

    if (this.options.isSubscription) {
      token = await requestCreateSubscriptionToken(
        this.kushkiInstance,
        this.buildTokenBody()
      );
    } else {
      token = await requestToken(this.kushkiInstance, this.buildTokenBody());
    }

    return Promise.resolve(token);
  }

  private buildTokenBody(): CardTokenRequest {
    return {
      card: {
        name: this.inputValues[InputModelEnum.CARDHOLDER_NAME]!.value!,
        number: this.inputValues[InputModelEnum.CARD_NUMBER]!.value!.replace(
          /\s+/g,
          ""
        ),
        expiryMonth:
          this.inputValues[InputModelEnum.EXPIRATION_DATE]?.value?.split(
            "/"
          )[0]!,
        expiryYear:
          this.inputValues[InputModelEnum.EXPIRATION_DATE]?.value?.split(
            "/"
          )[1]!,
        cvv: this.inputValues[InputModelEnum.CVV]!.value
      },
      currency: this.options.amount?.currency,
      totalAmount:
        this.options.amount?.subtotalIva0! +
        this.options.amount?.subtotalIva! +
        this.options.amount?.iva!
    };
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
      this.onChangeCardNumber(field, value);
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
        const { brand } = await requestBinInfo(this.kushkiInstance, {
          bin: newBin
        });

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

  private onChangeCardNumber(field: string, value: string) {
    if (field !== InputModelEnum.CARD_NUMBER) return;

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
