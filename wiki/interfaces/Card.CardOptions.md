[kushki-js-sdk](../README.md) / [Modules](../modules.md) / [Card](../modules/Card.md) / CardOptions

# Interface: CardOptions

[Card](../modules/Card.md).CardOptions

## Table of contents

### Properties

- [amount](Card.CardOptions.md#amount)
- [currency](Card.CardOptions.md#currency)
- [fields](Card.CardOptions.md#fields)
- [isSubscription](Card.CardOptions.md#issubscription)
- [preventAutofill](Card.CardOptions.md#preventautofill)
- [styles](Card.CardOptions.md#styles)

## Properties

### amount

• `Optional` **amount**: [`Amount`](Card.Amount.md)

#### Defined in

types/card_options.d.ts:64

___

### currency

• **currency**: [`Currency`](../modules/Card.md#currency)

#### Defined in

types/card_options.d.ts:65

___

### fields

• **fields**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `cardNumber` | [`Field`](Card.Field.md) |
| `cardholderName?` | [`Field`](Card.Field.md) |
| `cvv` | [`Field`](Card.Field.md) |
| `deferred?` | [`Field`](Card.Field.md) |
| `expirationDate` | [`Field`](Card.Field.md) |
| `otp?` | [`Field`](Card.Field.md) |

#### Defined in

types/card_options.d.ts:69

___

### isSubscription

• `Optional` **isSubscription**: `boolean`

#### Defined in

types/card_options.d.ts:66

___

### preventAutofill

• `Optional` **preventAutofill**: `boolean`

#### Defined in

types/card_options.d.ts:67

___

### styles

• `Optional` **styles**: [`Styles`](Card.Styles.md)

#### Defined in

types/card_options.d.ts:68
