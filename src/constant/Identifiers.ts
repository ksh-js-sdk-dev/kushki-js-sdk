/**
 * Injection identifiers
 */

export type containerSymbol = {
  KushkiGateway: symbol;
  SiftScienceService: symbol;
};

const IDENTIFIERS: containerSymbol = {
  KushkiGateway: Symbol.for("KushkiGateway"),
  SiftScienceService: Symbol.for("SiftScienceService")
};

export { IDENTIFIERS };
