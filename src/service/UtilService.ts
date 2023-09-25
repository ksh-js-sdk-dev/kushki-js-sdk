import { KushkiError, KushkiErrorAttr } from "infrastructure/KushkiError.ts";
import { AxiosError } from "axios";

export class UtilsService {
  public static validErrors = (
    error: Error | KushkiError | AxiosError | unknown,
    errorCode: KushkiErrorAttr
  ): Promise<any> => {
    if (error instanceof AxiosError) {
      return Promise.reject(new KushkiError(errorCode, error.message));
    }
    if (error instanceof KushkiError) {
      return Promise.reject(error);
    }
    if (error instanceof Error) {
      return Promise.reject(new KushkiError(errorCode, error.message));
    }

    return Promise.reject(new KushkiError(errorCode));
  };
}
