kushki-js-sdk / [Modules](modules.md)

# kushki-js-sdk

kushki-js-sdk.js is our JavaScript library for building payment flows with your own style. You can collect all the card information from your client and generate a token that will safely save and send that data to your servers.

We make it easier!

## Table of Contents

- [Instalation (instalación con NPM y CDN)](#Install)
- [Library setup (init de la clase Kushki)](#library-setup)
- [Get a payment card token](#get-a-payment-card-token)
  - [Form initialization(initCard de la clase Payment, documentar styles de forma básica)](#form-initialization)
  - [Styling (objeto styles de initCard de la clase Payment con ejemplos de uso)](#styling)
  - [Events (eventos disponibles de la clase Payment, no documentar onOtpValidation)](#events)
  - [OTP Validation (evento onOtpValidation de la clase Payment)](#otp-validation)
  - [Tokenization (requestToken de la clase Payment)](#tokenization)

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
<script src="https://cdn.kushkipagos.com/js/payment/payment.min.js"></script>
```

## &bull; Library setup

Begin creating your IKushki, it will allow you to perform all the functions available in Kushki-js-sdk.

```ts
// Example usage of the init function
const options = {
  apiKey: 'YOUR_API_KEY',
  environment: 'sandbox'
};

init(options)
  .then((kushkiInstance) => {
    // The Kushki payment gateway is now initialized and ready to use.
    // You can call methods like kushkiInstance.processPayment() or kushkiInstance.refundPayment().
  })
  .catch((error) => {
    console.error('Error initializing Kushki:', error);
  });
```

## &bull; Get a payment card token

### &#xa0;&#xa0;&bull; Form initialization
The following steps describes how you can init a card token instance
#### Define the containers for the hosted fields
Before you call the method [initCardToken](./wiki/modules/Payment.md#initcardtoken), you need create div elements for each hosted field
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

Then you must define a [CardOptions](./wiki/interfaces/Payment.CardOptions.md) and call the method [initCardToken](./wiki/modules/Payment.md#initcardtoken), this will render the hosted fields in your side and the user will be able to enter the card details to later finish the tokenization
```ts
import { IKushki, init, KushkiError } from "Kushki";
import {
  CardOptions,
  ICard,
  initCardToken
} from "Kushki/Payment";

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
[More Examples](./wiki/Payment.md#examples)

### &#xa0;&#xa0;&bull; Styl# kushki-js-sdk

kushki-js-sdk.js is our JavaScript library for building payment flows with your own style. You can collect all the card information from your client and generate a token that will safely save and send that data to your servers.

We make it easier!

## Table of Contents

- [Instalation (instalación con NPM y CDN)](#Install)
- [Library setup (init de la clase Kushki)](#library-setup)
- [Get a payment card token](#get-a-payment-card-token)
  - [Form initialization(initCard de la clase Payment, documentar styles de forma básica)](#form-initialization)
  - [Styling (objeto styles de initCard de la clase Payment con ejemplos de uso)](#styling)
  - [Events (eventos disponibles de la clase Payment, no documentar onOtpValidation)](#events)
  - [OTP Validation (evento onOtpValidation de la clase Payment)](#otp-validation)
  - [Tokenization (requestToken de la clase Payment)](#tokenization)

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
<script src="https://cdn.kushkipagos.com/js/payment/payment.min.js"></script>
```

## &bull; Library setup

Begin creating your IKushki, it will allow you to perform all the functions available in Kushki-js-sdk.

```ts
// Example usage of the init function
const options = {
  apiKey: 'YOUR_API_KEY',
  environment: 'sandbox'
};

init(options)
  .then((kushkiInstance) => {
    // The Kushki payment gateway is now initialized and ready to use.
    // You can call methods like kushkiInstance.processPayment() or kushkiInstance.refundPayment().
  })
  .catch((error) => {
    console.error('Error initializing Kushki:', error);
  });
```

## &bull; Get a payment card token

### &#xa0;&#xa0;&bull; Form initialization
The following steps describes how you can init a card token instance
#### Define the containers for the hosted fields
Before you call the method [initCardToken](./wiki/modules/Payment.md#initcardtoken), you need create div elements for each hosted field
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

Then you must define a [CardOptions](./wiki/interfaces/Payment.CardOptions.md) and call the method [initCardToken](./wiki/modules/Payment.md#initcardtoken), this will render the hosted fields in your side and the user will be able to enter the card details to later finish the tokenization
```ts
import { IKushki, init, KushkiError } from "Kushki";
import {
  CardOptions,
  ICard,
  initCardToken
} from "Kushki/Payment";

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
[More Examples](./wiki/Payment.md#examples)

### &#xa0;&#xa0;&bull; Styling
If you want to give custom styles to hosted files, Kushki SDK expose the interface [Styles](./wiki/interfaces/Payment.Styles.md), so you have two ways to set your styles:

- Class Css.- The interface [CssProperties](./wiki/modules/Payment.md#cssproperties) allow received a string, You can put your class CSS
- Object [JSS](https://cssinjs.org/react-jss/?v=v10.3.0).- The interface [CssProperties](./wiki/modules/Payment.md#cssproperties) allow received an object, You can put your object with all CSS properties

**Note**: You could combine both options, some attributes of [Styles](./wiki/interfaces/Payment.Styles.md) can be classes CSS and others be a object.

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
    "&:focus": {
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
- [Kushki JS - Definition of scopes for attributes of Styles](./wiki/modules/Payment.md#definition-of-attributes-scopes-of-styles)
- [Kushki JS - Example.- Custom styles from class css](./wiki/modules/Payment.md#custom-styles-from-class-css)
- [Kushki JS - Example.- Custom styles with JSS](./wiki/modules/Payment.md#custom-styles-with-jss)
- [Kushki JS - Example.- Pseudo Elements with JSS](./wiki/modules/Payment.md#pseudo-elements-with-jss)
- [JSS Documentation](https://cssinjs.org/?v=v10.3.0)
- [CSS Pseudo-elements](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements)

### &#xa0;&#xa0;&bull; Events

### &#xa0;&#xa0;&bull; OTP Validation

### &#xa0;&#xa0;&bull; Tokenization

To get a card payment token, you should call the [`requestToken`](./wiki/Payment.ICard.md) method on your card instance that was previously initialized, this method also validates if all the fields are valid, otherwise it will throw an exception

This method returns a [`TokenResponse`](./wiki/Payment.TokenResponse.md) object that you will send to you backend and proceed with the charge of the payment

If the  [`initCardToken`](./wiki/Payment.md)  method was configured as subscription you should call the create subscription method on your backend, otherwise you can proceed normally with the charge method for card

#### Basic Example
This method automatically validates all merchant rules like 3DS, OTP or Sift Science
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

#### Deferred Example
If deferred data is generated, you can use this data in the charge of the payment
```ts
try {
  const tokenResponse: TokenResponse = await cardInstance.requestToken();
  // On Success, if deferred data exist can get deferred options, ex. {token: "a2b74b7e3cf24e368a20380f16844d16", deferred: {creditType: "03", graceMonths: 2, months: 12}}
  if(tokenResponse.deferred)
    console.log("This is a deferred options", tokenResponse.deferred)
} catch (error: any) {
  // On Error, catch response
  console.error("Catch error on request card Token", error.code, error.message);
}
```
ing

### &#xa0;&#xa0;&bull; Events

### &#xa0;&#xa0;&bull; OTP Validation

### &#xa0;&#xa0;&bull; Tokenization

To get a card payment token, you should call the [`requestToken`](./wiki/Payment.ICard.md) method on your card instance that was previously initialized, this method also validates if all the fields are valid, otherwise it will throw an exception

This method returns a [`TokenResponse`](./wiki/Payment.TokenResponse.md) object that you will send to you backend and proceed with the charge of the payment

If the  [`initCardToken`](./wiki/Payment.md)  method was configured as subscription you should call the create subscription method on your backend, otherwise you can proceed normally with the charge method for card

#### Basic Example
This method automatically validates all merchant rules like 3DS, OTP or Sift Science
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

#### Deferred Example
If deferred data is generated, you can use this data in the charge of the payment
```ts
try {
  const tokenResponse: TokenResponse = await cardInstance.requestToken();
  // On Success, if deferred data exist can get deferred options, ex. {token: "a2b74b7e3cf24e368a20380f16844d16", deferred: {creditType: "03", graceMonths: 2, months: 12}}
  if(tokenResponse.deferred)
    console.log("This is a deferred options", tokenResponse.deferred)
} catch (error: any) {
  // On Error, catch response
  console.error("Catch error on request card Token", error.code, error.message);
}
```
