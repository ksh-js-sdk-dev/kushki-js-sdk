import { Kushki } from "class/Kushki.ts";
import { CardSubscriptions } from "class/CardSubscriptions.ts";
import { DeviceTokenRequest } from "types/device_token_request";
import { SecureDeviceTokenOptions } from "types/secure_device_token_request";
import * as HostedFields from "libs/zoid/HostedField.ts";

import * as HostedFieldUtils from "utils/HostedFieldsUtils.ts";
import { FieldEventsEnum } from "infrastructure/FieldEventsEnum.ts";
import { InputModelEnum } from "infrastructure/InputModel.enum.ts";
import { CardService } from "service/CardService.ts";
import { TokenResponse } from "types/token_response";

jest.mock("libs/zoid/HostedField.ts", () => ({
  DestroyKushkiHostedFields: jest.fn(),
  KushkiHostedFields: jest.fn().mockImplementation(() => ({
    requestSecureDeviceToken: jest.fn()
  }))
}));
jest.mock("service/CardService.ts");

describe("CardSubscriptions - class - tests", () => {
  let hideContainersSpy: jest.SpyInstance;
  let showContainersSpy: jest.SpyInstance;
  let renderFieldsSpy: jest.SpyInstance;
  let dispatchEventSpy: jest.SpyInstance;
  let updateValiditySpy: jest.SpyInstance;
  let focusFieldSpy: jest.SpyInstance;
  let resetFieldSpy: jest.SpyInstance;
  let buildValiditySpy: jest.SpyInstance;
  let listenerSpy: jest.SpyInstance;

  const kushkiInstance: Kushki = new Kushki({
    publicCredentialId: "12345678"
  });
  const tokenrequest: DeviceTokenRequest = {
    subscriptionId: "9999"
  };
  const options: SecureDeviceTokenOptions = {
    body: {
      subscriptionId: "9999"
    },
    fields: {
      cvv: {
        selector: "cvv_id"
      }
    }
  };

  const mockHostedFieldsUtils = () => {
    hideContainersSpy = jest
      .spyOn(HostedFieldUtils, "hideContainers")
      .mockReturnValue();
    showContainersSpy = jest
      .spyOn(HostedFieldUtils, "showContainers")
      .mockReturnValue();
    renderFieldsSpy = jest
      .spyOn(HostedFieldUtils, "renderFields")
      .mockResolvedValue([]);
    dispatchEventSpy = jest
      .spyOn(HostedFieldUtils, "dispatchCustomEvent")
      .mockReturnValue({ fields: {}, isFormValid: true });
    updateValiditySpy = jest
      .spyOn(HostedFieldUtils, "updateValidity")
      .mockReturnValue({});
    focusFieldSpy = jest
      .spyOn(HostedFieldUtils, "focusField")
      .mockResolvedValue();
    resetFieldSpy = jest
      .spyOn(HostedFieldUtils, "resetField")
      .mockResolvedValue();
    buildValiditySpy = jest
      .spyOn(HostedFieldUtils, "buildFieldsValidity")
      .mockReturnValue({ fields: {}, isFormValid: true });
    listenerSpy = jest
      .spyOn(HostedFieldUtils, "addEventListener")
      .mockReturnValue();
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockHostedFieldsUtils();
  });

  describe("initSecureDeviceToken - method", () => {
    it("should call container utils methods and create cardSubscription object when call initSecureDeviceToken", async () => {
      const cardSubscription = await CardSubscriptions.initSecureDeviceToken(
        kushkiInstance,
        options
      );

      expect(hideContainersSpy).toBeCalledTimes(1);
      expect(showContainersSpy).toBeCalledTimes(1);
      expect(renderFieldsSpy).toBeCalledTimes(1);
      expect(cardSubscription.getInputs()).toBeDefined();
    });
  });

  describe("KushkiHostedFields - events", () => {
    beforeEach(async () => {
      await CardSubscriptions.initSecureDeviceToken(kushkiInstance, options);
    });

    it("should call dispatchEvent with focus event when act handleOnFocus of field", async () => {
      HostedFields.KushkiHostedFields.mock.calls[0][0].handleOnFocus("cvv");

      expect(dispatchEventSpy).toBeCalledWith(
        expect.anything(),
        FieldEventsEnum.FOCUS,
        "cvv"
      );
    });

    it("should call dispatchEvent with blur event when act handleOnBlur of field", async () => {
      HostedFields.KushkiHostedFields.mock.calls[0][0].handleOnBlur("cvv");

      expect(dispatchEventSpy).toBeCalledWith(
        expect.anything(),
        FieldEventsEnum.BLUR,
        "cvv"
      );
    });

    it("should call dispatchEvent with submit event when act handleOnSubmit of field", async () => {
      HostedFields.KushkiHostedFields.mock.calls[0][0].handleOnSubmit("cvv");

      expect(dispatchEventSpy).toBeCalledWith(
        expect.anything(),
        FieldEventsEnum.SUBMIT,
        "cvv"
      );
    });

    it("should call dispatchEvent with validity event and call  updateValidity when act handleOnValidity of field", async () => {
      HostedFields.KushkiHostedFields.mock.calls[0][0].handleOnValidity("cvv", {
        isValid: true
      });

      expect(updateValiditySpy).toBeCalledTimes(1);
      expect(dispatchEventSpy).toBeCalledWith(
        expect.anything(),
        FieldEventsEnum.VALIDITY,
        "cvv"
      );
    });
  });

  describe("class public methods", () => {
    let cardSubscription: CardSubscriptions;

    beforeEach(async () => {
      cardSubscription = await CardSubscriptions.initSecureDeviceToken(
        kushkiInstance,
        options
      );
    });

    it("should call focusField util method with inputs and cvv field when use focus method", () => {
      cardSubscription.focus();

      expect(focusFieldSpy).toBeCalledTimes(1);
      expect(focusFieldSpy).toBeCalledWith(
        cardSubscription.getInputs(),
        InputModelEnum.CVV
      );
    });

    it("should call resetField util method with inputs and cvv field  when use reset method", () => {
      cardSubscription.reset();

      expect(resetFieldSpy).toBeCalledTimes(1);
      expect(resetFieldSpy).toBeCalledWith(
        cardSubscription.getInputs(),
        InputModelEnum.CVV
      );
    });

    it("should call buildFieldsValidity util method when use getFormValidity method", () => {
      cardSubscription.getFormValidity();

      expect(buildValiditySpy).toBeCalledTimes(1);
      expect(buildValiditySpy).toBeCalledWith(cardSubscription.getInputs());
    });

    it("should call addEventListener util method with focus event when use onFieldFocus method", () => {
      cardSubscription.onFieldFocus(() => {});

      expect(listenerSpy).toBeCalledTimes(1);
      expect(listenerSpy).toBeCalledWith(
        FieldEventsEnum.FOCUS,
        expect.anything(),
        undefined
      );
    });

    it("should call addEventListener util method with blur event when use onFieldBlur method", () => {
      cardSubscription.onFieldBlur(() => {});

      expect(listenerSpy).toBeCalledTimes(1);
      expect(listenerSpy).toBeCalledWith(
        FieldEventsEnum.BLUR,
        expect.anything(),
        undefined
      );
    });

    it("should call addEventListener util method with submit event when use onFieldSubmit method", () => {
      cardSubscription.onFieldSubmit(() => {});

      expect(listenerSpy).toBeCalledTimes(1);
      expect(listenerSpy).toBeCalledWith(
        FieldEventsEnum.SUBMIT,
        expect.anything(),
        undefined
      );
    });

    it("should call addEventListener util method with validity event when use onFieldValidity method", () => {
      cardSubscription.onFieldValidity(() => {});

      expect(listenerSpy).toBeCalledTimes(1);
      expect(listenerSpy).toBeCalledWith(
        FieldEventsEnum.VALIDITY,
        expect.anything(),
        undefined
      );
    });
  });

  describe("requestDeviceToken - method", () => {
    let cardSubscription: CardSubscriptions;
    const tokenMock: TokenResponse = {
      token: "777"
    };

    const mockFormValidity = (isValid: boolean) => {
      jest.spyOn(HostedFieldUtils, "buildFieldsValidity").mockReturnValue({
        fields: {},
        isFormValid: isValid
      });
    };

    const mockCardService = () => {
      // @ts-ignore
      CardService.mockImplementation(() => ({
        createDeviceTokenRequestBody: jest.fn().mockResolvedValue(tokenrequest),
        validateToken: jest.fn().mockResolvedValue(tokenMock)
      }));
    };

    const mockExportValidityMethod = (isValid: boolean) => {
      // @ts-ignore
      cardSubscription.inputValues.cvv.hostedField.requestFormValidity = jest
        .fn()
        .mockResolvedValue(isValid);
    };

    beforeEach(async () => {
      mockCardService();

      cardSubscription = await CardSubscriptions.initSecureDeviceToken(
        kushkiInstance,
        options
      );

      mockExportValidityMethod(true);
    });

    it("should throw error when DeviceTokenRequest param is not sent into requestDeviceToken method", async () => {
      try {
        // @ts-ignore
        await cardSubscription.requestDeviceToken();
      } catch (error: any) {
        expect(error.message).toEqual(
          "Error, configuración de campos requeridos no encontrada"
        );
      }
    });

    it("should throw error when form is invalid", async () => {
      mockExportValidityMethod(false);

      try {
        await cardSubscription.requestDeviceToken(tokenrequest);
      } catch (error: any) {
        expect(error.message).toEqual("Error en la validación del formulario");
      }
    });

    it("should return token when form is valid and hosted field return valid token", async () => {
      mockFormValidity(true);

      const tokenResponse = await cardSubscription.requestDeviceToken(
        tokenrequest
      );

      expect(tokenResponse).toEqual(tokenMock);
    });

    it("should return ERR002 when requestSecureDeviceToken fails", async () => {
      mockFormValidity(true);
      // @ts-ignore
      cardSubscription.inputValues.cvv.hostedField.requestSecureDeviceToken =
        jest.fn().mockRejectedValue("error");
      try {
        await cardSubscription.requestDeviceToken(tokenrequest);
      } catch (error: any) {
        expect(error.code).toEqual("E002");
      }
    });
  });
});
