import IframesBusService from "service/IframesBusService.ts";

describe("IframesBusService test", function () {
  it("should create one instance of IframesBusService", function () {
    const bus = IframesBusService();

    const mockFnRecipeMessage = jest.fn();

    bus.on("event test", mockFnRecipeMessage);

    bus.emit("event test", { value: 1 });

    expect(mockFnRecipeMessage).toHaveBeenCalled();
  });
});
