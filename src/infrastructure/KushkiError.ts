/**
 * Generic Error Class resolver
 */
import { ErrorCode } from "infrastructure/ErrorEnum";

export type KushkiErrorAttr<T extends string = ErrorCode> = {
  code: T;
  message: string;
};

export type KushkiErrors<T extends string = ErrorCode> = {
  [k in T]: KushkiErrorAttr<T>;
};

/**
 * KushkiError Generic captured error.
 */
export class KushkiError extends Error {
  public readonly code: string;
  public readonly message: string;
  public readonly detail: string | null;

  constructor(error: KushkiErrorAttr, detail: string | null = null) {
    /* istanbul ignore next: TODO: reporter is failing */ super(error.code);

    this.code = error.code;
    this.message = error.message;
    this.detail = detail;
    Object.setPrototypeOf(this, KushkiError.prototype);
  }
}
