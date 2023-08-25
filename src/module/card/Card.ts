import KushkiHostedFields from "../zoid.ts";
import { CardOptions, Field, Kushki, TokenResponse } from "Kushki";
import { ICard } from "../repository/ICard.ts";

export class Card implements ICard {
  private readonly options: CardOptions;
  private readonly kushkiInstance: Kushki;

  private constructor(kushkiInstance: Kushki, options: CardOptions) {
    this.options = this.setDefaultValues(options);
    this.kushkiInstance = kushkiInstance;
  }

  public static initCardToken(
    kushkiInstance: Kushki,
    options: CardOptions
  ): Promise<Card> {
    const card: Card = new Card(kushkiInstance, options);

    return new Promise<Card>((resolve) => {
      this.renderFields(options.fields);
      resolve(card);
    });
  }

  public requestToken(): Promise<TokenResponse> {
    // TODO: remove this console log after to implementation
    console.log(this.options, this.kushkiInstance);

    return Promise.resolve({ token: "replace by token response" });
  }

  private setDefaultValues(options: CardOptions): CardOptions {
    return {
      ...options,
      isSubscription: Boolean(options.isSubscription)
    };
  }

  private static renderFields = (optionsFields: {
    [k: string]: Field;
  }): void => {
    for (const field in optionsFields) {
      KushkiHostedFields(optionsFields[field]).render(
        `#${optionsFields[field].selector}`
      );
    }
  };
}
