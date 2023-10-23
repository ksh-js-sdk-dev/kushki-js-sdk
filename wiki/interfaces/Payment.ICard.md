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

Focus a hosted field

This method asynchronously focus a form field of the specified type, otherwise it will throw an exception

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fieldType` | [`FieldTypeEnum`](../modules/Payment.md#fieldtypeenum) | The type of field (optional) |

#### Returns

`Promise`<`void`\>

**`Throws`**

- if the specified field type is not valid [ERRORS.E010](../modules/Payment.md#errors)

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

[src/repository/ICard.ts:347](https://github.com/ksh-js-sdk-dev/kushki-js-sdk/blob/8694a90/src/repository/ICard.ts#L347)

___

### getFormValidity

▸ **getFormValidity**(): [`FormValidity`](Payment.FormValidity.md)

This function returns an [FormValidity](Payment.FormValidity.md) that represents the validation state of all fields

#### Returns

[`FormValidity`](Payment.FormValidity.md)

FormValidity object with validation info of all fields

**`Example`**

Get field validity of all hosted fields

```ts
try {
    cardInstance.getFormValidity((event: FormValidity) => {
      // Implement your logic to handle the event , here
       if (event.isFormValid) {
         console.log("Form valid", event);
       } else {
         console.log("Form invalid", event);
       }
   );
  // On Success, can get FormValidity, ex. FormValidity: { isFormValid: true, triggeredBy: cardholderName, fields: Fields}   *  } catch (error: any) {
     console.error("Catch error on getFormValidity", error.code, error.message);
 } catch (error: any) {
     console.error("Catch error on onFieldFocus", error.code, error.message);
 }
 ```

#### Defined in

[src/repository/ICard.ts:143](https://github.com/ksh-js-sdk-dev/kushki-js-sdk/blob/8694a90/src/repository/ICard.ts#L143)

___

### onFieldBlur

▸ **onFieldBlur**(`event`, `fieldType?`): `void`

This event is emitted when the field loses focus

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | (`fieldEvent`: `FieldValidity` \| [`FormValidity`](Payment.FormValidity.md)) => `void` | Callback is executed when the hosted field is blurred |
| `fieldType?` | [`FieldTypeEnum`](../modules/Payment.md#fieldtypeenum) | (optional) Set type of field if you want handle event blur of specific hosted field |

#### Returns

`void`

**`Example`**

Handling events 'blur' of all hosted fields

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

Handling event 'blur' of an especific hosted field

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

[src/repository/ICard.ts:264](https://github.com/ksh-js-sdk-dev/kushki-js-sdk/blob/8694a90/src/repository/ICard.ts#L264)

___

### onFieldFocus

▸ **onFieldFocus**(`event`, `fieldType?`): `void`

This event is emitted when the field gains focus

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | (`fieldEvent`: `FieldValidity` \| [`FormValidity`](Payment.FormValidity.md)) => `void` | Callback is executed when the hosted field is focused |
| `fieldType?` | [`FieldTypeEnum`](../modules/Payment.md#fieldtypeenum) | (optional) Set type of field if you want handle event focus of specific hosted field |

#### Returns

`void`

**`Example`**

Handling events 'focus' of all hosted fields

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

Handling event 'focus' of an especific hosted field

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

[src/repository/ICard.ts:212](https://github.com/ksh-js-sdk-dev/kushki-js-sdk/blob/8694a90/src/repository/ICard.ts#L212)

___

### onFieldSubmit

▸ **onFieldSubmit**(`event`, `fieldType?`): `void`

This event is emitted when the field has submit.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | (`fieldEvent`: `FieldValidity` \| [`FormValidity`](Payment.FormValidity.md)) => `void` | Callback is executed when the hosted field is submitted |
| `fieldType?` | [`FieldTypeEnum`](../modules/Payment.md#fieldtypeenum) | (optional) Set type of field if you want handle event submit of specific hosted field |

#### Returns

`void`

**`Example`**

Handling events 'submit' of all hosted fields

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

Handling event 'submit' of an especific hosted field

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

[src/repository/ICard.ts:316](https://github.com/ksh-js-sdk-dev/kushki-js-sdk/blob/8694a90/src/repository/ICard.ts#L316)

___

### onFieldValidity

▸ **onFieldValidity**(`event`, `fieldType?`): `void`

This event is emitted when the field validity changes

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `event` | (`fieldEvent`: `FieldValidity` \| [`FormValidity`](Payment.FormValidity.md)) => `void` | Callback is executed when the hosted field changes it's validity |
| `fieldType?` | [`FieldTypeEnum`](../modules/Payment.md#fieldtypeenum) | (optional) Set type of field if you want handle event validity of specific hosted field |

#### Returns

`void`

**`Example`**

Handling events 'validity' of all hosted fields

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
   // On Success, can get onFieldFocus, ex. FormValidity: { isFormValid: true, triggeredBy: cardholderName, fields: Fields}
 } catch (error: any) {
     console.error("Catch error on onFieldFocus", error.code, error.message);
 }
```

Handling event 'validity' of an especific hosted field

```ts
try {
    cardInstance.onFieldValidity((event: FieldValidity) => {
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

[src/repository/ICard.ts:107](https://github.com/ksh-js-sdk-dev/kushki-js-sdk/blob/8694a90/src/repository/ICard.ts#L107)

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

[src/repository/ICard.ts:158](https://github.com/ksh-js-sdk-dev/kushki-js-sdk/blob/8694a90/src/repository/ICard.ts#L158)

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

[src/repository/ICard.ts:390](https://github.com/ksh-js-sdk-dev/kushki-js-sdk/blob/8694a90/src/repository/ICard.ts#L390)

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

[src/repository/ICard.ts:58](https://github.com/ksh-js-sdk-dev/kushki-js-sdk/blob/8694a90/src/repository/ICard.ts#L58)

___

### reset

▸ **reset**(`fieldType`): `Promise`<`void`\>

Reset a hosted field

This method asynchronously reset a form field of the specified type to its default state, otherwise it will throw an exception

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `fieldType` | [`FieldTypeEnum`](../modules/Payment.md#fieldtypeenum) | The type of field (optional) |

#### Returns

`Promise`<`void`\>

**`Throws`**

- if the specified field type is not valid [ERRORS.E009](../modules/Payment.md#errors)

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

[src/repository/ICard.ts:375](https://github.com/ksh-js-sdk-dev/kushki-js-sdk/blob/8694a90/src/repository/ICard.ts#L375)
