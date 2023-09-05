/**
 * Container
 */
import "reflect-metadata";
import { IKushkiGateway } from "repository/IKushkiGateway";
import { KushkiGateway } from "gateway/KushkiGateway";
import { Container } from "inversify";
import { IDENTIFIERS } from "src/constant/Identifiers";

const CONTAINER: Container = new Container();

// Gateway
CONTAINER.bind<IKushkiGateway>(IDENTIFIERS.KushkiGateway).to(KushkiGateway);

export { CONTAINER };
