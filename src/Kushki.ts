import { KushkiOptions } from "Kushki";
import { EnvironmentEnum } from "infrastructure/EnvironmentEnum.ts";

export class Kushki {
  private readonly baseUrl: EnvironmentEnum;
  private readonly publicCredentialId: string;
  private readonly environment: string;
  constructor(options: KushkiOptions) {
    this.publicCredentialId = options.publicCredentialId;
    this.baseUrl = this.initBaseUrl(options.inTest);
    this.environment = options.inTest ? "uat" : "prod";
  }

  public static init(options: KushkiOptions): Promise<Kushki> {
    const kushki: Kushki = new Kushki(options);

    return new Promise<Kushki>((resolve) => {
      resolve(kushki);
    });
  }

  public getBaseUrl(): EnvironmentEnum {
    return this.baseUrl;
  }

  public getPublicCredentialId(): string {
    return this.publicCredentialId;
  }

  public getEnvironment(): string {
    return this.environment;
  }

  private initBaseUrl(inTest?: boolean): EnvironmentEnum {
    return inTest ? EnvironmentEnum.uat : EnvironmentEnum.prod;
  }
}
