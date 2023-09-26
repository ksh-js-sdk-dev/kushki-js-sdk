import { UtilsService } from "service/UtilService";
import { KushkiError } from "infrastructure/KushkiError.ts";
import { ERRORS } from "infrastructure/ErrorEnum.ts";
import { AxiosError } from "axios";

describe("UtilService - ", () => {
  it("When error is of type Error, return detail message", async () => {
    const errorMessage: string = "messageError";
    const error: Error = new Error(errorMessage);

    try {
      await UtilsService.validErrors(error, ERRORS.E012);
    } catch (e: any) {
      expect(e.detail).toEqual(errorMessage);
    }
  });

  it("When error is of type KushkiError, return code and message", async () => {
    const error: KushkiError = new KushkiError(ERRORS.E007);

    try {
      await UtilsService.validErrors(error, ERRORS.E007);
    } catch (e: any) {
      expect(e.message).toEqual("Error en la validación del formulario");
      expect(e.code).toEqual("E007");
    }
  });

  it("When error is of type AxiosError, return message detail", async () => {
    const errorMessageAxios: string = "messageErrorAxios";
    const error: AxiosError = new AxiosError(errorMessageAxios);

    try {
      await UtilsService.validErrors(error, ERRORS.E012);
    } catch (e: any) {
      expect(e.detail).toEqual(errorMessageAxios);
    }
  });

  it("when error is unknown, return code default", async () => {
    const unknownValue: unknown = "Valor desconocido";

    try {
      await UtilsService.validErrors(unknownValue, ERRORS.E012);
    } catch (e: any) {
      expect(e.code).toEqual(ERRORS.E012.code);
    }
  });
});
