import {
  Field,
  KushkiFieldsOptions
} from "../../../types/kushki_fields_options";
import { EnvironmentEnum } from "../../infrastructure/EnvironmentEnum.ts";
import { TokenResponse } from "../../../types/remote/token_response";
import { IKushkiFields } from "../../repository/IKushkiFields.tsx";
import KushkiHostedFields from "../zoid.ts";

export class KushkiFields implements IKushkiFields {
  readonly baseUrl: EnvironmentEnum;
  private _options: KushkiFieldsOptions;

  private constructor(options: KushkiFieldsOptions) {
    this.baseUrl = this.getBaseUrl(options.inTest);
    this._options = this.setDefaultValues(options);
  }

  public static init(options: KushkiFieldsOptions): Promise<KushkiFields> {
    const kushkiFields: KushkiFields = new KushkiFields(options);

    return new Promise<KushkiFields>((resolve) => {
      this.renderFields(options.fields);
      resolve(kushkiFields);
    });
  }

  public requestToken(): Promise<TokenResponse> {
    // TODO: remove this console log after to implementation
    console.log(this.baseUrl, this._options);

    return Promise.resolve({ token: "replace by token response" });
  }

  private getBaseUrl(inTest?: boolean): EnvironmentEnum {
    return inTest ? EnvironmentEnum.uat : EnvironmentEnum.prod;
  }

  private setDefaultValues(options: KushkiFieldsOptions): KushkiFieldsOptions {
    return {
      ...options,
      inTest: Boolean(options.inTest),
      isSubscription: Boolean(options.isSubscription)
    };
  }

  private static renderFields = (optionsFields: {
    [k: string]: Field;
  }): void => {
    const hostedFields: string[] = Object.entries(optionsFields).map(
      (field: [string, Field]) => {
        return field[1].selector;
      }
    );

    hostedFields.forEach((i: string): void => {
      KushkiHostedFields({}).render(`#${i}`);
    });
  };
}
