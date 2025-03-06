import { Kushki } from "class/Kushki.ts";
import {
  FieldEventsEnum,
  FieldsMethodTypesEnum
} from "infrastructure/FieldEventsEnum.ts";
import { InputModelEnum } from "infrastructure/InputModel.enum.ts";
import { KInfo } from "service/KushkiInfoService.ts";
import { FieldOptions } from "src/interfaces/FieldOptions.ts";
import { CardFieldValues } from "types/card_fields_values";
import { CardOptions, Field } from "types/card_options";
import { CardPayoutOptions } from "types/card_payout_options";
import { FieldValidity, FormValidity } from "types/form_validity";
import { SecureDeviceTokenOptions } from "types/secure_device_token_request";
import {
  addEventListener,
  buildCustomHeaders,
  buildFieldsValidity,
  dispatchCustomEvent,
  focusField,
  getInitialFieldValidation,
  hideContainers,
  isRequiredFlagInCvv,
  resetField,
  showContainers,
  updateValidity,
  validateInitParams
} from "utils/HostedFieldsUtils.ts";

describe("HostedFields utils - test", () => {
  describe("buildCustomHeaders - method", () => {
    it("should return header with encoded kushkiInfo", () => {
      const response = buildCustomHeaders();

      expect(response).toHaveProperty(KInfo.KUSHKI_INFO_HEADER);
    });
  });

  describe("hideContainers - method", () => {
    const fieldsMock: CardFieldValues = {
      cvv: {
        selector: "cvv_id",
        validity: {
          isValid: true
        }
      }
    };

    it("should throws error when fields are not created", () => {
      try {
        hideContainers(fieldsMock);
      } catch (error: any) {
        expect(error.message).toEqual(
          "El Id del contenedor de un input no fue encontrado"
        );
      }
    });

    it("should change div display style to none when call hideContainers", () => {
      const divMock = document.createElement("div");

      divMock.id = "cvv_id";

      document.body.appendChild(divMock);

      hideContainers(fieldsMock);
      expect(
        window.getComputedStyle(divMock).getPropertyValue("display")
      ).toEqual("none");

      divMock.remove();
    });
  });

  describe("showContainers - method", () => {
    const fieldsMock: CardFieldValues = {
      cvv: {
        selector: "cvv_id",
        validity: {
          isValid: true
        }
      }
    };

    it("should throws error when fields are not created for showContainers method", () => {
      try {
        showContainers(fieldsMock);
      } catch (error: any) {
        expect(error.message).toEqual(
          "El Id del contenedor de un input no fue encontrado"
        );
      }
    });

    it("should remove div display style and return to default when call showContainers", () => {
      const divMock = document.createElement("div");

      divMock.id = "cvv_id";

      document.body.appendChild(divMock);

      showContainers(fieldsMock);

      expect(
        window.getComputedStyle(divMock).getPropertyValue("display")
      ).toEqual("block");

      divMock.remove();
    });
  });

  describe("buildFieldsValidity - method", () => {
    it("should return validForm with true when all inputs are valid", () => {
      const inputValues: CardFieldValues = {
        cardNumber: {
          selector: "cardNumber_id",
          validity: {
            isValid: true
          }
        }
      };

      const formValidity = buildFieldsValidity(inputValues);

      expect(formValidity.isFormValid).toEqual(true);
    });

    it("should return inValidForm with false when one input is invalid", () => {
      const inputValues: CardFieldValues = {
        cvv: {
          selector: "cvv_id",
          validity: {
            isValid: false
          }
        }
      };

      const formValidity = buildFieldsValidity(inputValues);

      expect(formValidity.isFormValid).toEqual(false);
    });

    it("should return validForm with true when one input is OTP and triggered by otp", () => {
      const inputValues: CardFieldValues = {
        otp: {
          selector: "otp_id",
          validity: {
            isValid: true
          }
        }
      };

      const formValidity = buildFieldsValidity(inputValues, "otp");

      expect(formValidity.isFormValid).toEqual(true);
      expect(formValidity.triggeredBy).toEqual("otp");
    });
  });

  describe("addEventListener - dispatchCustomEvent - methods", () => {
    it("should listen FOCUS event with validity true when dispatch FOCUS event with valid input", () => {
      const inputValues: CardFieldValues = {
        cardNumber: {
          selector: "cardNumber_id",
          validity: {
            isValid: true
          }
        }
      };

      addEventListener(FieldEventsEnum.FOCUS, (event: any) => {
        expect(event.isFormValid).toEqual(true);
      });

      dispatchCustomEvent(inputValues, FieldEventsEnum.FOCUS);
    });

    it("should listen SUBMIT event with validity false and error type when dispatch SUBMIT event with invalid input and fieldType", () => {
      const inputValues: CardFieldValues = {
        cvv: {
          selector: "cvv_id",
          validity: {
            errorType: "empty",
            isValid: false
          }
        }
      };

      addEventListener(
        FieldEventsEnum.SUBMIT,
        (event: FormValidity | FieldValidity) => {
          expect(event.isValid).toEqual(false);
          expect(event.errorType).toEqual("empty");
        },
        "cvv"
      );

      dispatchCustomEvent(inputValues, FieldEventsEnum.SUBMIT, "cvv");
    });

    it("should listen BLUR event with validity true when dispatch BLUR event for otp input", () => {
      const inputValues: CardFieldValues = {
        otp: {
          selector: "otp_id",
          validity: {
            isValid: true
          }
        }
      };

      addEventListener(
        FieldEventsEnum.BLUR,
        (event: any) => {
          expect(event.isFormValid).toEqual(true);
        },
        "otp"
      );

      dispatchCustomEvent(inputValues, FieldEventsEnum.BLUR, "otp");
    });
  });

  describe("focusField - method", () => {
    const updatePropsSpy = jest.fn();
    const inputValues: CardFieldValues = {
      cardholderName: {
        hostedField: {
          updateProps: updatePropsSpy
        },
        selector: "cardholderName_id",
        validity: {
          isValid: true
        }
      }
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should act updateProps twice when call focusField", async () => {
      await focusField(inputValues, "cardholderName");

      expect(updatePropsSpy).toBeCalledTimes(2);
    });

    it("should throws exception when call focusField with empty field", async () => {
      try {
        await focusField(inputValues, "cvv");
      } catch (error: any) {
        expect(error.message).toEqual("Error al realizar focus en el campo");
      }
    });
  });

  describe("resetField - method", () => {
    const updatePropsSpy = jest.fn();
    const inputValues: CardFieldValues = {
      expirationDate: {
        hostedField: {
          updateProps: updatePropsSpy
        },
        selector: "expirationDate_id",
        validity: {
          isValid: true
        }
      }
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should act updateProps twice when call resetField", async () => {
      await resetField(inputValues, "expirationDate");

      expect(updatePropsSpy).toBeCalledTimes(2);
    });

    it("should throws exception when call resetField with empty field", async () => {
      try {
        await resetField(inputValues, "cardNumber");
      } catch (error: any) {
        expect(error.message).toEqual("Error al limpiar el campo");
      }
    });
  });

  describe("updateValidity - method", () => {
    it("should update input values with field validity when call updateValidity", () => {
      const inputValues: CardFieldValues = {
        cardNumber: {
          selector: "cardNumber_id",
          validity: {
            isValid: true
          }
        }
      };
      const newValue = updateValidity(inputValues, InputModelEnum.CARD_NUMBER, {
        errorType: "empty",
        isValid: false
      });

      expect(newValue.cardNumber?.validity.isValid).toEqual(false);
      expect(newValue.cardNumber?.validity.errorType).toEqual("empty");
    });
  });

  describe("validateInitParams - method", () => {
    const kushkiInstance = new Kushki({ publicCredentialId: "00000" });
    let cardOptionsMock: CardOptions;
    let deviceOptionsMock: SecureDeviceTokenOptions;
    let cardPayoutOptionsMock: CardPayoutOptions;

    beforeEach(() => {
      cardOptionsMock = {
        currency: "USD",
        fields: {
          cardholderName: {
            selector: "cardholderName_id"
          },
          cardNumber: {
            selector: "cardNumber_id"
          },
          cvv: {
            selector: "cvv_id"
          },
          expirationDate: {
            selector: "expirationDate_id"
          }
        }
      };
      deviceOptionsMock = {
        body: { subscriptionId: "4545454" },
        fields: {
          cvv: {
            selector: "cvv_id"
          }
        }
      };
      cardPayoutOptionsMock = {
        fields: {
          cardholderName: {
            selector: "cardholderName_id"
          },
          cardNumber: {
            selector: "cardNumber_id"
          },
          isSubscription: {
            selector: "isSubscription_id"
          }
        }
      };
    });

    it("should throws E012 when options is undefined ", () => {
      try {
        validateInitParams(
          kushkiInstance,
          // @ts-ignore
          undefined,
          FieldsMethodTypesEnum.DEVICE_TOKEN
        );
      } catch (error: any) {
        expect(error.code).toEqual("E012");
      }
    });

    it("should throws E012 when kushkiInstance is undefined ", () => {
      try {
        validateInitParams(
          // @ts-ignore
          undefined,
          cardOptionsMock,
          FieldsMethodTypesEnum.DEVICE_TOKEN
        );
      } catch (error: any) {
        expect(error.code).toEqual("E012");
      }
    });

    it("should throws E020 when required field not exist for SecureDeviceOptions", () => {
      // @ts-ignore
      deviceOptionsMock.fields = {};

      try {
        validateInitParams(
          kushkiInstance,
          deviceOptionsMock,
          FieldsMethodTypesEnum.DEVICE_TOKEN
        );
      } catch (error: any) {
        expect(error.code).toEqual("E020");
      }
    });

    it("should throws E020 when required field not exist for cardOptions", () => {
      // @ts-ignore
      cardOptionsMock.fields = {};

      try {
        validateInitParams(
          kushkiInstance,
          cardOptionsMock,
          FieldsMethodTypesEnum.CARD_TOKEN
        );
      } catch (error: any) {
        expect(error.code).toEqual("E020");
      }
    });

    it("should throws E020 when cardOptions is not subscription and not contains cvv field", () => {
      // @ts-ignore
      cardOptionsMock.fields.cvv = {};

      try {
        validateInitParams(
          kushkiInstance,
          cardOptionsMock,
          FieldsMethodTypesEnum.CARD_TOKEN
        );
      } catch (error: any) {
        expect(error.code).toEqual("E020");
      }
    });

    it("should throws E020 when not exist isSubscription field for CARD_PAYOUT_TOKEN", () => {
      try {
        validateInitParams(
          kushkiInstance,
          cardPayoutOptionsMock,
          FieldsMethodTypesEnum.CARD_PAYOUT_TOKEN
        );
      } catch (error: any) {
        expect(error.code).toEqual("E020");
      }
    });

    it("should throws E011 when send paymentType with invalid format", () => {
      cardPayoutOptionsMock.paymentType = "ECU";
      try {
        validateInitParams(
          kushkiInstance,
          cardPayoutOptionsMock,
          FieldsMethodTypesEnum.CARD_PAYOUT_TOKEN
        );
      } catch (error: any) {
        expect(error.code).toEqual("E011");
      }
    });
  });

  describe("isRequiredFlagInCvv - method", () => {
    it("should return false when isRequired not exist in options", () => {
      const fieldMock: Field = {
        selector: "id"
      };
      const response = isRequiredFlagInCvv(fieldMock, false);

      expect(response).toBeFalsy();
    });

    it("should return true when isRequired exist in options and isSubscription is true", () => {
      const fieldMock: Field = {
        isRequired: true,
        selector: "id"
      };
      const response = isRequiredFlagInCvv(fieldMock, true);

      expect(response).toBeTruthy();
    });
  });

  describe("getInitialFieldValidation - method", () => {
    it("should return false when fieldKey is not CVV", () => {
      const optionsMock: FieldOptions = {
        fieldType: InputModelEnum.CARD_NUMBER,
        isInTest: true
      };

      const response = getInitialFieldValidation(optionsMock, false);

      expect(response).toBeFalsy();
    });

    it("should return true when fieldKey is CVV, field is required and isSubscription is true", () => {
      const optionsMock: FieldOptions = {
        fieldType: InputModelEnum.CVV,
        isInTest: true,
        isRequired: true
      };

      const response = getInitialFieldValidation(optionsMock, true);

      expect(response).toBeFalsy();
    });

    it("should return true when fieldKey is CVV and field is required", () => {
      const optionsMock: FieldOptions = {
        fieldType: InputModelEnum.CVV,
        isInTest: true,
        isRequired: true
      };

      const response = getInitialFieldValidation(optionsMock, true);

      expect(response).toBeFalsy();
    });

    it("should return false when fieldKey is CVV, field is not required and isSubscription is true", () => {
      const optionsMock: FieldOptions = {
        fieldType: InputModelEnum.CVV,
        isInTest: true,
        isRequired: false
      };

      const response = getInitialFieldValidation(optionsMock, true);

      expect(response).toBeTruthy();
    });

    it("should return true when field is type IS_SUBSCRIPTION and isRequired with defaultValue true", () => {
      const optionsMock: FieldOptions = {
        defaultValue: true,
        fieldType: InputModelEnum.IS_SUBSCRIPTION,
        isInTest: true,
        isRequired: true
      };

      const response = getInitialFieldValidation(optionsMock, true);

      expect(response).toBeTruthy();
    });

    it("should return false when field is type IS_SUBSCRIPTION and isRequired with defaultValue false", () => {
      const optionsMock: FieldOptions = {
        defaultValue: false,
        fieldType: InputModelEnum.IS_SUBSCRIPTION,
        isInTest: true,
        isRequired: true
      };

      const response = getInitialFieldValidation(optionsMock, true);

      expect(response).toBeFalsy();
    });

    it("should return true when field is type IS_SUBSCRIPTION and isRequired is false", () => {
      const optionsMock: FieldOptions = {
        fieldType: InputModelEnum.IS_SUBSCRIPTION,
        isInTest: true,
        isRequired: false
      };

      const response = getInitialFieldValidation(optionsMock, true);

      expect(response).toBeTruthy();
    });
  });
});
