import { IkushkiFieldsInstance } from "../repository/IkushkiFieldsInstance.tsx";
import { TokenResponse } from "../../types/remote/token_response";
import { KushkiFieldsOptions } from "../../types/kushki_fields_options";
import { EnvironmentEnum } from "../infrastructure/EnvironmentEnum.ts";

export class kushkiFieldsInstance implements IkushkiFieldsInstance {
  readonly baseUrl: EnvironmentEnum;
  readonly options: KushkiFieldsOptions;

  constructor(baseUrl: EnvironmentEnum, options: KushkiFieldsOptions) {
    this.baseUrl = baseUrl;
    this.options = options;
  }

  requestToken(): Promise<TokenResponse> {
    // TODO: remove this console log after to implementation
    console.log(this.baseUrl, this.options);

    return Promise.resolve({ token: "replace by token response" });
  }
}
