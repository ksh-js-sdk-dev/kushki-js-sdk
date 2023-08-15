import { KushkiFieldsOptions } from "../../../types/kushki_fields_options";
import { EnvironmentEnum } from "../../infrastructure/EnvironmentEnum.ts";
import { TokenResponse } from "../../../types/remote/token_response";
import { IKushkiFields } from "../../repository/IKushkiFields.tsx";

export class KushkiFields implements IKushkiFields {
  readonly baseUrl: EnvironmentEnum;
  private _options: KushkiFieldsOptions;

  private constructor(options: KushkiFieldsOptions) {
    this.baseUrl = this.getBaseUrl(options.inTest);
    this._options = this.setDefaultValues(options);
  }

  public static init(options: KushkiFieldsOptions): Promise<KushkiFields> {
    const kushkiFields = new KushkiFields(options);

    return new Promise<KushkiFields>((resolve) => {
      // TODO: execute render method and then finish the promise with resolve or reject
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
}
