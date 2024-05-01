export type CreditCardEspecificationsType = {
  cardInitialBinPlace: number;
  cardFinalBinPlaceSift: number;
  cardFinalBinPlace: number;
};

export const CREDIT_CARD_ESPECIFICATIONS: CreditCardEspecificationsType = {
  cardFinalBinPlace: 8,
  cardFinalBinPlaceSift: 6,
  cardInitialBinPlace: 0
};

export const CREDIT_TYPE = {
  ALL: "all"
};
