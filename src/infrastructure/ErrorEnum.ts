/**
 * ErrorEnum
 */
import { KushkiErrors } from "infrastructure/KushkiError.ts";

export enum ErrorCode {
  E001 = "E001",
  E002 = "E002",
  E003 = "E003",
  E004 = "E004",
  E005 = "E005",
  E006 = "E006"
}

export const ERRORS: KushkiErrors = {
  [ErrorCode.E001]: {
    code: ErrorCode.E001,
    message: "Error en solicitud de bin"
  },
  [ErrorCode.E002]: {
    code: ErrorCode.E002,
    message: "Error en solicitud de token"
  },
  [ErrorCode.E003]: {
    code: ErrorCode.E003,
    message: "Error en solicitud de datos del comercio"
  },
  [ErrorCode.E004]: {
    code: ErrorCode.E004,
    message: "Error en solicitud de JWT"
  },
  [ErrorCode.E005]: {
    code: ErrorCode.E005,
    message: "Campos 3DS inválidos"
  },
  [ErrorCode.E006]: {
    code: ErrorCode.E006,
    message: "Error en solicitud de validación de token"
  }
};
