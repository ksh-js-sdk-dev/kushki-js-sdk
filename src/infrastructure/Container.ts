/**
 * Container
 */
import "reflect-metadata";
import { IKushkiGateway } from "repository/IKushkiGateway";
import { KushkiGateway } from "gateway/KushkiGateway";
import { Container } from "inversify";
import { IDENTIFIERS } from "src/constant/Identifiers";
import { ISiftScienceService } from "repository/ISiftScienceService";
import { SiftScienceService } from "src/service/SiftScienceService";

const CONTAINER: Container = new Container();

CONTAINER.bind<ISiftScienceService>(IDENTIFIERS.SiftScienceService).to(
  SiftScienceService
);

// Gateway
CONTAINER.bind<IKushkiGateway>(IDENTIFIERS.KushkiGateway).to(KushkiGateway);

export { CONTAINER };
