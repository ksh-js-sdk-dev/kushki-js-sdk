[kushki-js-sdk](../README.md) / [Modules](../modules.md) / [Payment](../modules/Payment.md) / CardOptions

# Interface: CardOptions

[Payment](../modules/Payment.md).CardOptions

## Table of contents

### Properties

- [amount](Payment.CardOptions.md#amount)
- [currency](Payment.CardOptions.md#currency)
- [fields](Payment.CardOptions.md#fields)
- [isSubscription](Payment.CardOptions.md#issubscription)
- [preventAutofill](Payment.CardOptions.md#preventautofill)
- [styles](Payment.CardOptions.md#styles)

## Properties

### amount

• `Optional` **amount**: [`Amount`](Payment.Amount.md)

#### Defined in

types/card_options.d.ts:64

___

### currency

• **currency**: [`Currency`](../modules/Payment.md#currency)

#### Defined in

types/card_options.d.ts:65

___

### fields

• **fields**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `cardNumber` | [`Field`](Payment.Field.md) |
| `cardholderName?` | [`Field`](Payment.Field.md) |
| `cvv` | [`Field`](Payment.Field.md) |
| `deferred?` | [`Field`](Payment.Field.md) |
| `expirationDate` | [`Field`](Payment.Field.md) |
| `otp?` | [`Field`](Payment.Field.md) |

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

• `Optional` **styles**: [`Styles`](Payment.Styles.md)

#### Defined in

types/card_options.d.ts:68
