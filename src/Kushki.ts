export * from "./index.ts";

import { KushkiOptions } from "Kushki";
import { EnvironmentEnum } from "infrastructure/EnvironmentEnum.ts";
import { SiftScienceEnum } from "infrastructure/SiftScienceEnum";
import { KushkiError } from "infrastructure/KushkiError.ts";
import { ERRORS } from "infrastructure/ErrorEnum.ts";
import { UtilsService } from "service/UtilService.ts";

export class Kushki {
  private readonly baseUrl: EnvironmentEnum;
  private readonly publicCredentialId: string;
  private readonly inTest: boolean | undefined;
  private readonly environmentSift: string;
  constructor(options: KushkiOptions) {
    this.publicCredentialId = options.publicCredentialId;
    this.baseUrl = this.initBaseUrl(options.inTest);
    this.inTest = options.inTest;
    this.environmentSift = this.initEnvironmentSift(options.inTest);
  }

  public static async init(options: KushkiOptions): Promise<Kushki> {
    try {
      const kushki: Kushki = new Kushki(options);

      this.validParamsKushkiOptions(options);

      return Promise.resolve(kushki);
    } catch (e) {
      return UtilsService.validErrors(e, ERRORS.E011);
    }
  }

  public getBaseUrl(): EnvironmentEnum {
    return this.baseUrl;
  }

  public getPublicCredentialId(): string {
    return this.publicCredentialId;
  }

  public getEnvironmentSift(): string {
    return this.environmentSift;
  }

  public isInTest(): boolean | undefined {
    return this.inTest;
  }

  private initBaseUrl(inTest?: boolean): EnvironmentEnum {
    return inTest ? EnvironmentEnum.uat : EnvironmentEnum.prod;
  }

  private initEnvironmentSift(inTest?: boolean): SiftScienceEnum {
    return inTest ? SiftScienceEnum.uat : SiftScienceEnum.prod;
  }

  private static validParamsKushkiOptions(options: KushkiOptions): void {
    const isUndefinedPublicCredential: boolean =
      typeof options.publicCredentialId === "undefined";

    if (isUndefinedPublicCredential) {
      throw new KushkiError(ERRORS.E011);
    }
  }
}
