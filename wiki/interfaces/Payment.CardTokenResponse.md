[kushki-js-sdk](../README.md) / [Modules](../modules.md) / [Payment](../modules/Payment.md) / CardTokenResponse

# Interface: CardTokenResponse

[Payment](../modules/Payment.md).CardTokenResponse

## Table of contents

### Properties

- [secureId](Payment.CardTokenResponse.md#secureid)
- [secureService](Payment.CardTokenResponse.md#secureservice)
- [security](Payment.CardTokenResponse.md#security)
- [settlement](Payment.CardTokenResponse.md#settlement)
- [token](Payment.CardTokenResponse.md#token)

## Properties

### secureId

• `Optional` **secureId**: `string`

#### Defined in

types/card_token_response.d.ts:6

___

### secureService

• `Optional` **secureService**: `string`

#### Defined in

types/card_token_response.d.ts:5

___

### security

• `Optional` **security**: `Object`

#### Index signature

▪ [k: `string`]: `any`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `acsURL?` | `string` |
| `authRequired?` | `boolean` |
| `authenticationTransactionId?` | `string` |
| `paReq?` | `string` |

#### Defined in

types/card_token_response.d.ts:8

___

### settlement

• `Optional` **settlement**: `number`

#### Defined in

types/card_token_response.d.ts:7

___

### token

• **token**: `string`

#### Defined in

types/card_token_response.d.ts:4
