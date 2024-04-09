import { ErrorTypeEnum } from "../../../../src/infrastructure/ErrorTypeEnum.ts";
import CardNumberHelper from "../CardNumberHelper/CardNumberHelper.tsx";
import { Fields } from "../../../../types/form_validity";
import { IDefaultInformation } from "../ConfigurationDemo/ConfigurationDemo.interface.ts";
import { useEffect, useState } from "react";
import { InputModelEnum } from "../../../../src/infrastructure/InputModel.enum.ts";
import {
  deferredErrors,
  fieldsErrorEmpty,
  fieldsErrorInvalid
} from "../../shared/enums/ErrorLabels.enum.ts";

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
    if (errorType === "empty") {
      return fieldsErrorEmpty[field] || `El campo ${field} es requerido`;
    }

    if (field !== InputModelEnum.DEFERRED)
      return fieldsErrorInvalid[field] || `${field} is ${errorType}`;

    return deferredErrors[errorType];
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
        <div className="mui--text-subhead mui-text-custom">
          Completar el formulario
        </div>
      )}
      {!showOTP && (
        <>
          <div id="cardHolderName_id"></div>
          {validError(fieldsValidityDemo, "cardholderName") && (
            <div className={"label-hosted-field-error"}>
              {customMessageValidity(
                "cardholderName",
                fieldsValidityDemo.cardholderName!.errorType! as ErrorTypeEnum
              )}
            </div>
          )}
          <div id="cardNumber_id"></div>
          {validError(fieldsValidityDemo, "cardNumber") && (
            <div className={"label-hosted-field-error"}>
              {customMessageValidity(
                "cardNumber",
                fieldsValidityDemo.cardNumber!.errorType! as ErrorTypeEnum
              )}
            </div>
          )}
          <CardNumberHelper
            displayHostedFields={displayHostedFields}
            cardNumberHelper={cardHelper}
          />
          <div id="expirationDate_id"></div>
          {validError(fieldsValidityDemo, "expirationDate") && (
            <div className={"label-hosted-field-error"}>
              {customMessageValidity(
                "expirationDate",
                fieldsValidityDemo.expirationDate!.errorType! as ErrorTypeEnum
              )}
            </div>
          )}
          <div id="cvv_id"></div>
          {validError(fieldsValidityDemo, "cvv") && (
            <div className={"label-hosted-field-error"}>
              {customMessageValidity(
                "cvv",
                fieldsValidityDemo.cvv!.errorType! as ErrorTypeEnum
              )}
            </div>
          )}
          <div id="deferred_id"></div>
          {validError(fieldsValidityDemo, "deferred") && (
            <div className={"label-hosted-field-error"}>
              {customMessageValidity(
                "deferred",
                fieldsValidityDemo.deferred!.errorType! as ErrorTypeEnum
              )}
            </div>
          )}
        </>
      )}
      <div id="otp_id"></div>
      <div className={"label-hosted-field-error"}>
        {errorOTP.length > 0 && <div>El código OTP es incorrecto</div>}
      </div>
    </div>
  );
};

export default HostedFields;
