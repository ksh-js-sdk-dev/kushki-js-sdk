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
import { ICardinal3DSProvider } from "repository/ICardinal3DSProvider.ts";
import { Cardinal3DSProvider } from "src/provider/Cardinal3DSProvider.ts";
import { ISandbox3DSProvider } from "repository/ISandbox3DSProvider.ts";
import { Sandbox3DSProvider } from "src/provider/Sandbox3DSProvider.ts";
import { IRollbarGateway } from "repository/IRollbarGateway.ts";
import { RollbarGateway } from "gateway/RollbarGateway.ts";

const CONTAINER: Container = new Container();

CONTAINER.bind<ISiftScienceProvider>(IDENTIFIERS.SiftScienceService).to(
  SiftScienceProvider
);
CONTAINER.bind<ICardinal3DSProvider>(IDENTIFIERS.Cardinal3DSProvider).to(
  Cardinal3DSProvider
);
CONTAINER.bind<ISandbox3DSProvider>(IDENTIFIERS.Sandbox3DSProvider).to(
  Sandbox3DSProvider
);

// Gateway
CONTAINER.bind<IKushkiGateway>(IDENTIFIERS.KushkiGateway).to(KushkiGateway);

CONTAINER.bind<IRollbarGateway>(IDENTIFIERS.RollbarGateway).to(RollbarGateway);

export { CONTAINER };
