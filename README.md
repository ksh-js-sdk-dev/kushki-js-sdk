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

# Library setup

Begin calling the method init [`init`](../wiki/Kushki.md), With an object of type [`KushkiOptions`](../wiki/Kushki.KushkiOptions.md) 

```ts
import { IKushki, init, KushkiError } from "Kushki";

const kushkiOptions : KushkiOptions = {
  publicCredentialId: '<public-credential-id>',
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

# Define the containers for the hosted fields
Before you call the method ```initCardToken```, you need create div elements for each hosted field
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

Then you must define a ```CardOptions``` and call the method ```initCardToken```, this will render the hosted fields in your side and the user will be able to enter the card details to later finish the tokenization
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
[More Examples](./wiki/Payment.md)

## &#xa0;&#xa0;&bull; Styling

## &#xa0;&#xa0;&bull; Events

## &#xa0;&#xa0;&bull; OTP Validation

## &#xa0;&#xa0;&bull; Tokenization

To get a card payment token, you should call the [`requestToken`](../wiki/Payment.ICard.md#requestToken) method on your card instance that was previously initialized, this method also validates if all the fields are valid, otherwise it will throw an exception

This method returns a [`TokenResponse`](../wiki/Payment.TokenResponse.md#TokenResponse) object that you will send to you backend and proceed with the charge of the payment

If the  [`initCardToken`](../wiki/Payment.md#initCardToken)  method was configured as subscription you should call the create subscription method on your backend, otherwise you can proceed normally with the charge method for card

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
