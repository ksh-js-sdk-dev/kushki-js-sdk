# Interface: CardTokenRequest

[Payment](../wiki/Payment).CardTokenRequest

## Indexable

▪ [k: `string`]: `any`

## Table of contents

### Properties

- [card](../wiki/Payment.CardTokenRequest#card)
- [currency](../wiki/Payment.CardTokenRequest#currency)
- [isDeferred](../wiki/Payment.CardTokenRequest#isdeferred)
- [jwt](../wiki/Payment.CardTokenRequest#jwt)
- [months](../wiki/Payment.CardTokenRequest#months)
- [totalAmount](../wiki/Payment.CardTokenRequest#totalamount)

## Properties

### card

• **card**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `cvv?` | ``null`` \| `string` |
| `expiryMonth` | `string` |
| `expiryYear` | `string` |
| `name` | `string` |
| `number` | `string` |

#### Defined in

types/card_token_request.d.ts:4

___

### currency

• **currency**: ``"USD"`` \| ``"COP"`` \| ``"CLP"`` \| ``"UF"`` \| ``"PEN"`` \| ``"MXN"`` \| ``"CRC"`` \| ``"GTQ"`` \| ``"HNL"`` \| ``"NIO"`` \| ``"BRL"``

#### Defined in

types/card_token_request.d.ts:11

___

### isDeferred

• `Optional` **isDeferred**: `boolean`

#### Defined in

types/card_token_request.d.ts:12

___

### jwt

• `Optional` **jwt**: `string`

#### Defined in

types/card_token_request.d.ts:15

___

### months

• `Optional` **months**: `number`

#### Defined in

types/card_token_request.d.ts:14

___

### totalAmount

• `Optional` **totalAmount**: `number`

#### Defined in

types/card_token_request.d.ts:13
