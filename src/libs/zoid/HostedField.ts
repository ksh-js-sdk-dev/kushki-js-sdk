// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as zoid from "@krakenjs/zoid/dist/zoid.frameworks";
import { CardOptions } from "types/card_options";
import { CardTokenResponse } from "types/card_token_response";
import { SiftScienceObject } from "types/sift_science_object";
import { DeferredValues } from "types/card_fields_values";
import { IKushki } from "Kushki";
import { KUSHKI_HOSTED_FIELD_TAG } from "src/constant/HostedFieldTags.ts";
import { FieldOptions } from "src/interfaces/FieldOptions.ts";
import { HostedFieldUrlEnum } from "infrastructure/HostedFieldUrlEnum.ts";
import { PathsHtmlSpaInputs } from "infrastructure/PathsHtmlSpaInputs.ts";
import { DeviceTokenRequest } from "types/device_token_request";
import { InputModelEnum } from "infrastructure/InputModel.enum.ts";

const KushkiHostedFields = zoid.create({
  dimensions: {
    height: "55px",
    width: "300px"
  },
  exports: ({ getExports }: any) => {
    return {
      requestPaymentToken: (
        kushkiInstance: IKushki,
        options: CardOptions,
        requestPath: string,
        jwt?: string,
        siftScienceSession?: SiftScienceObject,
        deferredValues?: DeferredValues
      ): Promise<CardTokenResponse> =>
        getExports().then((exports: any) =>
          exports.requestPaymentToken(
            kushkiInstance,
            options,
            requestPath,
            jwt,
            siftScienceSession,
            deferredValues
          )
        ),
      requestSecureDeviceToken: (
        kushkiInstance: IKushki,
        body: DeviceTokenRequest,
        requestPath: string,
        customHeaders: object
      ): Promise<CardTokenResponse> =>
        getExports().then((exports: any) =>
          exports.requestSecureDeviceToken(
            kushkiInstance,
            body,
            requestPath,
            customHeaders
          )
        )
    };
  },
  tag: KUSHKI_HOSTED_FIELD_TAG,
  url: (options: { props: FieldOptions }) => {
    const fieldType: InputModelEnum = options.props.fieldType;

    return `${HostedFieldUrlEnum.LOCAL_SPA_URL}/${PathsHtmlSpaInputs[fieldType]}.html`;
  }
});

const DestroyKushkiHostedFields =()=> zoid.destroyAll();

export { KushkiHostedFields, DestroyKushkiHostedFields };
