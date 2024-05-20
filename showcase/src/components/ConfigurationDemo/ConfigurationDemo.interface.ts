import React from "react";
import { OptionDefaultData } from "../../shared/enums/OptionDefaultData.ts";
import { OptionsCvv } from "../../shared/enums/OptionsCvv.ts";

export interface IConfigurationDemoProps {
  initKushkiInstance: (
    publicMerchantIdDemo: string,
    amountValue: number,
    currencyValue: string,
    isSubscription: boolean,
    isFullResponse: boolean,
    cvvOption: OptionsCvv
  ) => Promise<void>;
  listButtonsActive: IDefaultInformation;
  setListButtonsActive: React.Dispatch<
    React.SetStateAction<IDefaultInformation>
  >;
}

export interface IDefaultInformation {
  threeDomainSecure: boolean;
  otp: boolean;
  approved: boolean;
  declined: boolean;
}

export interface IButtonsDefaultInfoProps {
  buttonActive: IDefaultInformation;
  option: OptionDefaultData;
  label: string;
  setDefaultOptions: (option: keyof IDefaultInformation) => void;
}
