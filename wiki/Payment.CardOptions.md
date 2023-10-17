# Interface: CardOptions

[Payment](../wiki/Payment).CardOptions

## Table of contents

### Properties

- [amount](../wiki/Payment.CardOptions#amount)
- [currency](../wiki/Payment.CardOptions#currency)
- [fields](../wiki/Payment.CardOptions#fields)
- [isSubscription](../wiki/Payment.CardOptions#issubscription)
- [preventAutofill](../wiki/Payment.CardOptions#preventautofill)
- [styles](../wiki/Payment.CardOptions#styles)

## Properties

### amount

• `Optional` **amount**: [`Amount`](../wiki/Payment.Amount)

#### Defined in

types/card_options.d.ts:64

___

### currency

• **currency**: [`Currency`](../wiki/Payment#currency)

#### Defined in

types/card_options.d.ts:65

___

### fields

• **fields**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `cardNumber` | [`Field`](../wiki/Payment.Field) |
| `cardholderName?` | [`Field`](../wiki/Payment.Field) |
| `cvv` | [`Field`](../wiki/Payment.Field) |
| `deferred?` | [`Field`](../wiki/Payment.Field) |
| `expirationDate` | [`Field`](../wiki/Payment.Field) |
| `otp?` | [`Field`](../wiki/Payment.Field) |

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

• `Optional` **styles**: [`Styles`](../wiki/Payment.Styles)

#### Defined in

types/card_options.d.ts:68
