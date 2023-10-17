# Interface: ICard

[Payment](../wiki/Payment).ICard

This interface contains all methods to use when resolve [initCardToken](../wiki/Payment#initcardtoken)

## Table of contents

### Methods

- [focus](../wiki/Payment.ICard#focus)
- [getFormValidity](../wiki/Payment.ICard#getformvalidity)
- [onFieldBlur](../wiki/Payment.ICard#onfieldblur)
- [onFieldFocus](../wiki/Payment.ICard#onfieldfocus)
- [onFieldSubmit](../wiki/Payment.ICard#onfieldsubmit)
- [onFieldValidity](../wiki/Payment.ICard#onfieldvalidity)
- [onOTPValidation](../wiki/Payment.ICard#onotpvalidation)
- [requestToken](../wiki/Payment.ICard#requesttoken)
- [reset](../wiki/Payment.ICard#reset)

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

[src/repository/ICard.ts:252](https://github.com/ksh-sdk-js/kushki-js-sdk/blob/6c15ee3/src/repository/ICard.ts#L252)

___

### getFormValidity

▸ **getFormValidity**(): [`FormValidity`](../wiki/Payment.FormValidity)

This function returns an [FormValidity](../wiki/Payment.FormValidity) that represents the validation state of all fields

#### Returns

[`FormValidity`](../wiki/Payment.FormValidity)

FormValidity object with form inputs information validation

**`Example`**

```ts
cardInstance.getFormValidity();
```

#### Defined in

[src/repository/ICard.ts:101](https://github.com/ksh-sdk-js/kushki-js-sdk/blob/6c15ee3/src/repository/ICard.ts#L101)

___

### onFieldBlur

▸ **onFieldBlur**(`event`, `fieldType?`): `void`

This event is emitted when the field loses focus

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | (`fieldEvent`: `FieldValidity` \| [`FormValidity`](../wiki/Payment.FormValidity)) => `void` | The function called when the form field is blurred |
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

[src/repository/ICard.ts:192](https://github.com/ksh-sdk-js/kushki-js-sdk/blob/6c15ee3/src/repository/ICard.ts#L192)

___

### onFieldFocus

▸ **onFieldFocus**(`event`, `fieldType?`): `void`

This event is emitted when the field gains focus

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | (`fieldEvent`: `FieldValidity` \| [`FormValidity`](../wiki/Payment.FormValidity)) => `void` | The function called when the form field is focused |
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

[src/repository/ICard.ts:155](https://github.com/ksh-sdk-js/kushki-js-sdk/blob/6c15ee3/src/repository/ICard.ts#L155)

___

### onFieldSubmit

▸ **onFieldSubmit**(`event`, `fieldType?`): `void`

This event is emitted when the field has submit

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | (`fieldEvent`: `FieldValidity` \| [`FormValidity`](../wiki/Payment.FormValidity)) => `void` | The function called when the form field is submitted |
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

[src/repository/ICard.ts:229](https://github.com/ksh-sdk-js/kushki-js-sdk/blob/6c15ee3/src/repository/ICard.ts#L229)

___

### onFieldValidity

▸ **onFieldValidity**(`event`, `fieldType?`): `void`

This event is emitted when the field validity changes

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | (`fieldEvent`: `FieldValidity` \| [`FormValidity`](../wiki/Payment.FormValidity)) => `void` | The function called when the form field is validited |
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

[src/repository/ICard.ts:88](https://github.com/ksh-sdk-js/kushki-js-sdk/blob/6c15ee3/src/repository/ICard.ts#L88)

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

[src/repository/ICard.ts:116](https://github.com/ksh-sdk-js/kushki-js-sdk/blob/6c15ee3/src/repository/ICard.ts#L116)

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

[src/repository/ICard.ts:287](https://github.com/ksh-sdk-js/kushki-js-sdk/blob/6c15ee3/src/repository/ICard.ts#L287)

___

### requestToken

▸ **requestToken**(): `Promise`<[`TokenResponse`](../wiki/Payment.TokenResponse)\>

Get a card payment token

This method validates if all fields are valid and obtains a card payment token, otherwise it will throw an exception

If the merchant is configured with OTP, 3DS or SiftScience rules, this method automatically do validations for each rule

#### Returns

`Promise`<[`TokenResponse`](../wiki/Payment.TokenResponse)\>

TokenResponse object with token, if deferred info exists return this data

**`Throws`**

KushkiErrorResponse object with code and message of error
- if error on request card token endpoint then throw [ERRORS.E002](../wiki/Payment#errors)
- if error on request merchant settings endpoint, then throw [ERRORS.E003](../wiki/Payment#errors)
- if merchant is configured with 3DS rule and error on request JWT endpoint, then throw [ERRORS.E004](../wiki/Payment#errors)
- if merchant is configured with 3DS rule and error on 3DS authentication, then throw [ERRORS.E005](../wiki/Payment#errors)
- if merchant is configured with 3DS rule and error on 3DS session validation, then throw [ERRORS.E006](../wiki/Payment#errors)
- if any hosted field is invalid, then throw [ERRORS.E007](../wiki/Payment#errors)
- if merchant is configured with OTP rule and error on OTP validation, then throw [ERRORS.E008](../wiki/Payment#errors)

**`Example`**

```ts
// Basic example
try {
   const tokenResponse: TokenResponse = await cardInstance.requestToken();
   // On Success, can get card token response, ex. {token: "a2b74b7e3cf24e368a20380f16844d16"}
   console.log("This is a card Token", tokenResponse.token)
 } catch (error: any) {
     // On Error, catch response, ex. {code:"E002", message: "Error en solicitud de token"}
     console.error("Catch error on request card Token", error.code, error.message);
 }
```

**`Example`**

```ts
// If deferred data is generated in the process, can obtain that data from response
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

#### Defined in

[src/repository/ICard.ts:53](https://github.com/ksh-sdk-js/kushki-js-sdk/blob/6c15ee3/src/repository/ICard.ts#L53)

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

[src/repository/ICard.ts:272](https://github.com/ksh-sdk-js/kushki-js-sdk/blob/6c15ee3/src/repository/ICard.ts#L272)
