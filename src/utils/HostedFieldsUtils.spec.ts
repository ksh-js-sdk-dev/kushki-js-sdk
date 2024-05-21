import {
  addEventListener,
  buildCustomHeaders,
  buildFieldsValidity,
  dispatchCustomEvent,
  focusField,
  hideContainers,
  resetField,
  showContainers,
  updateValidity
} from "utils/HostedFieldsUtils.ts";
import { KInfo } from "service/KushkiInfoService.ts";
import { CardFieldValues } from "types/card_fields_values";
import { FieldEventsEnum } from "infrastructure/FieldEventsEnum.ts";
import { FieldValidity, FormValidity } from "types/form_validity";
import { InputModelEnum } from "infrastructure/InputModel.enum.ts";

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
});
