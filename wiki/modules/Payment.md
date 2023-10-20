[kushki-js-sdk](../README.md) / [Modules](../modules.md) / Payment

# Module: Payment

## Table of contents

### Methods

- [initCardToken](Payment.md#initcardtoken)

### Types

- [CssProperties](Payment.md#cssproperties)
- [Currency](Payment.md#currency)

### Card Interface

- [ICard](../interfaces/Payment.ICard.md)

### Interfaces

- [Amount](../interfaces/Payment.Amount.md)
- [CardFieldValues](../interfaces/Payment.CardFieldValues.md)
- [CardOptions](../interfaces/Payment.CardOptions.md)
- [CardTokenResponse](../interfaces/Payment.CardTokenResponse.md)
- [DeferredByBinOptionsResponse](../interfaces/Payment.DeferredByBinOptionsResponse.md)
- [DeferredInputValues](../interfaces/Payment.DeferredInputValues.md)
- [DeferredValuesResponse](../interfaces/Payment.DeferredValuesResponse.md)
- [Field](../interfaces/Payment.Field.md)
- [FieldInstance](../interfaces/Payment.FieldInstance.md)
- [FieldValidity](../interfaces/Payment.FieldValidity.md)
- [Fields](../interfaces/Payment.Fields.md)
- [FormValidity](../interfaces/Payment.FormValidity.md)
- [Styles](../interfaces/Payment.Styles.md)
- [TokenResponse](../interfaces/Payment.TokenResponse.md)

### Variables

- [ERRORS](Payment.md#errors)

## Methods

### initCardToken

▸ **initCardToken**(`kushkiInstance`, `options`): `Promise`<[`ICard`](../interfaces/Payment.ICard.md)\>

#### Introduction
Function to init an instance of [ICard](../interfaces/Payment.ICard.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `kushkiInstance` | [`IKushki`](../interfaces/Kushki.IKushki.md) | Object that implemented IKushki |
| `options` | [`CardOptions`](../interfaces/Payment.CardOptions.md) | You must define setup of card fields - Define [Amount](../interfaces/Payment.Amount.md) of transaction, [example](#md:basic-setup-to-card-token) - Define [Currency](Payment.md#currency) of transaction, [example](#md:basic-setup-to-card-token) - if transaction is [subscription](../interfaces/Payment.CardOptions.md#issubscription) (default value is false), [example](#md:card-token-to-subscriptions-prevent-autofill-and-custom-fields) - if you want to [prevent autofill](../interfaces/Payment.CardOptions.md#preventautofill) fields (default value is false), [example](#md:card-token-to-subscriptions-prevent-autofill-and-custom-fields) - Set Custom [Fields](../interfaces/Payment.Fields.md), [example](#md:card-token-to-subscriptions-prevent-autofill-and-custom-fields) - Set custom [Styles](../interfaces/Payment.Styles.md), [example](#md:to-start-with-it-necessary-define-style-object) |

#### Returns

`Promise`<[`ICard`](../interfaces/Payment.ICard.md)\>

Promise<ICard> - instance of ICard

**`Throws`**

- if params: `options` or `kushkiInstance` are null or undefined then throw [ERRORS.E012](Payment.md#errors)
 - if the param `options.fields` any field has non-existent selector then throw [ERRORS.E013](Payment.md#errors)

#### Examples
##### Basic setup to Card Token

###### Define the containers for the hosted fields
```html
<!DOCTYPE html>
<html lang="en">
<body>
    <section>
        <div id="id_cardholderName"></div>
        <div id="id_cardNumber"></div>
        <div id="id_cvv"></div>
        <div id="id_expirationDate"></div>
    </section>
</body>
</html>
```

###### Init card token instance
 - To enable normal card transaction, you need to define an amount, currency and fields. In background this method render the hosted fields
```ts
import { IKushki, init, KushkiError } from "Kushki";
import {
  CardOptions,
  ICard,
  initCardToken
} from "Kushki/Payment";

const kushkiOptions : KushkiOptions = {
  publicCredentialId: 'public-merchant-id',
  inTest: true
};

const options : CardOptions = {
  amount: {
     iva: 1,
     subtotalIva: 10,
     subtotalIva0: 10
  },
  currency: "USD",
  fields: {
      cardholderName: {
         selector: "id_cardholderName"
      },
      cardNumber: {
         selector: "id_cardNumber"
      },
      cvv: {
         selector: "id_cvv"
      },
     expirationDate: {
         selector: "id_expirationDate"
     }
  }
}

const buildCardInstance = async () => {
 try {
     const kushkiInstance : Ikushki =  await init(kushkiOptions);
      const cardInstance:  ICard  = await initCardToken(kushkiInstance, options)
 } catch (e: KushkiError) {
      console.error(e.message);
 }
}
```

##### Card Token to subscriptions, prevent autofill and custom fields

###### Definition containers in html
```html
<!DOCTYPE html>
<html lang="en">
<body>
    <section>
        <div id="id_cardholderName"></div>
        <div id="id_cardNumber"></div>
        <div id="id_cvv"></div>
        <div id="id_expirationDate"></div>
    </section>
</body>
</html>
```

###### Init card token instance
- To enable subscription transactions the `isSubscription` flag must be true
- To enable prevent autofill in fields the `preventAutofill` flag must be true

```ts
import { IKushki, init, KushkiError } from "Kushki";
import {
  CardOptions,
  ICard,
  initCardToken
} from "Kushki/Payment";

const kushkiOptions : KushkiOptions = {
  publicCredentialId: 'public-merchant-id',
  inTest: true
};

const options : CardOptions = {
  amount: {
     iva: 1,
     subtotalIva: 10,
     subtotalIva0: 10
  },
  currency: "USD",
  fields: {
      cardholderName: {
         inputType: "text",
         label: "Cardholder Name",
         placeholder: "Cardholder Name",
         selector: "id_cardholderName"
      },
      cardNumber: {
         inputType: "number",
         label: "Card Number",
         placeholder: "Card Number",
         selector: "id_cardNumber"
      },
      cvv: {
         inputType: "password",
         label: "CVV",
         placeholder: "CVV",
         selector: "id_cvv"
      },
     expirationDate: {
         inputType: "text",
         label: "Expiration Date",
         placeholder: "Expiration Date",
         selector: "id_expirationDate"
     }
  },
  isSubscription: true, //To Enable subscriptions this flag must be true
  preventAutofill: true, //To Enable prevent autofill in fields this flag must be true
}

const buildCardInstance = async () => {
 try {
     const kushkiInstance : Ikushki =  await init(kushkiOptions);
      const cardInstance:  ICard  = await initCardToken(kushkiInstance, options)
 } catch (e: KushkiError) {
      console.error(e.message);
 }
}
```

#####  Enable field OTP and set custom styles

###### Definition containers in html
```html
<!DOCTYPE html>
<html lang="en">
<body>
    <section>
        <div id="id_cardholderName"></div>
        <div id="id_cardNumber"></div>
        <div id="id_cvv"></div>
        <div id="id_expirationDate"></div>
        <div id="id_otp"></div>
    </section>
</body>
</html>
```
###### Definition Custom Styles
If you want to apply custom styles to hosted files, Kushki SDK expose the interface [Styles](../interfaces/Payment.Styles.md), so you have two ways to set your styles:
 - Css Classes.- The interface [CssProperties](Payment.md#cssproperties) allows to receive a string, so you can configure a CSS class of your site
 - [JSS](https://cssinjs.org/react-jss/?v=v10.3.0) Object.- The interface [CssProperties](Payment.md#cssproperties) allows to receive an object, so you can configure custom CSS styles

 **Notes**:
 - You could combine both options, some attributes of [Styles](../interfaces/Payment.Styles.md) can be classes CSS and others be a object

###### Definition of scopes for attributes of [Styles](../interfaces/Payment.Styles.md)

 Global Scopes
- [input](../interfaces/Payment.Styles.md#input): set styles to all inputs except in deferred input
- [label](../interfaces/Payment.Styles.md#label): set styles to all labels of inputs except in deferred input
- [container](../interfaces/Payment.Styles.md#container): set styles to all containers of inputs except in deferred input
- [focus](../interfaces/Payment.Styles.md#focus): set styles to state focus of inputs except in deferred input
- [valid](../interfaces/Payment.Styles.md#valid):  set styles to state valid of inputs
- [invalid](../interfaces/Payment.Styles.md#invalid):  set styles to state invalid of inputs
Specific Hosted Field Input
- [cardholderName](../interfaces/Payment.Styles.md#cardholdername): this styles overwrite the values of input styles only to cardholderName input
- [cardNumber](../interfaces/Payment.Styles.md#cardnumber): this styles overwrite the values of input styles only to cardNumber input
- [expirationDate](../interfaces/Payment.Styles.md#expirationdate): this styles overwrite the values of input styles only to expirationDate input
- [cvv](../interfaces/Payment.Styles.md#cvv): this styles overwrite the values of input styles only to cvv input
- [otp](../interfaces/Payment.Styles.md#otp): this styles overwrite the values of input styles only to otp input
- [deferred](../interfaces/Payment.Styles.md#deferred): this styles overwrite default styles, and set styles to their subcomponents with custom selectors, [more details](#md:selectors-to-set-custom-styles-to-deferred-inputs)

###### Custom styles from class css

In a CSS file, define your class or classes
```css
.kushki-hosted-field-label {
    color: red;
}

.kushki-hosted-field-input {
   font-size: 14px;
}

.kushki-hosted-field-cardNumber {
   color: green;
}

.kushki-hosted-field-container {
   display: flex;
}
```
###### Define [Styles](../interfaces/Payment.Styles.md) object

```ts
const hostedFieldsStyles : Styles = {
    container: "kushki-hosted-field-container",
    input: "kushki-hosted-field-input",
    label: "kushki-hosted-field-label",
    cardNumber: "kushki-hosted-field-cardNumber", //overwrite input styles
}
```
###### Custom styles with JSS
```ts
const hostedFieldsStyles : Styles = {
  container: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    position: "relative"
  },
  input: {
    fontFamily: "Arial,Verdana,Tahoma",
    width: "300px"
  },
  focus: {
    border: "1px solid #0077ff", //set styles in focus event to all inputs
  },
  cardNumber:  { //overwrite input styles
    color: "red",
    width: "400px"
  }
}
```
###### Pseudo Elements with JSS
```ts
const hostedFieldsStyles : Styles = {
  container: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    position: "relative"
  },
  input: {
    fontFamily: "Arial,Verdana,Tahoma",
    width: "300px"
  },
  focus: {
    border: "1px solid #0077ff", //set styles in focus event to all inputs
  }
  cardNumber:  { //overwrite input styles
    color "red",
    width: "400px",
    "&:focus": { // this way you can configure styles for an specific field for the focus event
      borderColor: "#CD00DA"  //overwrite  focus event styles
    }
  }
}
```

###### Init card token instance
- To Enable field OTP, you need define the attribute `CardOptions.fields.otp`
```ts
import { IKushki, init, KushkiError } from "Kushki";
import {
  CardOptions,
  ICard,
  initCardToken
} from "Kushki/Payment";

const kushkiOptions : KushkiOptions = {
  publicCredentialId: 'public-merchant-id',
  inTest: true
};

const options : CardOptions = {
  amount: {
     iva: 1,
     subtotalIva: 10,
     subtotalIva0: 10
  },
  currency: "USD",
  fields: {
      cardholderName: {
         selector: "id_cardholderName"
      },
      cardNumber: {
         selector: "id_cardNumber"
      },
      cvv: {
         selector: "id_cvv"
      },
     expirationDate: {
         selector: "id_expirationDate"
     },
     otp: { // Add new attribute with otp field values
      inputType: "password",
      label: "OTP Verification",
      placeholder: "OTP Verification",
      selector: "id_otp"
    }
  },
  styles: hostedFieldsStyles // Add new attribute with styles values
}

const buildCardInstance = async () => {
 try {
     const kushkiInstance : Ikushki =  await init(kushkiOptions);
      const cardInstance:  ICard  = await initCardToken(kushkiInstance, options)
 } catch (e: KushkiError) {
      console.error(e.message);
 }
}
```

##### Enable field Deferred and set custom styles to Deferred inputs
Deferred Field has one checkbox and three or one select (It depends on merchant settings). If you need set a custom styles
Merchants from Ecuador or Mexico have three selects: credit type, months and grace months; nevertheless, merchants from Colombia, Peru and Chile have one select: months

Kushki SDK expose the following selectors

###### Definition containers in html
```html
<!DOCTYPE html>
<html lang="en">
<body>
    <section>
        <div id="id_cardholderName"></div>
        <div id="id_cardNumber"></div>
        <div id="id_cvv"></div>
        <div id="id_expirationDate"></div>
        <div id="id_deferred"></div>
    </section>
</body>
</html>
```
###### Selectors to set custom styles to Deferred input
Deferred input has styles by default, but Kushki SDK allow custom each element

Follow description define scope of each custom selector
**Apply Styles to Select elements**
- ```&:valid```: set styles when one option was selected
- ```&:invalid``` set styles when any option wasn't selected and this select is required
- ```&label``` set styles to all labels of selects
- ```&label:invalid``` set styles to all labels when any option wasn't selected and this select is required

**Apply Styles to checkbox element**
- ```&#ksh-deferred-checkbox```: this selector allow to change color of border, background, box shadow and any more in checkbox
- ```&#ksh-deferred-checkbox:checked``` this selector allow to change color of border, background, box shadow, color of checkmark and any more in checkbox
- ```&#ksh-deferred-checkbox>label``` this selector allow custom the label of checkbox

**Apply Styles to containers elements**
- ```&#ksh-deferred-creditType```: this selector allow change width, high and others properties of 'credit type' container. Just enable to merchants of Ecuador and Mexico
- ```&#ksh-deferred-months```: this selector allow change width, high and others properties of 'months' container
- ```&#ksh-deferred-graceMonths```: this selector allow change width, high and others properties of 'grace months' container. Just enable to merchants of Ecuador and Mexico

```ts
const hostedFieldsStyles : Styles = {
...
 deferred: {
  //root properties are applied to selects elements
  color: "#56048c",
  borderColor: "rgba(0,173,55,0.4)",

  //Applying Styles to Select elements
  "&:valid": {
    borderColor: "rgba(0,192,176,0.4)",
  },

  "&:invalid": {
    color: "#fffb00",
    borderColor: "#fffb00",
  },

  "&label": {
    color: "#56048c"
  },

  "&label:invalid": {
    color: "#fffb00"
  },

  //Applying Styles to checkbox element
  "&#ksh-deferred-checkbox": {
    backgroundColor: "#ffa400",
    borderColor: "#083198"
  },

  "&#ksh-deferred-checkbox:checked": {
    backgroundColor: "#1b9600",
    borderColor: "#FFF"
  },

  "&#ksh-deferred-checkbox>label": {
    color: "#56048c"
  },

 //Applying Styles to containers elements
 "&#ksh-deferred-creditType": {
   width: "290px"
 },
 "&#ksh-deferred-graceMonths": {
   width: "140px"
 },
 "&#ksh-deferred-months": {
   width: "140px"
 },
}
..
}
```

##### Init card token instance
- To Enable field deferred, you need define the attribute `CardOptions.fields.deferred`

```ts
import { IKushki, init, KushkiError } from "Kushki";
import {
  CardOptions,
  ICard,
  initCardToken
} from "Kushki/Payment";

const kushkiOptions : KushkiOptions = {
  publicCredentialId: 'public-merchant-id',
  inTest: true
};

const options : CardOptions = {
  amount: {
     iva: 1,
     subtotalIva: 10,
     subtotalIva0: 10
  },
  currency: "USD",
  fields: {
      cardholderName: {
         selector: "id_cardholderName"
      },
      cardNumber: {
         selector: "id_cardNumber"
      },
      cvv: {
         selector: "id_cvv"
      },
     expirationDate: {
         selector: "id_expirationDate"
     },
    deferred: {
      deferredInputs: {
        deferredCheckbox: {
          label: "I want to pay in installments"
        },
        deferredType: {
          hiddenLabel: "deferred_Type",
          label: "Deferred Type",
          placeholder: "deferred Type"
        },
        graceMonths: {
          hiddenLabel: "grace_months",
          label: "Grace Months",
          placeholder: "grace months"
        },
        months: {
          hiddenLabel: "months",
          label: "Months",
          placeholder: "months"
        }
      },
      selector: "id_deferred"
    },
  },
  styles: hostedFieldsStyles //Add new attribute with styles values
}

const buildCardInstance = async () => {
 try {
     const kushkiInstance : Ikushki =  await init(kushkiOptions);
      const cardInstance:  ICard  = await initCardToken(kushkiInstance, options)
 } catch (e: KushkiError) {
      console.error(e.message);
 }
}
```

#### Defined in

[src/module/Payment.ts:524](https://github.com/ksh-js-sdk-dev/kushki-js-sdk/blob/9405e54/src/module/Payment.ts#L524)

## Types

### CssProperties

Ƭ **CssProperties**: { `[k: string]`: `any`; `-moz-appearance?`: `string` ; `-moz-box-shadow?`: `string` ; `-moz-osx-font-smoothing?`: `string` ; `-moz-tap-highlight-color?`: `string` ; `-moz-transition?`: `string` ; `-webkit-appearance?`: `string` ; `-webkit-box-shadow?`: `string` ; `-webkit-font-smoothing?`: `string` ; `-webkit-tap-highlight-color?`: `string` ; `-webkit-transition?`: `string` ; `appearance?`: `string` ; `background?`: `string` ; `border?`: `string` ; `box-shadow?`: `string` ; `color?`: `string` ; `direction?`: `string` ; `font?`: `string` ; `font-family?`: `string` ; `font-size?`: `string` ; `font-size-adjust?`: `string` ; `font-stretch?`: `string` ; `font-style?`: `string` ; `font-variant?`: `string` ; `font-variant-alternates?`: `string` ; `font-variant-caps?`: `string` ; `font-variant-east-asian?`: `string` ; `font-variant-ligatures?`: `string` ; `font-variant-numeric?`: `string` ; `font-weight?`: `string` ; `letter-spacing?`: `string` ; `line-height?`: `string` ; `margin?`: `string` ; `margin-bottom?`: `string` ; `margin-left?`: `string` ; `margin-right?`: `string` ; `margin-top?`: `string` ; `opacity?`: `string` ; `outline?`: `string` ; `padding?`: `string` ; `padding-bottom?`: `string` ; `padding-left?`: `string` ; `padding-right?`: `string` ; `padding-top?`: `string` ; `text-align?`: `string` ; `text-shadow?`: `string` ; `transition?`: `string`  } \| `string`

#### Defined in

types/card_options.d.ts:10

___

### Currency

Ƭ **Currency**: ``"USD"`` \| ``"COP"`` \| ``"CLP"`` \| ``"UF"`` \| ``"PEN"`` \| ``"MXN"`` \| ``"CRC"`` \| ``"GTQ"`` \| ``"HNL"`` \| ``"NIO"`` \| ``"BRL"``

#### Defined in

types/card_options.d.ts:6

## Variables

### ERRORS

• `Const` `Readonly` **ERRORS**: `KushkiErrors`

Errors List of SDK

```
export const ERRORS = {
  E001: {
    code: "E001",
    message: "Error en solicitud de bin"
  },
  E002: {
    code: "E002",
    message: "Error en solicitud de token"
  },
  E003: {
    code: "E003",
    message: "Error en solicitud de datos del comercio"
  },
  E004: {
    code: "E004",
    message: "Error en solicitud de JWT"
  },
  E005: {
    code: "E005",
    message: "Campos 3DS inválidos"
  },
  E006: {
    code: "E006",
    message: "Error en solicitud de validación de token"
  },
  E007: {
    code: "E007",
    message: "Error en la validación del formulario"
  },
  E008: {
    code: "E008",
    message: "Error en la validación de OTP"
  },
  E009: {
    code: "E009",
    message: "Error al limpiar el campo"
  },
  E010: {
    code: "E010",
    message: "Error al realizar focus en el campo"
  },
  E011: {
    code: "E011",
    message: "Error en inicializacion de la libreria"
  },
  E012: {
    code: "E012",
    message: "Error en inicialización de campos"
  },
  E013: {
    code: "E013",
    message: "El Id del contenedor de un input no fue encontrado"
  }
}
```

#### Defined in

[src/infrastructure/ErrorEnum.ts:85](https://github.com/ksh-js-sdk-dev/kushki-js-sdk/blob/9405e54/src/infrastructure/ErrorEnum.ts#L85)
