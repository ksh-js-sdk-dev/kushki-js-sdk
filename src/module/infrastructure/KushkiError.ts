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
  private readonly _customMessage: string | null;
  private readonly _error: KushkiErrorAttr;

  constructor(error: KushkiErrorAttr, message: string | null = null) {
    const prefix: string = "K";
    const code: string = `${prefix}${error.code.replace("E", "")}`;

    /* istanbul ignore next: TODO: reporter is failing */ super(code);

    this.code = code;
    this._customMessage = message;
    this._error = error;
    Object.setPrototypeOf(this, KushkiError.prototype);
  }

  public getMessage(): string | null {
    if (this._customMessage !== null) return this._customMessage;

    return this._error.message;
  }
}
