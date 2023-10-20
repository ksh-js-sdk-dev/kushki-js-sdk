[kushki-js-sdk](../README.md) / [Modules](../modules.md) / Kushki

# Module: Kushki

## Table of contents

### Methods

- [init](Kushki.md#init)

### Classes

- [KushkiError](../classes/Kushki.KushkiError.md)

### Interfaces

- [IKushki](../interfaces/Kushki.IKushki.md)
- [KushkiOptions](../interfaces/Kushki.KushkiOptions.md)

## Methods

### init

▸ **init**(`options`): `Promise`<[`IKushki`](../interfaces/Kushki.IKushki.md)\>

Initializes the Kushki payment gateway with the provided options.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | [`KushkiOptions`](../interfaces/Kushki.KushkiOptions.md) | The options for initializing the Kushki payment gateway. |

#### Returns

`Promise`<[`IKushki`](../interfaces/Kushki.IKushki.md)\>

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
