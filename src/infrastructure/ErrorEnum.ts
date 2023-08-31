/**
 * ErrorEnum
 */
import { KushkiErrors } from "infrastructure/KushkiError.ts";

export enum ErrorCode {
  E001 = "E001"
}

export const ERRORS: KushkiErrors = {
  [ErrorCode.E001]: {
    code: ErrorCode.E001,
    message: "Error en solicitud de bin"
  }
};
