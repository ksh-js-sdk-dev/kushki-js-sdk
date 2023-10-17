# Interface: CardTokenResponse

[Payment](../wiki/Payment).CardTokenResponse

## Table of contents

### Properties

- [secureId](../wiki/Payment.CardTokenResponse#secureid)
- [secureService](../wiki/Payment.CardTokenResponse#secureservice)
- [security](../wiki/Payment.CardTokenResponse#security)
- [settlement](../wiki/Payment.CardTokenResponse#settlement)
- [token](../wiki/Payment.CardTokenResponse#token)

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
