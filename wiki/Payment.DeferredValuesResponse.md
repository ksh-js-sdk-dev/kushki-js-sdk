# Interface: DeferredValuesResponse

[Payment](../wiki/Payment).DeferredValuesResponse

Contains the deferred params data that was collected in the form with the hosted fields

## Table of contents

### Properties

- [creditType](../wiki/Payment.DeferredValuesResponse#credittype)
- [graceMonths](../wiki/Payment.DeferredValuesResponse#gracemonths)
- [months](../wiki/Payment.DeferredValuesResponse#months)

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
