import { Kushki, TokenResponse } from "Kushki";
import { CardOptions, Field, CardFieldValues } from "Kushki/card";
import KushkiHostedFields from "../libs/HostedField.ts";
import { ICard } from "../repository/ICard.ts";
import {FieldInstance} from "../types/card_fields_values";

export class Card implements ICard {
  private readonly options: CardOptions;
  private readonly kushkiInstance: Kushki;
  private inputValues:  CardFieldValues;

  private constructor(kushkiInstance: Kushki, options: CardOptions) {
    this.options = this.setDefaultValues(options);
    this.kushkiInstance = kushkiInstance;
    this.inputValues = {};
  }

  public static initCardToken(
    kushkiInstance: Kushki,
    options: CardOptions
  ): Promise<Card> {

    return new Promise<Card>((resolve, reject) => {
      try {
        const card: Card = new Card(kushkiInstance, options);
        card.initFields(options.fields)
            .then(() => {
              card.showContainers();
              resolve(card)
            })
            .catch(
                /* istanbul ignore next */
                (expect) => reject(expect))
      }catch (error){
        reject(error);
      }
    });
  }

  public requestToken(): Promise<TokenResponse> {
    // TODO: remove this console log after to implementation
    console.log(this.options, this.kushkiInstance);

    return Promise.resolve({ token: "replace by token response"});
  }

  private setDefaultValues(options: CardOptions): CardOptions {
    return {
      ...options,
      isSubscription: Boolean(options.isSubscription)
    };
  }

  private  handleOnChange(field: string, value: string){
    this.inputValues = {...this.inputValues, [field]: {...this.inputValues[field], value: value} };
  }

  private handleOnFocus(field: string, value: string){
    field;
    value;
  }

  private handleOnBlur(field: string, value: string){
    field;
    value;
  }
  private initFields(optionsFields: {
    [k: string]: Field;
  }): Promise<void[]>{
    for (const fieldKey in optionsFields) {
      const field = optionsFields[fieldKey]
      const options = { ...field,
        handleOnChange: (field: string, value: string) => this.handleOnChange(field, value),
        handleOnFocus: (field: string, value: string) => this.handleOnFocus(field,value),
        handleOnBlur: (field: string, value: string) => this.handleOnBlur(field,value),
      }

      const hostedField =  KushkiHostedFields(options);

      this.inputValues[field.fieldType] = {
        selector: field.selector,
        hostedField
      }
    }

    this.hideContainers();
    return this.renderFields();
  }

  private hideContainers(){
    this.getContainers()
        .forEach( htmlElement => {
          if(!htmlElement)
            throw new Error("element don't exist")

          htmlElement!.style.cssText += 'display:none'
        })
  }

  private showContainers(){
    this.getContainers()
        .forEach( htmlElement => {
          /* istanbul ignore next */
          if(!htmlElement)
            throw new Error("element don't exist")

          htmlElement!.removeAttribute("style")
        })
  }

  private getContainers(){
    return Object.values<FieldInstance>(this.inputValues)
        .map( fieldInstance  => document.getElementById(`${fieldInstance.selector}`));
  }

  private renderFields = async (): Promise<void[]> => {
    return Promise.all(
        Object.values<FieldInstance>(this.inputValues)
            .map(field => field.hostedField?.render(`#${field.selector}`) as Promise<void>)
        )
  };


}
