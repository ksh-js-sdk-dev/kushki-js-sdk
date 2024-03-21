# kushki-js-sdk

kushki-js-sdk.js is our JavaScript library for building payment flows with your own style. You can collect all the card information from your client and generate a token that will safely save and send to your servers.

We make it easier!

## Table of Contents

- [Instalation](#install)
- [Library setup](#library-setup)
- [Get a payment card token](#get-a-payment-card-token)
  - [Form initialization](#form-initialization)
  - [Styling](#styling)
  - [Events](#events)
  - [OTP Validation](#otp-validation)
  - [Tokenization](#tokenization)
- [Recurring Card Payment (Subscriptions)](#recurring-card-payment)
  - [Get Device Token](#get-device-token)
- [Transfer Transactions](#transfer-transactions)
  - [Request Bank List](#request-bank-list)
- [Merchant Methods](#merchant-methods)
  - [Request Commission Configuration](#request-commission-configuration)
- [AntiFraud Methods](#antifraud-methods)
  - [Request Secure Init](#request-secure-init)
  - [Request validate 3DS](#request-validate-3ds)

# Install <a name="install"></a>

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

# Library setup <a name="library-setup"></a>

Begin calling the method init [`init`](https://ksh-js-sdk-dev.github.io/kushki-js-sdk/functions/Kushki.init.html#init), With an object of type [`KushkiOptions`](https://ksh-js-sdk-dev.github.io/kushki-js-sdk/interfaces/Kushki.KushkiOptions.html) 

```ts
import { IKushki, init, KushkiError } from "@kushki/js-sdk";

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

# Get a payment card token <a name="get-a-payment-card-token"></a>

## &#xa0;&#xa0;&bull; Form initialization  <a name="form-initialization"></a>
The following steps describes how you can init a card token instance
#### Define the containers for the hosted fields
Before you call the method [initCardToken](https://ksh-js-sdk-dev.github.io/kushki-js-sdk/functions/Card.initCardToken.html), you need create div elements for each hosted field
```html
<!DOCTYPE html>
<html lang="en">
<body>
    <form>
        <div id="cardholderName_id"></div>
        <div id="cardNumber_id"></div>
        <div id="cvv_id"></div>
        <div id="expirationDate_id"></div>
    </form>
</body>
</html>
```

Then you must define a [CardOptions](https://ksh-js-sdk-dev.github.io/kushki-js-sdk/interfaces/Card.CardOptions.html) and call the method [initCardToken](https://ksh-js-sdk-dev.github.io/kushki-js-sdk/functions/Card.initCardToken.html), this will render the hosted fields in your side and the user will be able to enter the card details to later finish the tokenization
```ts
import { IKushki, init, KushkiError } from "@kushki/js-sdk";
import {
  CardOptions,
  ICard,
  initCardToken
} from "@kushki/js-sdk/Card";

const options : CardOptions = {
  amount: {
    iva: 1,
    subtotalIva: 10,
    subtotalIva0: 10
  },
  currency: "USD",
  fields: {
    cardholderName: {
      selector: "cardholderName_id"
    },
    cardNumber: {
      selector: "cardNumber_id"
    },
    cvv: {
      selector: "cvv_id"
    },
    expirationDate: {
      selector: "expirationDate_id"
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
[More Examples](https://ksh-js-sdk-dev.github.io/kushki-js-sdk/functions/Card.initCardToken.html#md:examples)

### &#xa0;&#xa0;&bull; Styling <a name="styling"></a>
If you want to give custom styles to hosted files, the interface [Styles](https://ksh-js-sdk-dev.github.io/kushki-js-sdk/interfaces/Card.Styles.html) is exposed, so you have two ways:
 - Css Classes.- The interface [CssProperties](https://ksh-js-sdk-dev.github.io/kushki-js-sdk/types/Card.CssProperties.html) allows to receive a string, so you can configure a CSS class of your site
 - [JSS](https://cssinjs.org/react-jss/?v=v10.3.0) Object.- The interface [CssProperties](https://ksh-js-sdk-dev.github.io/kushki-js-sdk/types/Card.CssProperties.html) allows to receive an object, so you can configure custom CSS styles

**Notes**: You could combine both options, some attributes of [Styles](https://ksh-js-sdk-dev.github.io/kushki-js-sdk/interfaces/Card.Styles.html) can be classes CSS and others be a object

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
- [Kushki JS - Definition of scopes for attributes of Styles](https://ksh-js-sdk-dev.github.io/kushki-js-sdk/functions/Card.initCardToken.html#md:definition-of-scopes-for-attributes-of-styles)
- [Kushki JS - Example.- Custom styles from class css](https://ksh-js-sdk-dev.github.io/kushki-js-sdk/functions/Card.initCardToken.html#md:custom-styles-from-class-css)
- [Kushki JS - Example.- Custom styles with JSS](https://ksh-js-sdk-dev.github.io/kushki-js-sdk/functions/Card.initCardToken.html#md:custom-styles-with-jss)
- [Kushki JS - Example.- Pseudo Elements with JSS](https://ksh-js-sdk-dev.github.io/kushki-js-sdk/functions/Card.initCardToken.html#md:pseudo-elements-with-jss)
- [JSS Documentation](https://cssinjs.org/?v=v10.3.0)
- [CSS Pseudo-elements](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements)

## &#xa0;&#xa0;&bull; Events <a name="events"></a>

### Handling event focus on field
This event is emitted when the field focus, more details [Click here](https://ksh-js-sdk-dev.github.io/kushki-js-sdk/interfaces/Card.ICard.html#onFieldFocus)
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
This event is emitted when the field loses focus, more details [Click here](https://ksh-js-sdk-dev.github.io/kushki-js-sdk/interfaces/Card.ICard.html#onFieldBlur)
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
This event is emitted when the field has submit, more details [Click here](https://ksh-js-sdk-dev.github.io/kushki-js-sdk/interfaces/Card.ICard.html#onFieldSubmit)
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

### Handling event validity on field
This event is emitted when the field validity changes, more details [Click here](https://ksh-js-sdk-dev.github.io/kushki-js-sdk/interfaces/Card.ICard.html#onFieldValidity)
```ts
try {
  cardInstance.onFieldValidity((event: FormValidity) => {
    // Implement your logic to handle the event FormValidity here
    if (event.fields[event.triggeredBy].isValid) {
      console.log("Form valid", event);
    } else {
      console.log("Form invalid", event);
    }
  });
  // On Success, can get onFieldValidity, ex. FormValidity: { isFormValid: true, triggeredBy: cardholderName, fields: Fields}
} catch (error: any) {
  console.error("Catch error on onFieldSubmit", error.code, error.message);
}
```

### Handling get form validity of all hosted fields
This event is emitted when the field validity changes, more details [Click here](https://ksh-js-sdk-dev.github.io/kushki-js-sdk/interfaces/Card.ICard.html#getFormValidity)
```ts
try {
    cardInstance.getFormValidity((event: FormValidity) => {
      // Implement your logic to handle the event FormValidity here
      if (event.fields[event.triggeredBy].isValid) {
        console.log("Form valid", event);
      } else {
        console.log("Form invalid", event);
      }
    });
  // On Success, can get FormValidity, ex. FormValidity: { isFormValid: true, triggeredBy: cardholderName, fields: Fields}   *  } catch (error: any) {
     console.error("Catch error on getFormValidity", error.code, error.message);
} catch (error: any) {
  console.error("Catch error on onFieldFocus", error.code, error.message);
}
 ```

### Set focus a hosted field
This method asynchronously focus a form field of the specified type, otherwise it will throw an exception, more details [Click here](https://ksh-js-sdk-dev.github.io/kushki-js-sdk/interfaces/Card.ICard.html#focus)
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
This method asynchronously reset a form field of the specified type to its default state, otherwise it will throw an exception, more details [Click here](https://ksh-js-sdk-dev.github.io/kushki-js-sdk/interfaces/Card.ICard.html#reset)
```ts
try {
  await cardInstance.reset(FieldTypeEnum.cardholderName);
  // On Success, can reset field, ex. cardholderName empty
} catch (error: any) {
  // On Error, catch response, ex. {code:"E009", message: "Error al limpiar el campo"}
  console.error("Catch error on reset field", error.code, error.message);
}
```

## &#xa0;&#xa0;&bull; OTP Validation <a name="otp-validation"></a>

If you need validate OTP code, you can use method [`onOTPValidation`](https://ksh-js-sdk-dev.github.io/kushki-js-sdk/interfaces/Card.ICard.html#onOTPValidation) on your card instance.

This method return three callbacks (onSuccess, onError and onRequired), that will allow you to identify the OTP validation status in the hosted field.

### This is an example to call otpValidation

```ts
 try {
  cardInstance.onOTPValidation(
          () => {
            // On required callback, is executed when flow requestToken need validate OTP.
            console.log("You should implement logic for continue charge process.")
          },
          (error) => {
            // On error callback, is executed when validation OTP is incorrect. You will receive an error with code E008.
            console.error("Catch error", error.code, error.message);
          },
          () => {
            // On success callback, is executed when validation OTP is success.
            console.log("You should implement logic for continue charge process after validation OTP success")
          }
  );
} catch (error: any) {
  console.error("Catch error on onOTPValidation", error.code, error.message);
}
```

## Tokenization <a name="tokenization"></a>

To get a card payment token, you should call the [`requestToken`](https://ksh-js-sdk-dev.github.io/kushki-js-sdk/interfaces/Card.ICard.html#requestToken) method on your card instance that was previously initialized, this method also validates if all the fields are valid, otherwise it will throw an exception

This method returns a [`TokenResponse`](https://ksh-js-sdk-dev.github.io/kushki-js-sdk/interfaces/Card.TokenResponse.html) object that you will send to you backend and proceed with the charge of the payment

If the  [`initCardToken`](https://ksh-js-sdk-dev.github.io/kushki-js-sdk/functions/Card.initCardToken.html)  method was configured as subscription you should call the create subscription method on your backend, otherwise you can proceed normally with the charge method for card

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
#  Recurring Card Payment (Subscriptions)<a name="recurring-card-payment"></a>
## Get Device Token <a name="get-device-token"></a>
After use [payment card token](#get-a-payment-card-token) to create a subscription. Kushki securely store a customer’s card details, and then allow them to make one-click Payment or also called on-demand subscription, to speed up the checkout process.

Storing card details, a subscription identifier will be created for the card. Then, with that identifier and Kushki instance that was previously initialized with [`init`](#library-setup) method, you will be able to get a Device Token.

This method automatically validates all merchant rules like 3DS or Sift Science. More details [Click here](https://ksh-js-sdk-dev.github.io/kushki-js-sdk/functions/Card.requestDeviceToken.html)
### Example

```ts
import { init, IKushki } from "@kushki/js-sdk";
import { requestDeviceToken, DeviceTokenRequest, TokenResponse } from "@kushki/js-sdk/Card";

const onRequestDeviceToken = async () => {
    try {
      const kushkiInstance: IKushki = await init({
        inTest: true,
        publicCredentialId: "merchantId"
      });
      const body: DeviceTokenRequest={
        subscriptionId: "subscriptionId"
      }

      const response: TokenResponse = await requestDeviceToken(kushkiInstance, body);
      
      // On Success, can get device token for one-click payment, ex. {"token":"31674e78f88b41ffaf47998151fb465d"}
      console.log(response);
    } catch (error: any) {
      // On Error, catch response, ex. {code:"E017", message: "Error en solicitud de Token de subscripción bajo demanda"}
      console.error(error.message);
    }
  };
```

#  Transfer Transactions <a name="transfer-transactions"></a>
## Request Bank List <a name="request-bank-list"></a>
To get Bank List for Transfer transactions, you should call [`requestBankList`](https://ksh-js-sdk-dev.github.io/kushki-js-sdk/functions/Transfer.requestBankList.html) method with Kushki instance that was previously initialized with [`init`](#library-setup) method

This method is useful in situations where the processor requires a list of banks and allows the customer to choose a specific bank to make their payment., more details [Click here](https://ksh-js-sdk-dev.github.io/kushki-js-sdk/functions/Transfer.requestBankList.html)
### Example

```ts
import { init } from "@kushki/js-sdk";
import { requestBankList } from "@kushki/js-sdk/Transfer";

const onRequestBankList = async () => {
    try {
      const kushkiInstance = await init({
        inTest: true,
        publicCredentialId: "merchantId"
      });

      const response = await requestBankList(kushkiInstance);
      
      // On Success, can get list of banks, ex. [{"code":"0","name":"A continuación seleccione su banco"},{"code":"XXX1","name":"BANCO DE BOGOTA"},{"code":"XXX2","name":"BANCO POPULAR"},{"code":"XXX6","name":"BANCO ITAU"}]
      console.log(response);
    } catch (error: any) {
      // On Error, catch response, ex. {code:"E014", message: "Error en solicitud de lista de bancos"}
      console.error(error.message);
    }
  };
```

#  Merchant Methods <a name="merchant-methods"></a>
## Request Commission Configuration <a name="request-commission-configuration"></a>
To get merchant commission configuration, you should call [`requestCommissionConfiguration`](https://ksh-js-sdk-dev.github.io/kushki-js-sdk/functions/Merchant.requestCommissionConfiguration.html) method with Kushki instance that was previously initialized with [`init`](#library-setup) method
and the object [`CommissionConfigurationRequest`](https://ksh-js-sdk-dev.github.io/kushki-js-sdk/interfaces/Merchant.CommissionConfigurationRequest.html)

This method is useful when you need to get the information related to the commission charge configured for a specific merchant, more details [Click here](https://ksh-js-sdk-dev.github.io/kushki-js-sdk/functions/Merchant.requestCommissionConfiguration.html)
### Example

```ts
import { init } from "@kushki/js-sdk";
import {CommissionConfigurationRequest, requestCommissionConfiguration } from "@kushki/js-sdk/Merchant";

const onRequestCommissionConfiguration = async () => {
    try {
      const kushkiInstance = await init({
        inTest: true,
        publicCredentialId: "merchantId"
      });
      const body: CommissionConfigurationRequest = {
        totalAmount: 10,
        currency: "USD"
      };

      const response = await requestCommissionConfiguration(kushkiInstance, body);

      // On Success, can get commission config,
      // ex. {"commissionMerchantName":"Name","parentMerchantName":"Name","amount":{"currency":"USD","iva":0.45,"subtotalIva":2.5,"subtotalIva0":0},"merchantId":"XXX","totalAmount":2.95}
      console.log(response);
    } catch (error: any) {
      // On Error, catch response, ex. {code:"E015", message: "Error en solicitud de configuración de comisión"}
      console.error(error.message);
    }
  };
```
#  AntiFraud Methods <a name="antifraud-methods"></a>
## Request Secure Init <a name="request-secure-init"></a>
Before using [payment card token](https://ksh-js-sdk-dev.github.io/kushki-js-sdk/docs/functions/Card.initCardToken.html) to create a token. Kushki securely communicates with Cardinal 3DS to validate the card number in the checkout process.
This method is useful when is done by API.
This method will return a jwt identifier that will be created for the card and some information might be stored in the browser session. More details [Click here](https://ksh-js-sdk-dev.github.io/kushki-js-sdk/docs/functions/Antifraud.requestSecureInit.html)
### Example

```ts
import { init, IKushki } from "@kushki/js-sdk";
import { requestSecureInit, SecureInitRequest, SecureInitResponse } from "@kushki/js-sdk/Card";

const onRequestSecureInit = async () => {
  try {
    const kushkiInstance: IKushki = await init({
      inTest: true,
      publicCredentialId: merchantId
    });
    const secureInitRequest: SecureInitRequest = {
      card: {
        number: cardNumber
      }
    };

    const secureInitResponse: SecureInitResponse = await requestSecureInit(
            kushkiInstance,
            secureInitRequest
    );
    console.log(secureInitResponse);

  } catch (error: any) {
    console.log(error)
  } 
};
```

## Request Validate 3DS <a name="request-validate-3ds"></a>
Before using the validate 3DS method you need to create a init secure jwt with [requestSecureInit](https://ksh-js-sdk-dev.github.io/kushki-js-sdk/docs/functions/Antifraud.requestSecureInit.html) method. 
And after using [payment card token](https://ksh-js-sdk-dev.github.io/kushki-js-sdk/docs/functions/Card.initCardToken.html) to create a token. Kushki securely communicates with Cardinal 3DS to validate the transaction in the checkout process.

This method will return a token response body when the validation is successful. More details [Click here](https://ksh-js-sdk-dev.github.io/kushki-js-sdk/docs/functions/Antifraud.requestValidate3DS.htmll)
### Example

```ts
import { init, IKushki } from "@kushki/js-sdk";
import { CardTokenResponse, requestValidate3DS, TokenResponse } from "@kushki/js-sdk/Card";

const on3DSValidation = async () => {
  try {
    const kushkiInstance = await init({
      inTest: true,
      publicCredentialId: merchantId
    });

    const cardTokenResponse: CardTokenResponse = {
      secureId: "secure_id",
      secureService: "secure_service",
      security: {
        acsURL: "https://kushki.com",
        authenticationTransactionId: "transaction_id",
        authRequired: true,
        paReq: "jwt",
        specificationVersion: "2.0.1"
      },
      token: "token"
    };

    const response: TokenResponse = await requestValidate3DS(kushkiInstance, cardTokenResponse);

    console.log(response);
  } catch (error: any) {
    console.log(error)
  }
};
```
