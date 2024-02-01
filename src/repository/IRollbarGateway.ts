import { KushkiOptions } from "types/kushki_options";

export interface IRollbarGateway {
  init(options: KushkiOptions): void;
  error(message: any): void;
}
