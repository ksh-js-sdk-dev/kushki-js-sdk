import React from "react";
import { OptionDefaultData } from "../../shared/enums/OptionDefaultData.ts";

export interface IConfigurationDemoProps {
  initKushkiInstance: (
    publicMerchantIdDemo: string,
    amountValue: number,
    currencyValue: string,
    isSubscription: boolean
  ) => Promise<void>;
  listButtonsActive: IDefaultInformation;
  setListButtonsActive: React.Dispatch<React.SetStateAction<IDefaultInformation>>;
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
