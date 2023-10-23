kushki-js-sdk / [Modules](modules.md)

# kushki-js-sdk

kushki-js-sdk.js is our JavaScript library for building payment flows with your own style. You can collect all the card information from your client and generate a token that will safely save and send to your servers.

We make it easier!

## Table of Contents

- [Instalation](#Install)
- [Library setup](#library-setup)
- [Get a payment card token](#get-a-payment-card-token)
  - [Form initialization](#form-initialization)
  - [Styling](#styling)
  - [Events](#events)
  - [OTP Validation](#otp-validation)
  - [Tokenization](#tokenization)

# Install

## &bull; Option 1 - NPM

Install the npm with the following code:

```
npm install --save @kushki/js-sdk
```

## &bull; Option 2 - YARN

Install the yarn with the following code:

```
yarn install @kushki/js-sdk
```

## &bull; Option 3 - CDN

Use a script tag inside your page to add the feature. When adding the following code to your page it will be imported.

```
<script src="https://cdn.kushkipagos.com/js/kushki.min.js"></script>
<script src="https://cdn.kushkipagos.com/js/card.min.js"></script>
```

# Library setup

Begin calling the method init [`init`](../wiki/Kushki.md), With an object of type [`KushkiOptions`](../wiki/Kushki.KushkiOptions.md) 

```ts
import { IKushki, init, KushkiError } from "Kushki";

const kushkiOptions : KushkiOptions = {
  publicCredentialId: '<public-credential-id>', // This corresponds to the public credential of the merchant
  inTest: true
};

const buildKushkiInstance = async () => {
  try {
    const kushkiInstance : Ikushki =  await init(kushkiOptions);
  } catch (e: KushkiError) {
    console.error(e.message);
  }
}
```

# Get a payment card token

## &#xa0;&#xa0;&bull; Form initialization
The following steps describes how you can init a card token instance
#### Define the containers for the hosted fields
Before you call the method [initCardToken](./wiki/modules/Card.md#initcardtoken), you need create div elements for each hosted field
```html
<!DOCTYPE html>
<html lang="en">
<body>
    <form>
        <div id="id_cardholderName"></div>
        <div id="id_cardNumber"></div>
        <div id="id_cvv"></div>
        <div id="id_expirationDate"></div>
    </form>
</body>
</html>
```

Then you must define a [CardOptions](./wiki/interfaces/Card.CardOptions.md) and call the method [initCardToken](./wiki/modules/Card.md#initcardtoken), this will render the hosted fields in your side and the user will be able to enter the card details to later finish the tokenization
```ts
import { IKushki, init, KushkiError } from "Kushki";
import {
  CardOptions,
  ICard,
  initCardToken
} from "Kushki/Card";

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
    //  kushkiInstance must be previusly initialized 
    const cardInstance:  ICard  = await initCardToken(kushkiInstance, options)
  } catch (e: KushkiError) {
    console.error(e.message);
  }
}
```
[More Examples](./wiki/Card.md#examples)

### &#xa0;&#xa0;&bull; Styling
If you want to give custom styles to hosted files, the interface [Styles](./wiki/interfaces/Card.Styles.md) is exposed, so you have two ways:
 - Css Classes.- The interface [CssProperties](./wiki/modules/Card.md#cssproperties) allows to receive a string, so you can configure a CSS class of your site
 - [JSS](https://cssinjs.org/react-jss/?v=v10.3.0) Object.- The interface [CssProperties](./wiki/modules/Card.md#cssproperties) allows to receive an object, so you can configure custom CSS styles

**Notes**: You could combine both options, some attributes of [Styles](./wiki/interfaces/Card.Styles.md) can be classes CSS and others be a object

#### CSS class
You cloud use class CSS from: local CSS file or framework CSS. In this example the classes was declared in local CSS file.

```css
.kushki-hosted-field-label {
    color: red;
}

.kushki-hosted-field-input {
   font-size: 14px;
}
```

#### Define Styles object

```ts
const hostedFieldsStyles : Styles = {
  container: { //set styles to all containers of inpus
    display: "flex",
  },
  input: "kushki-hosted-field-input", //set styles to all inputs of inpus
  label: "kushki-hosted-field-label", //set styles to all labels of inpus
  focus: {
    border: "1px solid #0077ff", //set styles in focus event to all inputs
  },
  cardNumber:  { //overwrite input styles
    color: "red",
    width: "400px",
    "&:focus": { // this way you can configure styles for an specific field for the focus event
      borderColor: "#CD00DA"  //overwrite  focus event styles
    }
  } 
}

//Finally set styles values in Card options object
const options : CardOptions = {
    ...,
    styles: hostedFieldsStyles, //Add new attribute with styles values
    ...
}
```

#### Other related articles
- [Kushki JS - Definition of scopes for attributes of Styles](./wiki/modules/Card.md#definition-of-attributes-scopes-of-styles)
- [Kushki JS - Example.- Custom styles from class css](./wiki/modules/Card.md#custom-styles-from-class-css)
- [Kushki JS - Example.- Custom styles with JSS](./wiki/modules/Card.md#custom-styles-with-jss)
- [Kushki JS - Example.- Pseudo Elements with JSS](./wiki/modules/Card.md#pseudo-elements-with-jss)
- [JSS Documentation](https://cssinjs.org/?v=v10.3.0)
- [CSS Pseudo-elements](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements)

## &#xa0;&#xa0;&bull; Events

### Handling event focus on field
This event is emitted when the field loses focus, more details [Click here](./wiki/interfaces/Card.ICard.md?plain=1#onfieldfocus)
```ts
try {
  cardInstance.onFieldFocus((event: FormValidity) => {
    // Implement your logic to handle the event FormValidity here
    if (event.fields[event.triggeredBy].isValid) {
      console.log("Form valid", event);
    } else {
      console.log("Form invalid", event);
    }
  });
  // On Success, can get onFieldFocus, ex. FormValidity: { isFormValid: true, triggeredBy: cardholderName, fields: Fields}
} catch (error: any) {
  console.error("Catch error on onFieldFocus", error.code, error.message);
}
```

### Handling event blur on field
This event is emitted when the field loses focus, more details [Click here](./wiki/interfaces/Card.ICard.md?plain=1#onfieldblur)
```ts
try {
  cardInstance.onFieldBlur((event: FormValidity) => {
    // Implement your logic to handle the event FormValidity here
    if (event.fields[event.triggeredBy].isValid) {
      console.log("Form valid", event);
    } else {
      console.log("Form invalid", event);
    }
  });
  // On Success, can get onFieldBlur, ex. FormValidity: { isFormValid: true, triggeredBy: cardholderName, fields: Fields}
} catch (error: any) {
  console.error("Catch error on onFieldBlur", error.code, error.message);
}
```

### Handling event submit on field
This event is emitted when the field has submit, more details [Click here](./wiki/interfaces/Card.ICard.md?plain=1#onfieldsubmit)
```ts
try {
  cardInstance.onFieldSubmit((event: FormValidity) => {
    // Implement your logic to handle the event FormValidity here
    if (event.fields[event.triggeredBy].isValid) {
      console.log("Form valid", event);
    } else {
      console.log("Form invalid", event);
    }
  });
  // On Success, can get onFieldSubmit, ex. FormValidity: { isFormValid: true, triggeredBy: cardholderName, fields: Fields}
} catch (error: any) {
  console.error("Catch error on onFieldSubmit", error.code, error.message);
}
```

### Set focus a hosted field
This method asynchronously focus a form field of the specified type, otherwise it will throw an exception, more details [Click here](./wiki/interfaces/Card.ICard.md?plain=1#focus)
```ts
try {
  await cardInstance.focus(FieldTypeEnum.cardholderName);
  // On Success, can focus field, ex. cardholderName focus
} catch (error: any) {
  // On Error, catch response, ex. {code:"E010", message: "Error al realizar focus en el campo"}
  console.error("Catch error on focus field", error.code, error.message);
}
```

### Set Reset a hosted field
This method asynchronously reset a form field of the specified type to its default state, otherwise it will throw an exception, more details [Click here](./wiki/interfaces/Card.ICard.md?plain=1#reset)
```ts
try {
  await cardInstance.reset(FieldTypeEnum.cardholderName);
  // On Success, can reset field, ex. cardholderName empty
} catch (error: any) {
  // On Error, catch response, ex. {code:"E009", message: "Error al limpiar el campo"}
  console.error("Catch error on reset field", error.code, error.message);
}
```

## &#xa0;&#xa0;&bull; OTP Validation

## &#xa0;&#xa0;&bull; Tokenization

To get a card payment token, you should call the [`requestToken`](./wiki/Card.ICard.md#requestToken) method on your card instance that was previously initialized, this method also validates if all the fields are valid, otherwise it will throw an exception

This method returns a [`TokenResponse`](./wiki/Card.TokenResponse.md#TokenResponse) object that you will send to you backend and proceed with the charge of the payment

If the  [`initCardToken`](./wiki/Card.md#initCardToken)  method was configured as subscription you should call the create subscription method on your backend, otherwise you can proceed normally with the charge method for card

### Basic Example
For unique payment or subscription. This method automatically validates all merchant rules like 3DS, OTP or Sift Science
```ts
try {
  const tokenResponse: TokenResponse = await cardInstance.requestToken();
  // On Success, can get card token response, ex. {token: "a2b74b7e3cf24e368a20380f16844d16"}
  console.log("This is a card Token", tokenResponse.token)
} catch (error: any) {
  // On Error, catch response, ex. {code:"E002", message: "Error en solicitud de token"}
  // On Error, catch response, ex. {code:"E007", message: "Error en la validación del formulario"}
  console.error("Catch error on request card Token", error.code, error.message);
}
```

### Deferred Example
If deferred data is generated, you can use this data in the charge of the payment
```ts
try {
  const tokenResponse: TokenResponse = await cardInstance.requestToken();
  // On Success, if deferred data exist can get deferred options
  // For Ecuador, Mexico ex. {token: "a2b74b7e3cf24e368a20380f16844d16", deferred: {creditType: "03", graceMonths: 2, months: 12}}
  // For Chile, Colombia, Peru ex. {token: "a2b74b7e3cf24e368a20380f16844d16", deferred: {months: 12}}
  if(tokenResponse.deferred)
    console.log("This is a deferred options", tokenResponse.deferred)
} catch (error: any) {
  // On Error, catch response
  console.error("Catch error on request card Token", error.code, error.message);
}
```
