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
  E012 = "E012",
  E013 = "E013",
  E014 = "E014",
  E015 = "E015",
  E016 = "E016",
  E017 = "E017",
  E018 = "E018",
  E019 = "E019"
}

/**
 * Errors List of SDK
 * @readonly
 * ```
 * export const ERRORS = {
 *   E001: {
 *     code: "E001",
 *     message: "Error en solicitud de bin"
 *   },
 *   E002: {
 *     code: "E002",
 *     message: "Error en solicitud de token"
 *   },
 *   E003: {
 *     code: "E003",
 *     message: "Error en solicitud de datos del comercio"
 *   },
 *   E004: {
 *     code: "E004",
 *     message: "Error en solicitud de JWT"
 *   },
 *   E005: {
 *     code: "E005",
 *     message: "Campos 3DS inválidos"
 *   },
 *   E006: {
 *     code: "E006",
 *     message: "Error en solicitud de validación de token"
 *   },
 *   E007: {
 *     code: "E007",
 *     message: "Error en la validación del formulario"
 *   },
 *   E008: {
 *     code: "E008",
 *     message: "Error en la validación de OTP"
 *   },
 *   E009: {
 *     code: "E009",
 *     message: "Error al limpiar el campo"
 *   },
 *   E010: {
 *     code: "E010",
 *     message: "Error al realizar focus en el campo"
 *   },
 *   E011: {
 *     code: "E011",
 *     message: "Error en inicializacion de la libreria"
 *   },
 *   E012: {
 *     code: "E012",
 *     message: "Error en inicialización de campos"
 *   },
 *   E013: {
 *     code: "E013",
 *     message: "El Id del contenedor de un input no fue encontrado"
 *   },
 *   E014: {
 *     code: "E014",
 *     message: "Error en solicitud de lista de bancos"
 *   },
 *   E015: {
 *     code: "E015",
 *     message: "Error en solicitud de configuración de comisión"
 *   },
 *   E016: {
 *     code: "E016",
 *     message: "Error en solicitud de UserId para subscripción"
 *   },
 *   E017: {
 *     code: "E017",
 *     message: "Error en solicitud de Token de subscription bajo demanda"
 *   },
 *   E018: {
 *     code: "E018",
 *     message: "Longitud de tarjeta inválida"
 *   },
 *   E019: {
 *     code: "E019",
 *     message: "Comercio no tiene activo 3DS"
 *   }
 * }
 * ```
 * @enum
 */
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
  },
  [ErrorCode.E013]: {
    code: ErrorCode.E013,
    message: "El Id del contenedor de un input no fue encontrado"
  },
  [ErrorCode.E014]: {
    code: ErrorCode.E014,
    message: "Error en solicitud de lista de bancos"
  },
  [ErrorCode.E015]: {
    code: ErrorCode.E015,
    message: "Error en solicitud de configuración de comisión"
  },
  [ErrorCode.E016]: {
    code: ErrorCode.E016,
    message: "Error en solicitud de UserId para subscripción"
  },
  [ErrorCode.E017]: {
    code: ErrorCode.E017,
    message: "Error en solicitud de Token de subscripción bajo demanda"
  },
  [ErrorCode.E018]: {
    code: ErrorCode.E018,
    message: "Longitud de tarjeta inválida"
  },
  [ErrorCode.E019]: {
    code: ErrorCode.E019,
    message: "Comercio no tiene activo 3DS"
  }
};
