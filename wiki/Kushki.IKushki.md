# Interface: IKushki

[Kushki](../wiki/Kushki).IKushki

## Table of contents

### Properties

- [getBaseUrl](../wiki/Kushki.IKushki#getbaseurl)
- [getEnvironmentSift](../wiki/Kushki.IKushki#getenvironmentsift)
- [getPublicCredentialId](../wiki/Kushki.IKushki#getpubliccredentialid)
- [isInTest](../wiki/Kushki.IKushki#isintest)

## Properties

### getBaseUrl

• **getBaseUrl**: () => `EnvironmentEnum`

#### Type declaration

▸ (): `EnvironmentEnum`

Get Kushki API url UAT or PROD

##### Returns

`EnvironmentEnum`

#### Defined in

[src/repository/IKushki.ts:7](https://github.com/ksh-sdk-js/kushki-js-sdk/blob/6c15ee3/src/repository/IKushki.ts#L7)

___

### getEnvironmentSift

• **getEnvironmentSift**: () => `string`

#### Type declaration

▸ (): `string`

Get Sift Science env

##### Returns

`string`

#### Defined in

[src/repository/IKushki.ts:17](https://github.com/ksh-sdk-js/kushki-js-sdk/blob/6c15ee3/src/repository/IKushki.ts#L17)

___

### getPublicCredentialId

• **getPublicCredentialId**: () => `string`

#### Type declaration

▸ (): `string`

Get Merchant Public Credential

##### Returns

`string`

#### Defined in

[src/repository/IKushki.ts:12](https://github.com/ksh-sdk-js/kushki-js-sdk/blob/6c15ee3/src/repository/IKushki.ts#L12)

___

### isInTest

• **isInTest**: () => `boolean`

#### Type declaration

▸ (): `boolean`

Get if Kushki instance is in test

##### Returns

`boolean`

#### Defined in

[src/repository/IKushki.ts:22](https://github.com/ksh-sdk-js/kushki-js-sdk/blob/6c15ee3/src/repository/IKushki.ts#L22)
