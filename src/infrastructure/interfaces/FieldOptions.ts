import { FieldTypeEnum, InputTypeEnum, Styles } from "types/card_options";
import { FieldValidity } from "types/card_fields_values";
import { InputModelEnum } from "infrastructure/InputModel.enum.ts";
import { DeferredInputValues } from "types/deferred_input_values";

export type OnPropsCallback = (
  props: (fieldOptions: FieldOptions) => void
) => void;

type FnRecipeMessage = (data: object) => void;

export interface IFrameBus {
  emit: (event: string, data: object) => void;
  on: (event: string, fnRecipeMessage: FnRecipeMessage) => void;
}
export interface FieldOptions {
  inputType?: InputTypeEnum;
  fieldType: FieldTypeEnum;
  onProps?: OnPropsCallback;
  onMount?: (fieldType: InputModelEnum, bus: IFrameBus) => void;
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
  handleOnValidity?: (
    fieldType: InputModelEnum,
    fieldValidity: FieldValidity
  ) => void;
  bus?: IFrameBus;
}
