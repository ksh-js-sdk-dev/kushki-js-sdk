import { KushkiOptions } from "Kushki";
import { EnvironmentEnum } from "infrastructure/EnvironmentEnum.ts";
import { SiftScienceEnum } from "infrastructure/SiftScienceEnum.ts";
import { KushkiError } from "infrastructure/KushkiError.ts";
import { ERRORS } from "infrastructure/ErrorEnum.ts";
import { UtilsProvider } from "src/provider/UtilsProvider.ts";
import { IKushki } from "repository/IKushki.ts";

export class Kushki implements IKushki {
  private readonly baseUrl: EnvironmentEnum;
  private readonly publicCredentialId: string;
  private readonly inTest: boolean;
  private readonly environmentSift: string;

  constructor(options: KushkiOptions) {
    this.publicCredentialId = options.publicCredentialId;
    this.baseUrl = this._initBaseUrl(options.inTest);
    this.inTest = !!options.inTest;
    this.environmentSift = this._initEnvironmentSift(options.inTest);
  }

  public static async init(options: KushkiOptions): Promise<Kushki> {
    try {
      const kushki: Kushki = new Kushki(options);

      this._validParamsKushkiOptions(options);

      return Promise.resolve(kushki);
    } catch (e) {
      return UtilsProvider.validErrors(e, ERRORS.E011);
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

  public isInTest(): boolean {
    return this.inTest;
  }

  private _initBaseUrl(inTest?: boolean): EnvironmentEnum {
    return inTest ? EnvironmentEnum.uat : EnvironmentEnum.prod;
  }

  private _initEnvironmentSift(inTest?: boolean): SiftScienceEnum {
    return inTest ? SiftScienceEnum.uat : SiftScienceEnum.prod;
  }

  private static _validParamsKushkiOptions(options: KushkiOptions): void {
    const isUndefinedPublicCredential: boolean =
      typeof options.publicCredentialId === "undefined";

    if (isUndefinedPublicCredential) {
      throw new KushkiError(ERRORS.E011);
    }
  }
}
