import { IRollbarGateway } from "repository/IRollbarGateway.ts";
import Rollbar from "rollbar";
import { injectable } from "inversify";
import { EnvironmentEnum } from "infrastructure/EnvironmentEnum.ts";
import { TypeEnvironmentEnum } from "infrastructure/TypeEnvironmentEnum.ts";
import { version } from "libs/genversion/version";
import { KushkiOptions } from "types/kushki_options";

@injectable()
export class RollbarGateway implements IRollbarGateway {
  private rollbar!: Rollbar;

  public init(options: KushkiOptions): void {
    const environment: TypeEnvironmentEnum = this.getEnvironment(options);
    const rollbar: Rollbar = new Rollbar({
      accessToken: EnvironmentEnum.rollbarId,
      addErrorContext: true,
      autoInstrument: true,
      captureUncaught: true,
      captureUnhandledRejections: true,
      environment,
      payload: {
        client: {
          javascript: {
            code_version: version,
            source_map_enabled: true
          }
        },
        environment: TypeEnvironmentEnum.uat
      }
    });

    rollbar.configure({
      payload: {
        custom: options,
        merchant: {
          publicCredentialId: options.publicCredentialId
        }
      }
    });

    this.rollbar = rollbar;
  }

  private getEnvironment(options: KushkiOptions): TypeEnvironmentEnum {
    return options.inTest
      ? TypeEnvironmentEnum.uat
      : TypeEnvironmentEnum.primary;
  }

  error(message: any): void {
    this.rollbar.error(message);
  }
}
