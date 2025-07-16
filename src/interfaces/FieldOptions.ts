import { FieldsMethodTypesEnum } from "infrastructure/FieldEventsEnum.ts";
import { Field, InputTypeEnum, Styles } from "types/card_options";
import {
  InputTypeEnum as CardPayoutInputTypeEnum,
  Field as PayoutField
} from "types/card_payout_options";
import { FieldValidity } from "types/card_fields_values";
import { InputModelEnum } from "infrastructure/InputModel.enum.ts";
import { DeferredInputValues } from "types/deferred_input_values";

export type OnPropsCallback = (
  props: (fieldOptions: FieldOptions) => void
) => void;

export interface FieldOptions {
  isInTest: boolean;
  tokenProcessType?: FieldsMethodTypesEnum;
  inputType?: InputTypeEnum | CardPayoutInputTypeEnum;
  fieldType: InputModelEnum;
  onProps?: OnPropsCallback;
  brandIcon?: string;
  placeholder?: string;
  hiddenLabel?: string;
  maxCardLength?: number;
  maxLength?: number;
  minLength?: number;
  defaultValue?: boolean;
  preventAutofill?: boolean;
  label?: string;
  styles?: Styles;
  isRequired?: boolean;
  fields?: {
    cardholderName: Field | PayoutField;
    cardNumber: Field | PayoutField;
    expirationDate?: Field | PayoutField;
    isSubscription?: Field | PayoutField;
    cvv?: Field | PayoutField;
    deferred?: Field | PayoutField;
    otp?: Field | PayoutField;
  };
  handleOnBlur?: (fieldType: string) => void;
  handleOnFocus?: (fieldType: string) => void;
  handleOnSubmit?: (fieldType: string) => void;
  handleOnValidity?: (
    fieldType: InputModelEnum,
    fieldValidity: FieldValidity
  ) => void;
  handleOnBinChange?: (bin: string) => void;
  handleOnOtpChange?: (code: string) => void;
  handleOnDeferredChange?: (value: DeferredInputValues) => void;
}
