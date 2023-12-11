export enum CardinalValidationCodeEnum {
  SUCCESS = "SUCCESS",
  FAIL = "FAILURE"
}

export interface ICardinalValidation {
  ActionCode: string;
  Validated: boolean;
  ErrorDescription: string;
}
