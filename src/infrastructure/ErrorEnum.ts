/**
 * ErrorEnum
 */
import { KushkiErrors } from "infrastructure/KushkiError.ts";

export enum ErrorCode {
  E001 = "E001",
  E002 = "E002"
}

export const ERRORS: KushkiErrors = {
  [ErrorCode.E001]: {
    code: ErrorCode.E001,
    message: "Error en solicitud de bin"
  },
  [ErrorCode.E002]: {
    code: ErrorCode.E002,
    message: "Error en solicitud de token"
  }
};
