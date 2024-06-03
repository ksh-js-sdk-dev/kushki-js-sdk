// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as zoid from "@krakenjs/zoid/dist/zoid.frameworks";
import { CardTokenResponse } from "types/card_token_response";
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
        body: object,
        requestPath: string,
        cardTokenHeaders: object,
        isFullResponse: boolean
      ): Promise<CardTokenResponse> =>
        getExports().then((exports: any) => {
          return exports.requestPaymentToken({
            body,
            cardTokenHeaders,
            isFullResponse,
            kushkiInstance,
            requestPath
          });
        }),
      requestSecureDeviceToken: (
        kushkiInstance: IKushki,
        body: DeviceTokenRequest,
        requestPath: string,
        cardTokenHeaders: object
      ): Promise<CardTokenResponse> =>
        getExports().then((exports: any) =>
          exports.requestSecureDeviceToken({
            body,
            cardTokenHeaders,
            kushkiInstance,
            requestPath
          })
        )
    };
  },
  tag: KUSHKI_HOSTED_FIELD_TAG,
  url: (options: { props: FieldOptions }) => {
    const fieldType: InputModelEnum = options.props.fieldType;

    return `${
      options.props.isInTest ? HostedFieldUrlEnum.uat : HostedFieldUrlEnum.prod
    }/${PathsHtmlSpaInputs[fieldType]}.html`;
  }
});

const DestroyKushkiHostedFields = () => zoid.destroyAll();

export { KushkiHostedFields, DestroyKushkiHostedFields };
