import KushkiHostedFields from "../libs/HostedField.ts";
import {CardOptions, Field, Kushki, CardFieldValues, TokenResponse} from "Kushki";
import { ICard } from "../repository/ICard.ts";

export class Card implements ICard {
  private readonly options: CardOptions;
  private readonly kushkiInstance: Kushki;
  private inputValues:  CardFieldValues;

  private constructor(kushkiInstance: Kushki, options: CardOptions) {
    this.options = this.setDefaultValues(options);
    this.kushkiInstance = kushkiInstance;
    this.inputValues = {};
    this.renderFields(options.fields);
  }

  public static initCardToken(
    kushkiInstance: Kushki,
    options: CardOptions
  ): Promise<Card> {
    const card: Card = new Card(kushkiInstance, options);

    return new Promise<Card>((resolve) => {
      resolve(card);
    });
  }

  public requestToken(): Promise<TokenResponse> {
    // TODO: remove this console log after to implementation
    console.log(this.options, this.kushkiInstance);

    return Promise.resolve({ token: "replace by token response", request: this.inputValues });
  }

  private setDefaultValues(options: CardOptions): CardOptions {
    return {
      ...options,
      isSubscription: Boolean(options.isSubscription)
    };
  }

  private handleOnChange(field: string, value: string){
    this.inputValues = {...this.inputValues, [field]: value };
  }

  private renderFields = (optionsFields: {
    [k: string]: Field;
  }): void => {
    for (const field in optionsFields) {
      const options = { ...optionsFields[field],
        onChange: (field: string, value: string) => this.handleOnChange(field, value),
        handleOnFocus: typeof optionsFields[field].onFocus === "function" ?  optionsFields[field].onFocus : undefined
      }

      KushkiHostedFields(options).render(
          `#${optionsFields[field].selector}`
      );
    }
  };
}
