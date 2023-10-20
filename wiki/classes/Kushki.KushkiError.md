[kushki-js-sdk](../README.md) / [Modules](../modules.md) / [Kushki](../modules/Kushki.md) / KushkiError

# Class: KushkiError

[Kushki](../modules/Kushki.md).KushkiError

KushkiError Generic captured error.

## Hierarchy

- `Error`

  ↳ **`KushkiError`**

## Table of contents

### Methods

- [captureStackTrace](Kushki.KushkiError.md#capturestacktrace)

### Constructors

- [constructor](Kushki.KushkiError.md#constructor)

### Properties

- [code](Kushki.KushkiError.md#code)
- [detail](Kushki.KushkiError.md#detail)
- [message](Kushki.KushkiError.md#message)
- [name](Kushki.KushkiError.md#name)
- [stack](Kushki.KushkiError.md#stack)
- [prepareStackTrace](Kushki.KushkiError.md#preparestacktrace)
- [stackTraceLimit](Kushki.KushkiError.md#stacktracelimit)

## Methods

### captureStackTrace

▸ `Static` **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

Create .stack property on a target object

#### Parameters

| Name | Type |
| :------ | :------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

#### Returns

`void`

#### Inherited from

Error.captureStackTrace

#### Defined in

node_modules/@types/node/globals.d.ts:4

## Constructors

### constructor

• **new KushkiError**(`error`, `detail?`)

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `error` | `KushkiErrorAttr`<`ErrorCode`\> | `undefined` |
| `detail` | ``null`` \| `string` | `null` |

#### Overrides

Error.constructor

#### Defined in

[src/infrastructure/KushkiError.ts:23](https://github.com/ksh-js-sdk-dev/kushki-js-sdk/blob/9405e54/src/infrastructure/KushkiError.ts#L23)

## Properties

### code

• `Readonly` **code**: `string`

#### Defined in

[src/infrastructure/KushkiError.ts:19](https://github.com/ksh-js-sdk-dev/kushki-js-sdk/blob/9405e54/src/infrastructure/KushkiError.ts#L19)

___

### detail

• `Readonly` **detail**: ``null`` \| `string`

#### Defined in

[src/infrastructure/KushkiError.ts:21](https://github.com/ksh-js-sdk-dev/kushki-js-sdk/blob/9405e54/src/infrastructure/KushkiError.ts#L21)

___

### message

• `Readonly` **message**: `string`

#### Overrides

Error.message

#### Defined in

[src/infrastructure/KushkiError.ts:20](https://github.com/ksh-js-sdk-dev/kushki-js-sdk/blob/9405e54/src/infrastructure/KushkiError.ts#L20)

___

### name

• **name**: `string`

#### Inherited from

Error.name

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1067

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

Error.stack

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:1069

___

### prepareStackTrace

▪ `Static` `Optional` **prepareStackTrace**: (`err`: `Error`, `stackTraces`: `CallSite`[]) => `any`

#### Type declaration

▸ (`err`, `stackTraces`): `any`

Optional override for formatting stack traces

##### Parameters

| Name | Type |
| :------ | :------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

##### Returns

`any`

**`See`**

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

#### Inherited from

Error.prepareStackTrace

#### Defined in

node_modules/@types/node/globals.d.ts:11

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

Error.stackTraceLimit

#### Defined in

node_modules/@types/node/globals.d.ts:13
