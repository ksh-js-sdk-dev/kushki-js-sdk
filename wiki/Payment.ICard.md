# Interface: ICard

[Payment](../wiki/Payment).ICard

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

[src/repository/ICard.ts:217](https://github.com/ksh-js-sdk-dev/kushki-js-sdk/blob/d3e2477/src/repository/ICard.ts#L217)

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

[src/repository/ICard.ts:66](https://github.com/ksh-js-sdk-dev/kushki-js-sdk/blob/d3e2477/src/repository/ICard.ts#L66)

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

[src/repository/ICard.ts:157](https://github.com/ksh-js-sdk-dev/kushki-js-sdk/blob/d3e2477/src/repository/ICard.ts#L157)

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

[src/repository/ICard.ts:120](https://github.com/ksh-js-sdk-dev/kushki-js-sdk/blob/d3e2477/src/repository/ICard.ts#L120)

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

[src/repository/ICard.ts:194](https://github.com/ksh-js-sdk-dev/kushki-js-sdk/blob/d3e2477/src/repository/ICard.ts#L194)

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

[src/repository/ICard.ts:53](https://github.com/ksh-js-sdk-dev/kushki-js-sdk/blob/d3e2477/src/repository/ICard.ts#L53)

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

[src/repository/ICard.ts:81](https://github.com/ksh-js-sdk-dev/kushki-js-sdk/blob/d3e2477/src/repository/ICard.ts#L81)

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

[src/repository/ICard.ts:252](https://github.com/ksh-js-sdk-dev/kushki-js-sdk/blob/d3e2477/src/repository/ICard.ts#L252)

___

### requestToken

▸ **requestToken**(): `Promise`<[`TokenResponse`](../wiki/Payment.TokenResponse)\>

Create token for payment

#### Returns

`Promise`<[`TokenResponse`](../wiki/Payment.TokenResponse)\>

TokenResponse object with token and security info

**`Throws`**

KushkiErrorResponse object with code and message of error

**`Example`**

```ts
try {
   var tokenResponse;
   const token: TokenResponse = await cardInstance.requestToken();
   tokenResponse = token.token;
 } catch (error: any) {}
```

#### Defined in

[src/repository/ICard.ts:18](https://github.com/ksh-js-sdk-dev/kushki-js-sdk/blob/d3e2477/src/repository/ICard.ts#L18)

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

[src/repository/ICard.ts:237](https://github.com/ksh-js-sdk-dev/kushki-js-sdk/blob/d3e2477/src/repository/ICard.ts#L237)
