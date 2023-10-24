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
import { IKushki, init, KushkiError } from "Kushki";

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

#### Defined in

[src/module/Kushki.ts:42](https://github.com/ksh-js-sdk-dev/kushki-js-sdk/blob/e581dca/src/module/Kushki.ts#L42)
