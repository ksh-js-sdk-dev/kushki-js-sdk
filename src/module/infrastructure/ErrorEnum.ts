/**
 * ErrorEnum
 */
import { KushkiErrors } from "./KushkiError";

export enum ErrorCode {
  E001 = "E001"
}

export const ERRORS: KushkiErrors = {
  [ErrorCode.E001]: {
    code: ErrorCode.E001,
    message: "Error en solicitud de bin"
  }
};
