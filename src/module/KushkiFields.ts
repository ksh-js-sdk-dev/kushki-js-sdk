import { EnvironmentEnum } from "./infrastructure/EnvironmentEnum.ts";
import KushkiHostedFields from "./zoid.ts";
import { Field, KushkiFieldsOptions } from "KFields";

export class KushkiFields {
  readonly baseUrl: EnvironmentEnum;
  readonly options: KushkiFieldsOptions;

  private constructor(options: KushkiFieldsOptions) {
    this.baseUrl = this.getBaseUrl(options.inTest);
    this.options = this.setDefaultValues(options);
  }

  public static init(options: KushkiFieldsOptions): Promise<KushkiFields> {
    const kushkiFields: KushkiFields = new KushkiFields(options);

    return new Promise<KushkiFields>((resolve) => {
      this.renderFields(options.fields);
      resolve(kushkiFields);
    });
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
    for (const field in optionsFields) {
      KushkiHostedFields(optionsFields[field]).render(
        `#${optionsFields[field].selector}`
      );
    }
  };
}
