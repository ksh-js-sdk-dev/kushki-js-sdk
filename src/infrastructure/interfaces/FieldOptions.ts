import { FieldTypeEnum, InputTypeEnum, Styles } from "types/card_options";
import { FieldValidity } from "types/card_fields_values";
import { InputModelEnum } from "infrastructure/InputModel.enum.ts";
import { DeferredInputValues } from "types/deferred_input_values";

export type OnPropsCallback = (
  props: (fieldOptions: FieldOptions) => void
) => void;
export interface FieldOptions {
  inputType?: InputTypeEnum;
  fieldType: FieldTypeEnum;
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
  globalStyles?: Styles;
  handleOnChange:
    | ((fieldType: string, value: string) => void)
    | ((value: DeferredInputValues) => void);
  handleOnBlur?:
    | ((fieldType: string, value: string) => void)
    | ((value: DeferredInputValues) => void);
  handleOnFocus?:
    | ((fieldType: string, value: string) => void)
    | ((value: DeferredInputValues) => void);
  handleOnKeyUp?:
    | ((fieldType: string, value: string) => void)
    | ((value: DeferredInputValues) => void);
  handleOnValidity?: (
    fieldType: InputModelEnum,
    fieldValidity: FieldValidity
  ) => void;
}
