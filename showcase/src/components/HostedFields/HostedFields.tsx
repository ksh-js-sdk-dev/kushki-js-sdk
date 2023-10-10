import { ErrorTypeEnum } from "../../../../src/infrastructure/ErrorTypeEnum.ts";
import CardNumberHelper from "../CardNumberHelper/CardNumberHelper.tsx";
import { Fields } from "../../../../types/form_validity";
import { IDefaultInformation } from "../ConfigurationDemo/ConfigurationDemo.interface.ts";
import { useEffect, useState } from "react";
import { InputModelEnum } from "../../../../src/infrastructure/InputModel.enum.ts";

export interface IHostedFieldsProps {
  showOTP: boolean;
  fieldsValidityDemo: Fields;
  errorOTP: string;
  displayHostedFields: boolean;
  buttonActive: IDefaultInformation;
}

const HostedFields = ({
  showOTP,
  fieldsValidityDemo,
  displayHostedFields,
  errorOTP,
  buttonActive
}: IHostedFieldsProps) => {
  const [cardHelper, setCardHelper] = useState<string>("4195614311940576");
  const customMessageValidity = (field: string, errorType: ErrorTypeEnum) => {
    const fieldsErrorEmpty: Record<string, string> = {
      [InputModelEnum.CARDHOLDER_NAME]:
        "Nombre del tarjeta habiente es requerido",
      [InputModelEnum.CARD_NUMBER]: "Número de tarjeta es un campo requerido",
      [InputModelEnum.EXPIRATION_DATE]: "Fecha de vencimiento es requerido",
      [InputModelEnum.CVV]: "El campo CVV es requerido"
    };

    const fieldsErrorInvalid: Record<string, string> = {
      [InputModelEnum.CARDHOLDER_NAME]:
        "Nombre del tarjeta habiente es inválido",
      [InputModelEnum.CARD_NUMBER]:
        "Verifique los dígitos ingresados en su tarjeta",
      [InputModelEnum.EXPIRATION_DATE]: "El formato es incorrecto",
      [InputModelEnum.CVV]: "El código es incorrecto"
    };

    if (errorType === "empty") {
      return fieldsErrorEmpty[field] || `El campo ${field} es requerido`;
    }

    if (field !== InputModelEnum.DEFERRED)
      return fieldsErrorInvalid[field] || `${field} is ${errorType}`;

    if (errorType === ErrorTypeEnum.DEFERRED_TYPE_REQUERED)
      return "El tipo de diferido es requerido";

    if (errorType === ErrorTypeEnum.DEFERRED_MONTHS_REQUERED)
      return "La cantidad de meses son requeridos";
  };

  const validError = (
    fieldsValidity: Fields,
    fieldType: keyof Fields
  ): boolean => {
    return (
      !fieldsValidity[fieldType]?.isValid &&
      fieldsValidity[fieldType]?.errorType !== undefined
    );
  };

  useEffect(() => {
    if (buttonActive.threeDomainSecure) setCardHelper("4000000000002503");
    if (buttonActive.otp) setCardHelper("4195612455557800");
    if (buttonActive.approved) setCardHelper("4195612455557800");
    if (buttonActive.declined) setCardHelper("4574441215190335");
  }, [buttonActive]);

  return (
    <div className={"box-hosted-fields"}>
      {displayHostedFields && (
        <div className="mui--text-body2 mui-text-custom">
          Completar el formulario
        </div>
      )}
      {!showOTP && (
        <>
          <div id="cardHolderName_id"></div>
          {validError(fieldsValidityDemo, "cardholderName") && (
            <div className={"label-hostedFieldError"}>
              {customMessageValidity(
                "cardholderName",
                fieldsValidityDemo.cardholderName.errorType! as ErrorTypeEnum
              )}
            </div>
          )}
          <div id="cardNumber_id"></div>
          {validError(fieldsValidityDemo, "cardNumber") && (
            <div className={"label-hostedFieldError"}>
              {customMessageValidity(
                "cardNumber",
                fieldsValidityDemo.cardNumber.errorType! as ErrorTypeEnum
              )}
            </div>
          )}
          <CardNumberHelper
            displayHostedFields={displayHostedFields}
            cardNumberHelper={cardHelper}
          />
          <div id="expirationDate_id"></div>
          {validError(fieldsValidityDemo, "expirationDate") && (
            <div className={"label-hostedFieldError"}>
              {customMessageValidity(
                "expirationDate",
                fieldsValidityDemo.expirationDate.errorType! as ErrorTypeEnum
              )}
            </div>
          )}
          <div id="cvv_id"></div>
          {validError(fieldsValidityDemo, "cvv") && (
            <div className={"label-hostedFieldError"}>
              {customMessageValidity(
                "cvv",
                fieldsValidityDemo.cvv.errorType! as ErrorTypeEnum
              )}
            </div>
          )}
          <div id="deferred_id"></div>
          {validError(fieldsValidityDemo, "deferred") && (
            <div className={"label-hostedFieldError"}>
              {customMessageValidity(
                "deferred",
                fieldsValidityDemo.deferred!.errorType! as ErrorTypeEnum
              )}
            </div>
          )}
        </>
      )}
      <div id="otp_id"></div>
      <div className={"label-hostedFieldError"}>
        {errorOTP.length > 0 && <div>El código OTP es incorrecto</div>}
      </div>
    </div>
  );
};

export default HostedFields;
