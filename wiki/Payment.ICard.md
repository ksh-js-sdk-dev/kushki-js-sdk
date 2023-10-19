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

Focus a form field

This method asynchronously focus a form field of the specified type, otherwise it will throw an exception

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fieldType` | [`FieldTypeEnum`](../wiki/Payment#fieldtypeenum) | The type of field (optional) |

#### Returns

`Promise`<`void`\>

**`Throws`**

- if the specified field type is not valid [ERRORS.E010](../wiki/Payment#errors)

**`Example`**

```ts
// Basic example
try {
   await cardInstance.focus(FieldTypeEnum.cardholderName);
   // On Success, can focus field, ex. cardholderName focus
 } catch (error: any) {
     // On Error, catch response, ex. {code:"E010", message: "Error al realizar focus en el campo"}
     console.error("Catch error on focus field", error.code, error.message);
 }
```

#### Defined in

[src/repository/ICard.ts:311](https://github.com/ksh-js-sdk-dev/kushki-js-sdk/blob/58b0a1b/src/repository/ICard.ts#L311)

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

[src/repository/ICard.ts:102](https://github.com/ksh-js-sdk-dev/kushki-js-sdk/blob/58b0a1b/src/repository/ICard.ts#L102)

___

### onFieldBlur

▸ **onFieldBlur**(`event`, `fieldType?`): `void`

onFieldBlur a field specify or form field

This event is emitted when the field loses focus, otherwise it will throw an exception

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | (`fieldEvent`: `FieldValidity` \| [`FormValidity`](../wiki/Payment.FormValidity)) => `void` | The function called when the form field is blurred |
| `fieldType?` | [`FieldTypeEnum`](../wiki/Payment#fieldtypeenum) | The type of field (optional) |

#### Returns

`void`

**`Example`**

Handling a basic onFieldBlur notify event FormValidity

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

Handling a basic onFieldBlur notify event FieldValidity

```ts
try {
    cardInstance.onFieldBlur((event: FieldValidity) => {
       if (event.isValid) {
         console.log("Form field is valid", event);
       } else {
         console.log("Form field is invalid", event);
         console.log("this is error", event.errorType);
       }
     }, FieldTypeEnum.cardholderName);
   // On Success, can get onFieldBlur, ex. FieldValidity : { isValid: false, errorType: "empty"}
 } catch (error: any) {
     console.error("Catch error on onFieldBlur", error.code, error.message);
 }
```

#### Defined in

[src/repository/ICard.ts:226](https://github.com/ksh-js-sdk-dev/kushki-js-sdk/blob/58b0a1b/src/repository/ICard.ts#L226)

___

### onFieldFocus

▸ **onFieldFocus**(`event`, `fieldType?`): `void`

onFieldFocus a field specify or form field

This event is emitted when the field gains focus, otherwise it will throw an exception

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | (`fieldEvent`: `FieldValidity` \| [`FormValidity`](../wiki/Payment.FormValidity)) => `void` | The function called when the form field is focused |
| `fieldType?` | [`FieldTypeEnum`](../wiki/Payment#fieldtypeenum) | The type of field (optional) |

#### Returns

`void`

**`Example`**

Handling a basic onFieldFocus notify event FormValidity

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

Handling a basic onFieldFocus notify event FieldValidity

```ts
try {
    cardInstance.onFieldFocus((event: FieldValidity) => {
       if (event.isValid) {
         console.log("Form field is valid", event);
       } else {
         console.log("Form field is invalid", event);
         console.log("this is error", event.errorType);
       }
     }, FieldTypeEnum.cardholderName);
   // On Success, can get onFieldFocus, ex. FieldValidity : { isValid: false, errorType: "empty"}
 } catch (error: any) {
     console.error("Catch error on onFieldFocus", error.code, error.message);
 }
```

#### Defined in

[src/repository/ICard.ts:172](https://github.com/ksh-js-sdk-dev/kushki-js-sdk/blob/58b0a1b/src/repository/ICard.ts#L172)

___

### onFieldSubmit

▸ **onFieldSubmit**(`event`, `fieldType?`): `void`

onFieldSubmit a field specify or form field

This event is emitted when the field has submit, otherwise it will throw an exception

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | (`fieldEvent`: `FieldValidity` \| [`FormValidity`](../wiki/Payment.FormValidity)) => `void` | The function called when the form field is submitted |
| `fieldType?` | [`FieldTypeEnum`](../wiki/Payment#fieldtypeenum) | The type of field (optional) |

#### Returns

`void`

**`Example`**

Handling a basic onFieldSubmit notify event FormValidity

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

Handling a basic onFieldSubmit notify event FieldValidity

```ts
try {
    cardInstance.onFieldSubmit((event: FieldValidity) => {
       if (event.isValid) {
         console.log("Form field is valid", event);
       } else {
         console.log("Form field is invalid", event);
         console.log("this is error", event.errorType);
       }
     }, FieldTypeEnum.cardholderName);
   // On Success, can get onFieldSubmit, ex. FieldValidity : { isValid: false, errorType: "empty"}
 } catch (error: any) {
     console.error("Catch error on onFieldSubmit", error.code, error.message);
 }
```

#### Defined in

[src/repository/ICard.ts:280](https://github.com/ksh-js-sdk-dev/kushki-js-sdk/blob/58b0a1b/src/repository/ICard.ts#L280)

___

### onFieldValidity

▸ **onFieldValidity**(`event`, `fieldType?`): `void`

This event is emitted when the field validity changes

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | (`fieldEvent`: `FieldValidity` \| [`FormValidity`](../wiki/Payment.FormValidity)) => `void` | The function called when the form field is validited |
| `fieldType?` | [`FieldTypeEnum`](../wiki/Payment#fieldtypeenum) | The type of form field (optional) |

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

[src/repository/ICard.ts:89](https://github.com/ksh-js-sdk-dev/kushki-js-sdk/blob/58b0a1b/src/repository/ICard.ts#L89)

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

[src/repository/ICard.ts:117](https://github.com/ksh-js-sdk-dev/kushki-js-sdk/blob/58b0a1b/src/repository/ICard.ts#L117)

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

[src/repository/ICard.ts:354](https://github.com/ksh-js-sdk-dev/kushki-js-sdk/blob/58b0a1b/src/repository/ICard.ts#L354)

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
     // On Error, catch response, ex. {code:"E007", message: "Error en la validación del formulario"}
     console.error("Catch error on request card Token", error.code, error.message);
 }
```

**`Example`**

```ts
// If deferred data is generated, you can use this data in the charge of the payment
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

[src/repository/ICard.ts:54](https://github.com/ksh-js-sdk-dev/kushki-js-sdk/blob/58b0a1b/src/repository/ICard.ts#L54)

___

### reset

▸ **reset**(`fieldType`): `Promise`<`void`\>

Reset a form field

This method asynchronously reset a form field of the specified type to its default state, otherwise it will throw an exception

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fieldType` | [`FieldTypeEnum`](../wiki/Payment#fieldtypeenum) | The type of field (optional) |

#### Returns

`Promise`<`void`\>

**`Throws`**

- if the specified field type is not valid [ERRORS.E009](../wiki/Payment#errors)

**`Example`**

```ts
// Basic example
try {
   await cardInstance.reset(FieldTypeEnum.cardholderName);
   // On Success, can reset field, ex. cardholderName empty
 } catch (error: any) {
     // On Error, catch response, ex. {code:"E009", message: "Error al limpiar el campo"}
     console.error("Catch error on reset field", error.code, error.message);
 }
```

#### Defined in

[src/repository/ICard.ts:339](https://github.com/ksh-js-sdk-dev/kushki-js-sdk/blob/58b0a1b/src/repository/ICard.ts#L339)
