# Module: Kushki

## Table of contents

### Methods

- [init](../wiki/Kushki#init)

### Classes

- [KushkiError](../wiki/Kushki.KushkiError)

### Interfaces

- [IKushki](../wiki/Kushki.IKushki)
- [KushkiOptions](../wiki/Kushki.KushkiOptions)

## Methods

### init

▸ **init**(`options`): `Promise`<[`IKushki`](../wiki/Kushki.IKushki)\>

Initializes the Kushki payment gateway with the provided options.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | [`KushkiOptions`](../wiki/Kushki.KushkiOptions) | The options for initializing the Kushki payment gateway. |

#### Returns

`Promise`<[`IKushki`](../wiki/Kushki.IKushki)\>

A Promise that resolves to an instance of the initialized Kushki payment gateway.

**`Throws`**

Throws an error if the initialization fails due to invalid options, network issues or public credential id undefined.

**`Example`**

```ts
// Example usage of the init function
const options = {
  publicCredentialId: 'public-merchant-id',
  inTest: true
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

#### Defined in

[src/module/Kushki.ts:40](https://github.com/ksh-js-sdk-dev/kushki-js-sdk/blob/58b0a1b/src/module/Kushki.ts#L40)
