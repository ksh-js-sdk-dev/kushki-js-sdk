# Module: Payment

## Table of contents

### Methods

- [initCardToken](../wiki/Payment#initcardtoken)

### Types

- [CssProperties](../wiki/Payment#cssproperties)
- [Currency](../wiki/Payment#currency)

### Card Interface

- [ICard](../wiki/Payment.ICard)

### Interfaces

- [Amount](../wiki/Payment.Amount)
- [CardFieldValues](../wiki/Payment.CardFieldValues)
- [CardOptions](../wiki/Payment.CardOptions)
- [CardTokenResponse](../wiki/Payment.CardTokenResponse)
- [DeferredByBinOptionsResponse](../wiki/Payment.DeferredByBinOptionsResponse)
- [DeferredInputValues](../wiki/Payment.DeferredInputValues)
- [DeferredValuesResponse](../wiki/Payment.DeferredValuesResponse)
- [Field](../wiki/Payment.Field)
- [FieldInstance](../wiki/Payment.FieldInstance)
- [FieldValidity](../wiki/Payment.FieldValidity)
- [Fields](../wiki/Payment.Fields)
- [FormValidity](../wiki/Payment.FormValidity)
- [Styles](../wiki/Payment.Styles)
- [TokenResponse](../wiki/Payment.TokenResponse)

### Variables

- [ERRORS](../wiki/Payment#errors)

## Methods

### initCardToken

▸ **initCardToken**(`kushkiInstance`, `options`): `Promise`<[`ICard`](../wiki/Payment.ICard)\>

#### Introduction
Function to init an instance of [ICard](../wiki/Payment.ICard)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `kushkiInstance` | [`IKushki`](../wiki/Kushki.IKushki) | Object that implemented IKushki |
| `options` | [`CardOptions`](../wiki/Payment.CardOptions) | You must define setup of card fields - Define [Amount](../wiki/Payment.Amount) of transaction, [example](#md:basic-setup-to-card-token) - Define [Currency](../wiki/Payment#currency) of transaction, [example](#md:basic-setup-to-card-token) - if transaction is [subscription](../wiki/Payment.CardOptions#issubscription) (default value is false), [example](#md:card-token-to-subscriptions-prevent-autofill-and-custom-fields) - if you want to [prevent autofill](../wiki/Payment.CardOptions#preventautofill) fields (default value is false), [example](#md:card-token-to-subscriptions-prevent-autofill-and-custom-fields) - Set Custom [Fields](../wiki/Payment.Fields), [example](#md:card-token-to-subscriptions-prevent-autofill-and-custom-fields) - Set custom [Styles](../wiki/Payment.Styles), [example](#md:to-start-with-it-necessary-define-style-object) |

#### Returns

`Promise`<[`ICard`](../wiki/Payment.ICard)\>

Promise<ICard> - instance of ICard

**`Throws`**

- if params: `options` or `kushkiInstance` are null or undefined then throw [ERRORS.E012](../wiki/Payment#errors)
 - if the param `options.fields` any field has non-existent selector then throw [ERRORS.E013](../wiki/Payment#errors)

#### Examples
##### Basic setup to Card Token

###### Define the containers for the hosted fields
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
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
- To Enable subscriptions the `isSubscription` flag must be true
- To Enable prevent autofill in fields the `preventAutofill` flag must be true

###### Definition containers in html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
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
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
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
###### To Start with it necessary define style object
```ts
```
###### Then Set basic custom styles from class css
```ts
```
###### (Optional) Set advance custom styles with JSS
```ts
```

**`See`**

[JSS Documentation](https://cssinjs.org/react-jss/?v=v10.3.0)
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
     },
     otp: {
      inputType: "password",
      label: "OTP Verification",
      placeholder: "OTP Verification",
      selector: "id_otp"
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

##### Enable field Deferred and set custom styles to Deferred inputs
Deferred Field has one checkbox and three or one select (It depends on merchant settings). If you need set a custom styles
Kushki SDK expose the following selectors

###### Definition containers in html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
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
###### Selectors to set custom styles to Deferred inputs
```ts
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

#### Defined in

[src/module/Payment.ts:381](https://github.com/ksh-sdk-js/kushki-js-sdk/blob/67f1e3a/src/module/Payment.ts#L381)

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

[src/infrastructure/ErrorEnum.ts:85](https://github.com/ksh-sdk-js/kushki-js-sdk/blob/67f1e3a/src/infrastructure/ErrorEnum.ts#L85)
