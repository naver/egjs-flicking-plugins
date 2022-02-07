import Flicking from "@egjs/flicking";
import * as sinon from "sinon";
import Arrow from "../../src/Arrow";

import { cleanup, createArrowFixture } from "./utils";

describe("Arrow", () => {
  afterEach(() => {
    cleanup();
  });

  it("should add touch start listener with passive: true", async () => {
    // Given
    const flicking = new Flicking(createArrowFixture(), { autoInit: false });
    const plugin = new Arrow();

    // When
    const prevArrow = flicking.element.querySelector(".flicking-arrow-prev");
    const nextArrow = flicking.element.querySelector(".flicking-arrow-next");
    const prevEventsSpy = sinon.spy(prevArrow, "addEventListener");
    const nextEventsSpy = sinon.spy(nextArrow, "addEventListener");

    flicking.addPlugins(plugin);
    await flicking.init();

    // Then
    expect(prevEventsSpy.calledWith("touchstart")).to.be.true;
    expect(nextEventsSpy.calledWith("touchstart")).to.be.true;
    expect(prevEventsSpy.args.filter(([type]) => type === "touchstart").every(([type, _, options]) => {
      return type === "touchstart" && options && (options as AddEventListenerOptions).passive;
    })).to.be.true;
    expect(nextEventsSpy.args.filter(([type]) => type === "touchstart").every(([type, _, options]) => {
      return type === "touchstart" && options && (options as AddEventListenerOptions).passive;
    })).to.be.true;
  });
});
