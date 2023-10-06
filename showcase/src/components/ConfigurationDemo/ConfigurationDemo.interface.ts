import React from "react";
import { Currency } from "../../../../types/card_options";
import { OptionDefaultData } from "../../shared/enums/OptionDefaultData.ts";

export interface IConfigurationDemoProps {
  setPublicMerchantIdDemo: React.Dispatch<React.SetStateAction<string>>;
  setIsSubscriptionOption: React.Dispatch<React.SetStateAction<boolean>>;
  isSubscriptionOption: boolean;
  setCurrencyOptions: React.Dispatch<
    React.SetStateAction<Currency | undefined>
  >;
  setAmountOptions: React.Dispatch<React.SetStateAction<number>>;
  initKushkiInstance: () => Promise<void>;
  buttonActive: IDefaultInformation;
  setButtonActive: React.Dispatch<React.SetStateAction<IDefaultInformation>>;
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
  disableButtons: boolean
}
