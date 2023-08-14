import { KushkiFieldsOptions } from "../../types/kushki_fields_options";
import { EnvironmentEnum } from "../infrastructure/EnvironmentEnum.ts";
import { IkushkiFieldsInstance } from "../repository/IkushkiFieldsInstance.tsx";
import { kushkiFieldsInstance } from "../service/kushkiFieldsInstance.tsx";

export class KushkiFields {
  kushkiFieldsInstance: IkushkiFieldsInstance;

  private constructor(options: KushkiFieldsOptions) {
    const _baseUrl = this.getBaseUrl(options.inTest);
    const _options = this.setDefaultValues(options);

    this.kushkiFieldsInstance = new kushkiFieldsInstance(_baseUrl, _options);
    // TODO: execute render method
  }

  public static init(options: KushkiFieldsOptions) {
    const kushkiFields = new KushkiFields(options);

    return kushkiFields.kushkiFieldsInstance;
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
