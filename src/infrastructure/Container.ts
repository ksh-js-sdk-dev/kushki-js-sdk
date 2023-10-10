/**
 * Container
 */
import "reflect-metadata";
import { IKushkiGateway } from "repository/IKushkiGateway";
import { KushkiGateway } from "gateway/KushkiGateway";
import { Container } from "inversify";
import { IDENTIFIERS } from "src/constant/Identifiers";
import { ISiftScienceProvider } from "repository/ISiftScienceProvider.ts";
import { SiftScienceProvider } from "src/provider/SiftScienceProvider.ts";

const CONTAINER: Container = new Container();

CONTAINER.bind<ISiftScienceProvider>(IDENTIFIERS.SiftScienceService).to(
  SiftScienceProvider
);

// Gateway
CONTAINER.bind<IKushkiGateway>(IDENTIFIERS.KushkiGateway).to(KushkiGateway);

export { CONTAINER };
