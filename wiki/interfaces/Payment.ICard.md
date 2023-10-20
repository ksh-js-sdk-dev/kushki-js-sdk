[kushki-js-sdk](../README.md) / [Modules](../modules.md) / [Payment](../modules/Payment.md) / ICard

# Interface: ICard

[Payment](../modules/Payment.md).ICard

This interface contains all methods to use when resolve [initCardToken](../modules/Payment.md#initcardtoken)

## Table of contents

### Methods

- [focus](Payment.ICard.md#focus)
- [getFormValidity](Payment.ICard.md#getformvalidity)
- [onFieldBlur](Payment.ICard.md#onfieldblur)
- [onFieldFocus](Payment.ICard.md#onfieldfocus)
- [onFieldSubmit](Payment.ICard.md#onfieldsubmit)
- [onFieldValidity](Payment.ICard.md#onfieldvalidity)
- [onOTPValidation](Payment.ICard.md#onotpvalidation)
- [requestToken](Payment.ICard.md#requesttoken)
- [reset](Payment.ICard.md#reset)

## Methods

### focus

▸ **focus**(`fieldType`): `Promise`<`void`\>

Asynchronously focuses on a form field of the specified type

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fieldType` | `FieldTypeEnum` | The type of form field to focus on |

#### Returns

`Promise`<`void`\>

**`Example`**

```ts
// Example: Focus no t on the cardholder name field
await focus(FieldTypeEnum.cardholderName);
console.log("Cardholder name field is now focused.");
```

**`Example`**

```ts
// Example: Focus on the CVV field
await focus(FieldTypeEnum.cvv);
console.log("CVV field is now focused.");
```

#### Defined in

[src/repository/ICard.ts:257](https://github.com/ksh-js-sdk-dev/kushki-js-sdk/blob/44c6f89/src/repository/ICard.ts#L257)

___

### getFormValidity

▸ **getFormValidity**(): [`FormValidity`](Payment.FormValidity.md)

This function returns an [FormValidity](Payment.FormValidity.md) that represents the validation state of all fields

#### Returns

[`FormValidity`](Payment.FormValidity.md)

FormValidity object with form inputs information validation

**`Example`**

```ts
cardInstance.getFormValidity();
```

#### Defined in

[src/repository/ICard.ts:106](https://github.com/ksh-js-sdk-dev/kushki-js-sdk/blob/44c6f89/src/repository/ICard.ts#L106)

___

### onFieldBlur

▸ **onFieldBlur**(`event`, `fieldType?`): `void`

This event is emitted when the field loses focus

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | (`fieldEvent`: `FieldValidity` \| [`FormValidity`](Payment.FormValidity.md)) => `void` | The function called when the form field is blurred |
| `fieldType?` | `FieldTypeEnum` | The type of form field (optional) |

#### Returns

`void`

**`Function`**

**`Example`**

```ts
// Example 1: Handling a basic form blur event
onFieldBlur((event: FormValidity) => {
  // Implement your logic to handle the form submission here
  if (event.isFormValid) {
    console.log("Form submitted valid", event);
  } else {
    console.log("Form submitted invalid", event);
  }
});
```

**`Example`**

```ts
// Example 2: Handling a specific type of field blur event
onFieldBlur((event: FieldValidity) => {
  // Implement your logic to handle the specific field type here
  if (event.isValid) {
    console.log("Form field is valid", event);
  } else {
   console.log("Form field is invalid", event);
   console.log("this is error", event.errorType);
  }
}, fieldType: FieldTypeEnum);
```

#### Defined in

[src/repository/ICard.ts:197](https://github.com/ksh-js-sdk-dev/kushki-js-sdk/blob/44c6f89/src/repository/ICard.ts#L197)

___

### onFieldFocus

▸ **onFieldFocus**(`event`, `fieldType?`): `void`

This event is emitted when the field gains focus

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | (`fieldEvent`: `FieldValidity` \| [`FormValidity`](Payment.FormValidity.md)) => `void` | The function called when the form field is focused |
| `fieldType?` | `FieldTypeEnum` | The type of form field (optional) |

#### Returns

`void`

**`Function`**

**`Example`**

```ts
// Example 1: Handling a basic form focus event
onFieldFocus((event: FormValidity) => {
  // Implement your logic to handle the form submission here
  if (event.isFormValid) {
    console.log("Form submitted valid", event);
  } else {
    console.log("Form submitted invalid", event);
  }
});
```

**`Example`**

```ts
// Example 2: Handling a specific type of field focus event
onFieldFocus((event: FieldValidity) => {
  // Implement your logic to handle the specific field type here
  if (event.isValid) {
    console.log("Form field is valid", event);
  } else {
   console.log("Form field is invalid", event);
   console.log("this is error", event.errorType);
  }
}, fieldType: FieldTypeEnum);
```

#### Defined in

[src/repository/ICard.ts:160](https://github.com/ksh-js-sdk-dev/kushki-js-sdk/blob/44c6f89/src/repository/ICard.ts#L160)

___

### onFieldSubmit

▸ **onFieldSubmit**(`event`, `fieldType?`): `void`

This event is emitted when the field has submit

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | (`fieldEvent`: `FieldValidity` \| [`FormValidity`](Payment.FormValidity.md)) => `void` | The function called when the form field is submitted |
| `fieldType?` | `FieldTypeEnum` | The type of form field (optional) |

#### Returns

`void`

**`Function`**

**`Example`**

```ts
// Example 1: Handling a basic form submit field
onFieldSubmit((event: FormValidity) => {
  // Implement your logic to handle the form submission here
  if (event.isFormValid) {
    console.log("Form submitted valid", event);
  } else {
    console.log("Form submitted invalid", event);
  }
});
```

**`Example`**

```ts
// Example 2: Handling a specific type of field submission
onFieldSubmit((event: FieldValidity) => {
  // Implement your logic to handle the specific field type here
  if (event.isValid) {
    console.log("Form field is valid", event);
  } else {
   console.log("Form field is invalid", event);
   console.log("this is error", event.errorType);
  }
}, fieldType: FieldTypeEnum);
```

#### Defined in

[src/repository/ICard.ts:234](https://github.com/ksh-js-sdk-dev/kushki-js-sdk/blob/44c6f89/src/repository/ICard.ts#L234)

___

### onFieldValidity

▸ **onFieldValidity**(`event`, `fieldType?`): `void`

This event is emitted when the field validity changes

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | (`fieldEvent`: `FieldValidity` \| [`FormValidity`](Payment.FormValidity.md)) => `void` | The function called when the form field is validited |
| `fieldType?` | `FieldTypeEnum` | The type of form field (optional) |

#### Returns

`void`

**`Function`**

**`Example`**

```ts
// Example 1: Handling a basic form validity event
onFieldValidity((event: FormValidity) => {
  // Implement your logic to handle the form submission here
  if (event.isFormValid) {
    console.log("Form submitted valid", event);
  } else {
    console.log("Form submitted invalid", event);
  }
});
```

**`Example`**

```ts
// Example 2: Handling a specific type of field focus event
onFieldValidity((event: FieldValidity) => {
  // Implement your logic to handle the specific field type here
  if (event.isValid) {
    console.log("Form field is valid", event);
  } else {
   console.log("Form field is invalid", event);
   console.log("this is error", event.errorType);
  }
}, fieldType: FieldTypeEnum);
```

#### Defined in

[src/repository/ICard.ts:93](https://github.com/ksh-js-sdk-dev/kushki-js-sdk/blob/44c6f89/src/repository/ICard.ts#L93)

___

### onOTPValidation

▸ **onOTPValidation**(`onRequired`, `onError`, `onSuccess`): `void`

This event is emitted when enter value in OTP field

#### Parameters

| Name | Type |
| :------ | :------ |
| `onRequired` | () => `void` |
| `onError` | (`error`: `KushkiErrorAttr`) => `void` |
| `onSuccess` | () => `void` |

#### Returns

`void`

**`Example`**

```ts
cardInstance.onOTPValidation(
   () => { setShowOTP(true);},
   (error) => { setErrorOTP(error.message);},
   () => { setErrorOTP("");}
 );
```

#### Defined in

[src/repository/ICard.ts:121](https://github.com/ksh-js-sdk-dev/kushki-js-sdk/blob/44c6f89/src/repository/ICard.ts#L121)

▸ **onOTPValidation**(`onRequired`, `onError`, `onSuccess`): `void`

This event is emitted when enter value in OTP field

#### Parameters

| Name | Type |
| :------ | :------ |
| `onRequired` | () => `void` |
| `onError` | (`error`: `KushkiErrorAttr`) => `void` |
| `onSuccess` | () => `void` |

#### Returns

`void`

**`Example`**

```ts
cardInstance.onOTPValidation(
   () => { setShowOTP(true);},
   (error) => { setErrorOTP(error.message);},
   () => { setErrorOTP("");}
 );
```

#### Defined in

[src/repository/ICard.ts:292](https://github.com/ksh-js-sdk-dev/kushki-js-sdk/blob/44c6f89/src/repository/ICard.ts#L292)

___

### requestToken

▸ **requestToken**(): `Promise`<[`TokenResponse`](Payment.TokenResponse.md)\>

Get a card payment token

This method validates if all fields are valid and obtains a card payment token, otherwise it will throw an exception

If the merchant is configured with OTP, 3DS or SiftScience rules, this method automatically do validations for each rule

When [initCardToken](../modules/Payment.md#initcardtoken) method is configured as subscription, the token must be used to create a subscription, otherwise you can proceed normally with the charge method for card

#### Returns

`Promise`<[`TokenResponse`](Payment.TokenResponse.md)\>

TokenResponse object with token, if deferred info exists return this data

**`Throws`**

KushkiErrorResponse object with code and message of error
- if error on request card token endpoint then throw [ERRORS.E002](../modules/Payment.md#errors)
- if error on request merchant settings endpoint, then throw [ERRORS.E003](../modules/Payment.md#errors)
- if merchant is configured with 3DS rule and error on request JWT endpoint, then throw [ERRORS.E004](../modules/Payment.md#errors)
- if merchant is configured with 3DS rule and error on 3DS authentication, then throw [ERRORS.E005](../modules/Payment.md#errors)
- if merchant is configured with 3DS rule and error on 3DS session validation, then throw [ERRORS.E006](../modules/Payment.md#errors)
- if any hosted field is invalid, then throw [ERRORS.E007](../modules/Payment.md#errors)
- if merchant is configured with OTP rule and error on OTP validation, then throw [ERRORS.E008](../modules/Payment.md#errors)

**`Example`**

```ts
// Basic example for unique payment or subscription
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

**`Example`**

```ts
// If deferred data is generated, you can use this data in the charge of the payment
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

#### Defined in

[src/repository/ICard.ts:58](https://github.com/ksh-js-sdk-dev/kushki-js-sdk/blob/44c6f89/src/repository/ICard.ts#L58)

___

### reset

▸ **reset**(`fieldType`): `Promise`<`void`\>

Asynchronously resets a form field of the specified type to its default state

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fieldType` | `FieldTypeEnum` | The type of form field to reset |

#### Returns

`Promise`<`void`\>

**`Example`**

```ts
// Example: Reset the cardholder name field
await reset(FieldTypeEnum.cardholderName);
console.log("Cardholder name field is now reset.");
```

**`Example`**

```ts
// Example: Reset the CVV field
await reset(FieldTypeEnum.cvv);
console.log("CVV field is now reset.");
```

#### Defined in

[src/repository/ICard.ts:277](https://github.com/ksh-js-sdk-dev/kushki-js-sdk/blob/44c6f89/src/repository/ICard.ts#L277)
