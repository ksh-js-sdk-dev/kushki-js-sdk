[kushki-js-sdk](../README.md) / [Modules](../modules.md) / [Kushki](../modules/Kushki.md) / IKushki

# Interface: IKushki

[Kushki](../modules/Kushki.md).IKushki

## Table of contents

### Properties

- [getBaseUrl](Kushki.IKushki.md#getbaseurl)
- [getEnvironmentSift](Kushki.IKushki.md#getenvironmentsift)
- [getPublicCredentialId](Kushki.IKushki.md#getpubliccredentialid)
- [isInTest](Kushki.IKushki.md#isintest)

## Properties

### getBaseUrl

• **getBaseUrl**: () => `EnvironmentEnum`

#### Type declaration

▸ (): `EnvironmentEnum`

Get Kushki API url UAT or PROD

##### Returns

`EnvironmentEnum`

#### Defined in

[src/repository/IKushki.ts:7](https://github.com/ksh-js-sdk-dev/kushki-js-sdk/blob/4f72c4a/src/repository/IKushki.ts#L7)

___

### getEnvironmentSift

• **getEnvironmentSift**: () => `string`

#### Type declaration

▸ (): `string`

Get Sift Science env

##### Returns

`string`

#### Defined in

[src/repository/IKushki.ts:17](https://github.com/ksh-js-sdk-dev/kushki-js-sdk/blob/4f72c4a/src/repository/IKushki.ts#L17)

___

### getPublicCredentialId

• **getPublicCredentialId**: () => `string`

#### Type declaration

▸ (): `string`

Get Merchant Public Credential

##### Returns

`string`

#### Defined in

[src/repository/IKushki.ts:12](https://github.com/ksh-js-sdk-dev/kushki-js-sdk/blob/4f72c4a/src/repository/IKushki.ts#L12)

___

### isInTest

• **isInTest**: () => `boolean`

#### Type declaration

▸ (): `boolean`

Get if Kushki instance is in test

##### Returns

`boolean`

#### Defined in

[src/repository/IKushki.ts:22](https://github.com/ksh-js-sdk-dev/kushki-js-sdk/blob/4f72c4a/src/repository/IKushki.ts#L22)
