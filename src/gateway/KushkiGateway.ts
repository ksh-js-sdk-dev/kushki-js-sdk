import { BinBody } from "types/bin_body";
import { BinInfoResponse } from "types/bin_info_response";
import { PathEnum } from "infrastructure/PathEnum.ts";
import { ERRORS } from "infrastructure/ErrorEnum.ts";
import axios, { AxiosError } from "axios";
import { Kushki } from "Kushki";

function _buildHeaders(kushkiInstance: Kushki) {
  return {
    "Public-Merchant-Id": kushkiInstance.getPublicCredentialId()
  };
}

export const requestBinInfo = async (
  kushkiInstance: Kushki,
  body: BinBody
): Promise<BinInfoResponse> => {
  try {
    const url: string = `${kushkiInstance.getBaseUrl()}${PathEnum.bin_info}${
      body.bin
    }`;

    const response = await axios({
      headers: _buildHeaders(kushkiInstance),
      url
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
