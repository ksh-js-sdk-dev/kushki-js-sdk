import "reflect-metadata";
import { BinBody } from "types/bin_body";
import { BinInfoResponse } from "types/bin_info_response";
import { PathEnum } from "infrastructure/PathEnum.ts";
import { ERRORS } from "infrastructure/ErrorEnum.ts";
import axios, { AxiosError } from "axios";
import { Kushki } from "Kushki";
import { IKushkiGateway } from "repository/IKushkiGateway";
import { injectable } from "inversify";

@injectable()
export class KushkiGateway implements IKushkiGateway {
  private readonly _publicHeader: string = "Public-Merchant-Id";

  public requestBinInfo = async (
    kushkiInstance: Kushki,
    body: BinBody
  ): Promise<BinInfoResponse> => {
    try {
      const url: string = `${kushkiInstance.getBaseUrl()}${PathEnum.bin_info}${
        body.bin
      }`;

      const response = await axios.get(url, {
        headers: this._buildHeader(kushkiInstance.getPublicCredentialId())
      });

      const binInfoResponse: BinInfoResponse = response.data;

      return Promise.resolve(binInfoResponse);
    } catch (error) {
      if (error instanceof AxiosError) {
        throw ERRORS.E001;
      } else {
        throw error;
      }
    }
  };

  private _buildHeader(mid: string): object {
    return {
      [this._publicHeader]: mid
    };
  }
}
