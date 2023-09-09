/**
 * Container
 */
import "reflect-metadata";
import { IKushkiGateway } from "repository/IKushkiGateway";
import { KushkiGateway } from "gateway/KushkiGateway";
import { Container, interfaces } from "inversify";
import { IDENTIFIERS } from "src/constant/Identifiers";
import Factory = interfaces.Factory;
import Context = interfaces.Context;
import { ISiftScienceService } from "repository/ISiftScienceService";
import { SiftScienceService } from "module/service/SiftScienceService";

const CONTAINER: Container = new Container();

CONTAINER.bind<Factory<ISiftScienceService>>(
  IDENTIFIERS.SiftScienceService
).toFactory<ISiftScienceService>(
  (context: Context) => (): ISiftScienceService =>
    new SiftScienceService(context.container.get(IDENTIFIERS.KushkiGateway))
);

// Gateway
CONTAINER.bind<IKushkiGateway>(IDENTIFIERS.KushkiGateway).to(KushkiGateway);

export { CONTAINER };
