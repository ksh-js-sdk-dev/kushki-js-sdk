import { KushkiErrors } from "infrastructure/KushkiError.ts";

/**
 * Enumeration defining error codes for the application.
 * @readonly
 * @enum {string}
 */
export enum ErrorCode {
  E001 = "E001",
  E002 = "E002",
  E003 = "E003",
  E004 = "E004",
  E005 = "E005",
  E006 = "E006",
  E007 = "E007",
  E008 = "E008",
  E009 = "E009",
  E010 = "E010",
  E011 = "E011",
  E012 = "E012"
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
  },
  [ErrorCode.E007]: {
    code: ErrorCode.E007,
    message: "Error en la validación del formulario"
  },
  [ErrorCode.E008]: {
    code: ErrorCode.E008,
    message: "Error en la validación de OTP"
  },
  [ErrorCode.E009]: {
    code: ErrorCode.E009,
    message: "Error al limpiar el campo"
  },
  [ErrorCode.E010]: {
    code: ErrorCode.E010,
    message: "Error al realizar focus en el campo"
  },
  [ErrorCode.E011]: {
    code: ErrorCode.E011,
    message: "Error en inicializacion de la libreria"
  },
  [ErrorCode.E012]: {
    code: ErrorCode.E012,
    message: "Error en inicialización de campos"
  }
};
