import { InputModelEnum } from "../../../../src/infrastructure/InputModel.enum.ts";
import { ErrorTypeEnum } from "../../../../src/infrastructure/ErrorTypeEnum.ts";

export enum ErrorLabelsSpanishEnum {
  CARDHOLDER_NAME_REQUIRED = "Nombre del tarjeta habiente es requerido",
  CARD_NUMBER_REQUIRED = "Número de tarjeta es un campo requerido",
  EXPIRATION_DATE_REQUIRED = "Fecha de vencimiento es requerido",
  CVV_REQUIRED = "El campo CVV es requerido",
  CARDHOLDER_NAME_INVALID = "Nombre del tarjeta habiente es inválido",
  CARD_NUMBER_INVALID = "Verifique los dígitos ingresados en su tarjeta",
  EXPIRATION_DATE_INVALID = "El formato es incorrecto",
  CVV_INVALID = "El código es incorrecto",
  DEFERRED_TYPE_REQUERED = "El tipo de diferido es requerido",
  DEFERRED_MONTHS_REQUERED = "La cantidad de meses son requeridos"
}

export const fieldsErrorEmpty: Record<string, string> = {
  [InputModelEnum.CARDHOLDER_NAME]:
    ErrorLabelsSpanishEnum.CARDHOLDER_NAME_REQUIRED,
  [InputModelEnum.CARD_NUMBER]: ErrorLabelsSpanishEnum.CARD_NUMBER_REQUIRED,
  [InputModelEnum.EXPIRATION_DATE]:
    ErrorLabelsSpanishEnum.EXPIRATION_DATE_REQUIRED,
  [InputModelEnum.CVV]: ErrorLabelsSpanishEnum.CVV_REQUIRED
};

export const fieldsErrorInvalid: Record<string, string> = {
  [InputModelEnum.CARDHOLDER_NAME]:
    ErrorLabelsSpanishEnum.CARDHOLDER_NAME_INVALID,
  [InputModelEnum.CARD_NUMBER]: ErrorLabelsSpanishEnum.CARD_NUMBER_INVALID,
  [InputModelEnum.EXPIRATION_DATE]:
    ErrorLabelsSpanishEnum.EXPIRATION_DATE_INVALID,
  [InputModelEnum.CVV]: ErrorLabelsSpanishEnum.CVV_INVALID
};

export const deferredErrors: Record<string, string> = {
  [ErrorTypeEnum.DEFERRED_TYPE_REQUERED]:
    ErrorLabelsSpanishEnum.DEFERRED_TYPE_REQUERED,
  [ErrorTypeEnum.DEFERRED_MONTHS_REQUERED]:
    ErrorLabelsSpanishEnum.DEFERRED_MONTHS_REQUERED
};
