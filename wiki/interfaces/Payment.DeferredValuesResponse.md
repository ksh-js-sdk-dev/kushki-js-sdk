[kushki-js-sdk](../README.md) / [Modules](../modules.md) / [Payment](../modules/Payment.md) / DeferredValuesResponse

# Interface: DeferredValuesResponse

[Payment](../modules/Payment.md).DeferredValuesResponse

Contains the deferred params data that was collected in the form with the hosted fields

## Table of contents

### Properties

- [creditType](Payment.DeferredValuesResponse.md#credittype)
- [graceMonths](Payment.DeferredValuesResponse.md#gracemonths)
- [months](Payment.DeferredValuesResponse.md#months)

## Properties

### creditType

• `Optional` **creditType**: `string`

**`Type Param`**

Code of credit type

#### Defined in

types/token_response.d.ts:24

___

### graceMonths

• `Optional` **graceMonths**: `number`

**`Type Param`**

Number of grace months on the transaction, from 0 to more

#### Defined in

types/token_response.d.ts:20

___

### months

• `Optional` **months**: `number`

**`Type Param`**

Number of months for deferred transaction, from 0 to more

#### Defined in

types/token_response.d.ts:28
