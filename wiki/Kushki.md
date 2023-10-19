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

#### Defined in

[src/module/Kushki.ts:42](https://github.com/ksh-js-sdk-dev/kushki-js-sdk/blob/408d919/src/module/Kushki.ts#L42)
