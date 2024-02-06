export enum CardinalValidationCodeEnum {
  SUCCESS = "SUCCESS",
  FAIL = "FAILURE",
  NO_ACTION = "NOACTION"
}

export interface ICardinalValidation {
  ActionCode: string;
  Validated: boolean;
  ErrorDescription: string;
}
