import { KushkiError } from "infrastructure/KushkiError.ts";
import { ERRORS } from "infrastructure/ErrorEnum.ts";
import { CardFieldValues, FieldInstance } from "types/card_fields_values";
import { KInfo } from "service/KushkiInfoService.ts";
import {
  Fields,
  FieldTypeEnum,
  FieldValidity,
  FormValidity
} from "types/form_validity";
import { FieldEventsEnum } from "infrastructure/FieldEventsEnum.ts";
import { ErrorTypeEnum } from "infrastructure/ErrorTypeEnum.ts";
import { InputModelEnum } from "infrastructure/InputModel.enum.ts";
import { IKushki } from "repository/IKushki.ts";
import { CardOptions } from "types/card_options";
import { SecureDeviceTokenOptions } from "types/secure_device_token_request";

const _getContainers = (inputValues: CardFieldValues) => {
  return Object.values<FieldInstance>(inputValues).map(
    (fieldInstance: FieldInstance) =>
      document.getElementById(`${fieldInstance.selector}`)
  );
};

const _buildCustomEvent = (validityDetail: FormValidity, eventId: string) => {
  return new CustomEvent<FormValidity>(eventId, {
    detail: validityDetail
  });
};

export const buildFieldsValidity = (
  inputValues: CardFieldValues,
  field?: FieldTypeEnum,
  isFormValid?: boolean
): FormValidity => {
  const defaultValidity: FieldValidity = {
    errorType: ErrorTypeEnum.EMPTY,
    isValid: false
  };
  const fieldsValidity: Fields = {};
  let formValid: boolean = true;

  for (const inputName in inputValues) {
    if (
      Object.values(InputModelEnum).includes(inputName as InputModelEnum) &&
      inputName !== InputModelEnum.OTP &&
      inputValues[inputName].validity
    ) {
      fieldsValidity[inputName as keyof Fields] = defaultValidity;
      fieldsValidity[inputName as keyof Fields] = {
        errorType: inputValues[inputName].validity.errorType,
        isValid: inputValues[inputName].validity.isValid
      };
    }

    const validityProps: FieldValidity = inputValues[inputName].validity;
    const isInputInValid: boolean = !validityProps.isValid;

    if (isInputInValid) formValid = false;
  }

  return {
    fields: fieldsValidity,
    isFormValid: isFormValid ?? formValid,
    triggeredBy: field
  };
};

export const dispatchCustomEvent = (
  inputValues: CardFieldValues,
  listener: string,
  field?: string,
  isFormValid?: boolean
): FormValidity => {
  const validityDetail: FormValidity = buildFieldsValidity(
    inputValues,
    field as FieldTypeEnum,
    isFormValid
  );

  dispatchEvent(_buildCustomEvent(validityDetail, listener));

  if (field)
    dispatchEvent(_buildCustomEvent(validityDetail, `${listener}${field}`));

  return validityDetail;
};

export const addEventListener = (
  listener: FieldEventsEnum,
  event: (fieldEvent: FormValidity | FieldValidity) => void,
  fieldType?: FieldTypeEnum
): void => {
  if (fieldType) {
    window.addEventListener(`${listener}${fieldType}`, ((
      e: CustomEvent<FormValidity>
    ) => {
      event(e.detail!.fields![fieldType as keyof Fields] || e.detail!);
    }) as EventListener);
  } else {
    window.addEventListener(listener, ((e: CustomEvent<FormValidity>) => {
      event(e.detail!);
    }) as EventListener);
  }
};

export const updateValidity = (
  inputValues: CardFieldValues,
  field: InputModelEnum,
  fieldValidity: FieldValidity
): CardFieldValues => {
  return {
    ...inputValues,
    [field]: {
      ...inputValues[field],
      validity: {
        errorType: fieldValidity.errorType,
        isValid: fieldValidity.isValid
      }
    }
  };
};

export const hideContainers = (inputValues: CardFieldValues): void => {
  _getContainers(inputValues).forEach((htmlElement) => {
    if (!htmlElement) throw new KushkiError(ERRORS.E013);

    htmlElement!.style.cssText += "display:none";
  });
};

export const showContainers = (inputValues: CardFieldValues) => {
  _getContainers(inputValues).forEach((htmlElement) => {
    if (!htmlElement) throw new KushkiError(ERRORS.E013);

    htmlElement!.removeAttribute("style");
  });
};

export const focusField = (
  inputValues: CardFieldValues,
  fieldType: FieldTypeEnum
): Promise<void> => {
  if (inputValues[fieldType]) {
    inputValues[fieldType].hostedField.updateProps({
      isFocusActive: true
    });

    inputValues[fieldType].hostedField.updateProps({
      isFocusActive: false
    });

    return Promise.resolve();
  } else {
    return Promise.reject(new KushkiError(ERRORS.E010));
  }
};

export const resetField = (
  inputValues: CardFieldValues,
  fieldType: FieldTypeEnum
): Promise<void> => {
  if (inputValues[fieldType]) {
    inputValues[fieldType]?.hostedField?.updateProps({
      brandIcon: "",
      reset: true
    });

    inputValues[fieldType]?.hostedField?.updateProps({
      reset: false
    });

    return Promise.resolve();
  } else {
    return Promise.reject(new KushkiError(ERRORS.E009));
  }
};

export const renderFields = async (
  inputValues: CardFieldValues
): Promise<void[]> => {
  return Promise.all(
    Object.values<FieldInstance>(inputValues).map(
      (field) =>
        field!.hostedField?.render(`#${field!.selector}`) as Promise<void>
    )
  );
};

export const buildCustomHeaders = () => ({
  [KInfo.KUSHKI_INFO_HEADER]: KInfo.buildKushkiInfo()
});

export const validateInitParams = (
  kushkiInstance: IKushki,
  options: CardOptions | SecureDeviceTokenOptions
) => {
  if (!options || !kushkiInstance) {
    throw new KushkiError(ERRORS.E012);
  }
};
