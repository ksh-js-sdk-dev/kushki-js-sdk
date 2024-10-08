import { Field, InputTypeEnum, Styles } from "types/card_options";
import { FieldValidity } from "types/card_fields_values";
import { InputModelEnum } from "infrastructure/InputModel.enum.ts";
import { DeferredInputValues } from "types/deferred_input_values";

export type OnPropsCallback = (
  props: (fieldOptions: FieldOptions) => void
) => void;

export interface FieldOptions {
  isInTest: boolean;
  inputType?: InputTypeEnum;
  fieldType: InputModelEnum;
  onProps?: OnPropsCallback;
  brandIcon?: string;
  placeholder?: string;
  hiddenLabel?: string;
  maxCardLength?: number;
  maxLength?: number;
  minLength?: number;
  defaultValue?: string;
  preventAutofill?: boolean;
  label?: string;
  styles?: Styles;
  isRequired?: boolean;
  fields?: {
    cardholderName: Field;
    cardNumber: Field;
    expirationDate: Field;
    cvv?: Field;
    deferred?: Field;
    otp?: Field;
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
