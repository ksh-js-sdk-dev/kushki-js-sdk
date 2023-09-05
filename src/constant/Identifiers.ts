/**
 * Injection identifiers
 */

export type containerSymbol = {
  KushkiGateway: symbol;
};

const IDENTIFIERS: containerSymbol = {
  KushkiGateway: Symbol.for("KushkiGateway")
};

export { IDENTIFIERS };
