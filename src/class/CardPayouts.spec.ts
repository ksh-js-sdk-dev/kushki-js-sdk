import { CardPayouts } from "class/CardPayouts.ts";
import { Kushki } from "class/Kushki.ts";
import { KushkiGateway } from "gateway/KushkiGateway.ts";
import { FieldEventsEnum } from "infrastructure/FieldEventsEnum.ts";
import { InputModelEnum } from "infrastructure/InputModel.enum.ts";
import * as HostedFields from "libs/zoid/HostedField.ts";
import { BinInfoResponse } from "types/bin_info_response";
import { CardPayoutOptions } from "types/card_payout_options";
import { CardPayoutTokenResponse } from "types/card_payout_token_response";
import * as HostedFieldUtils from "utils/HostedFieldsUtils.ts";

jest.mock("libs/zoid/HostedField.ts", () => ({
  DestroyKushkiHostedFields: jest.fn(),
  KushkiHostedFields: jest.fn().mockImplementation(() => ({
    requestCardPayoutToken: jest.fn(),
    updateProps: jest.fn()
  }))
}));
jest.mock("gateway/KushkiGateway.ts");

describe("Card Payouts - Test", () => {
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
  let options: CardPayoutOptions;

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

  const mockKushkiGateway = (isValid: boolean) => {
    const binInfoResponse: BinInfoResponse = {
      bank: "Some Bank",
      brand: "visa",
      cardType: "credit"
    };

    // @ts-ignore
    KushkiGateway.mockImplementation(() => ({
      requestBinInfo: isValid
        ? jest.fn().mockReturnValue(binInfoResponse)
        : jest.fn().mockRejectedValue("Error")
    }));
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockHostedFieldsUtils();

    options = {
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

  describe("initCardPayoutToken - method", () => {
    it("should init hosted fields when call initCardPayoutToken with valid params", async () => {
      const cardPayout: CardPayouts = await CardPayouts.initCardPayoutToken(
        kushkiInstance,
        options
      );

      expect(hideContainersSpy).toBeCalledTimes(1);
      expect(showContainersSpy).toBeCalledTimes(1);
      expect(renderFieldsSpy).toBeCalledTimes(1);
      expect(cardPayout.getInputs()).toBeDefined();
    });

    it("should throw fields error when init without required params", async () => {
      // @ts-ignore
      delete options.fields.cardholderName;

      try {
        await CardPayouts.initCardPayoutToken(kushkiInstance, options);
      } catch (error: any) {
        expect(error.message).toEqual(
          "Error, configuración de campos requeridos no encontrada"
        );
      }
    });
  });

  describe("KushkiHostedFields - events", () => {
    beforeEach(async () => {
      await CardPayouts.initCardPayoutToken(kushkiInstance, options);
    });

    it("should call dispatchEvent with focus event when act handleOnFocus of field", async () => {
      HostedFields.KushkiHostedFields.mock.calls[0][0].handleOnFocus(
        "cardNumber"
      );

      expect(dispatchEventSpy).toBeCalledWith(
        expect.anything(),
        FieldEventsEnum.FOCUS,
        "cardNumber"
      );
    });

    it("should call dispatchEvent with blur event when act handleOnBlur of field", async () => {
      HostedFields.KushkiHostedFields.mock.calls[0][0].handleOnBlur(
        "cardHolderName"
      );

      expect(dispatchEventSpy).toBeCalledWith(
        expect.anything(),
        FieldEventsEnum.BLUR,
        "cardHolderName"
      );
    });

    it("should call dispatchEvent with submit event when act handleOnSubmit of field", async () => {
      HostedFields.KushkiHostedFields.mock.calls[0][0].handleOnSubmit(
        "isSubscription"
      );

      expect(dispatchEventSpy).toBeCalledWith(
        expect.anything(),
        FieldEventsEnum.SUBMIT,
        "isSubscription"
      );
    });

    it("should call dispatchEvent with validity event and call  updateValidity when act handleOnValidity from field", async () => {
      HostedFields.KushkiHostedFields.mock.calls[0][0].handleOnValidity(
        "cardHolderName",
        {
          isValid: true
        }
      );

      expect(updateValiditySpy).toBeCalledTimes(1);
      expect(dispatchEventSpy).toBeCalledWith(
        expect.anything(),
        FieldEventsEnum.VALIDITY,
        "cardHolderName"
      );
    });

    describe("OnBinChange - event cases", () => {
      let cardPayout: CardPayouts;
      const mockGatewayInit = async (isValid: boolean) => {
        mockKushkiGateway(isValid);

        cardPayout = await CardPayouts.initCardPayoutToken(
          kushkiInstance,
          options
        );
      };

      beforeEach(async () => {
        await mockGatewayInit(true);
      });

      it("should update bin on field when call handleOnBinChange with value", async () => {
        // @ts-ignore
        await cardPayout.handleOnBinChange("42424242");

        // @ts-ignore
        expect(cardPayout.currentBin).toEqual("42424242");
      });

      it("should clear bin on field when call handleOnBinChange with empty value", async () => {
        HostedFields.KushkiHostedFields.mock.calls[0][0].handleOnBinChange("");

        // @ts-ignore
        expect(cardPayout.currentBin).toEqual("");
      });

      it("should clear bin on field when call handleOnBinChange and api gateway fails", async () => {
        await mockGatewayInit(false);

        // @ts-ignore
        await cardPayout.handleOnBinChange("42424242");

        // @ts-ignore
        expect(cardPayout.currentBin).toEqual("");
      });
    });
  });

  describe("Class - public methods", () => {
    let cardPayout: CardPayouts;

    beforeEach(async () => {
      cardPayout = await CardPayouts.initCardPayoutToken(
        kushkiInstance,
        options
      );
    });

    it("should call focusField util method with inputs and cvv field when use focus method", () => {
      cardPayout.focus("isSubscription");

      expect(focusFieldSpy).toBeCalledTimes(1);
      expect(focusFieldSpy).toBeCalledWith(
        cardPayout.getInputs(),
        InputModelEnum.IS_SUBSCRIPTION
      );
    });

    it("should call resetField util method with inputs and cvv field  when use reset method", () => {
      cardPayout.reset("cardholderName");

      expect(resetFieldSpy).toBeCalledTimes(1);
      expect(resetFieldSpy).toBeCalledWith(
        cardPayout.getInputs(),
        InputModelEnum.CARDHOLDER_NAME
      );
    });

    it("should call buildFieldsValidity util method when use getFormValidity method", () => {
      cardPayout.getFormValidity();

      expect(buildValiditySpy).toBeCalledTimes(1);
      expect(buildValiditySpy).toBeCalledWith(cardPayout.getInputs());
    });

    it("should call addEventListener util method with focus event when use onFieldFocus method", () => {
      cardPayout.onFieldFocus(() => {});

      expect(listenerSpy).toBeCalledTimes(1);
      expect(listenerSpy).toBeCalledWith(
        FieldEventsEnum.FOCUS,
        expect.anything(),
        undefined
      );
    });

    it("should call addEventListener util method with blur event when use onFieldBlur method", () => {
      cardPayout.onFieldBlur(() => {});

      expect(listenerSpy).toBeCalledTimes(1);
      expect(listenerSpy).toBeCalledWith(
        FieldEventsEnum.BLUR,
        expect.anything(),
        undefined
      );
    });

    it("should call addEventListener util method with submit event when use onFieldSubmit method", () => {
      cardPayout.onFieldSubmit(() => {});

      expect(listenerSpy).toBeCalledTimes(1);
      expect(listenerSpy).toBeCalledWith(
        FieldEventsEnum.SUBMIT,
        expect.anything(),
        undefined
      );
    });

    it("should call addEventListener util method with validity event when use onFieldValidity method", () => {
      cardPayout.onFieldValidity(() => {});

      expect(listenerSpy).toBeCalledTimes(1);
      expect(listenerSpy).toBeCalledWith(
        FieldEventsEnum.VALIDITY,
        expect.anything(),
        undefined
      );
    });
  });

  describe("requestCardPayoutToken - method", () => {
    let cardPayout: CardPayouts;
    const tokenMock: CardPayoutTokenResponse = {
      token: "777"
    };

    const mockExportRequestTokenMethod = (isValid: boolean) => {
      // @ts-ignore
      cardPayout.inputValues.cardholderName.hostedField.requestCardPayoutToken =
        isValid
          ? jest.fn().mockResolvedValue(tokenMock)
          : jest.fn().mockRejectedValue("error");
    };

    const mockExportValidityMethod = (isValid: boolean) => {
      // @ts-ignore
      cardPayout.inputValues.cardholderName.hostedField.requestFormValidity =
        jest.fn().mockResolvedValue(isValid);
    };

    beforeEach(async () => {
      cardPayout = await CardPayouts.initCardPayoutToken(
        kushkiInstance,
        options
      );

      mockExportValidityMethod(true);
    });

    it("should throw error when form is invalid", async () => {
      mockExportValidityMethod(false);

      try {
        await cardPayout.requestCardPayoutToken();
      } catch (error: any) {
        expect(error.message).toEqual("Error en la validación del formulario");
      }
    });

    it("should throw error when requestToken field method fails", async () => {
      mockExportRequestTokenMethod(false);

      try {
        await cardPayout.requestCardPayoutToken();
      } catch (error: any) {
        expect(error.message).toEqual("Error en solicitud de token");
      }
    });

    it("should return token when form is valid and hosted field return valid token", async () => {
      mockExportRequestTokenMethod(true);

      const tokenResponse = await cardPayout.requestCardPayoutToken();

      expect(tokenResponse).toEqual(tokenMock);
    });
  });
});
