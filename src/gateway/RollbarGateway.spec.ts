import { CONTAINER } from "infrastructure/Container.ts";
import { IDENTIFIERS } from "src/constant/Identifiers.ts";
import { RollbarGateway } from "gateway/RollbarGateway.ts";
import { KushkiOptions } from "types/kushki_options";

describe("RollbarGateway - Test", () => {
  let rollbarGtw: RollbarGateway;

  beforeEach(() => {
    CONTAINER.snapshot();
    rollbarGtw = CONTAINER.get(IDENTIFIERS.RollbarGateway);
  });

  afterEach(() => {
    CONTAINER.restore();
  });

  function initRollbar() {
    const options: KushkiOptions = {
      inTest: true,
      publicCredentialId: "123456789"
    };

    rollbarGtw.init(options);
  }

  it("when call init should initialize rollbar", () => {
    initRollbar();

    const RollbarInstance = (rollbarGtw as any).rollbar;

    expect(RollbarInstance).toBeDefined();
  });
  it("when call error should do a rollbar.error", () => {
    const message_error = "This is an error";

    initRollbar();

    const errorSpy = jest.spyOn((rollbarGtw as any).rollbar, "error");

    rollbarGtw.error(message_error);

    expect(errorSpy).toHaveBeenCalledWith(message_error);
  });
});
