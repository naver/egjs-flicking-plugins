import Flicking from "@egjs/flicking";
import * as sinon from "sinon";
import Arrow from "../../src/Arrow";

import { cleanup, createArrowFixture, sandbox, tick, waitEvent } from "./utils";

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

  describe("Options", () => {
    let flicking: Flicking;

    beforeEach(() => {
      const wrapper = sandbox("flick");
      const viewportEl = document.createElement("div");
      viewportEl.style.width = "300px";
      viewportEl.className = "flicking-viewport";
      viewportEl.innerHTML = `
        <div class="flicking-camera">
          <div style="width: 300px"></div>
          <div style="width: 300px"></div>
          <div style="width: 300px"></div>
        </div>
        <span class="flicking-arrow-prev"></span>
        <span class="flicking-arrow-next"></span>
      `;
      wrapper.appendChild(viewportEl);
      flicking = new Flicking(viewportEl, { duration: 1000 });
    });

    afterEach(() => {
      cleanup();
      flicking.destroy();
    });

    describe("interruptable", () => {
      it("should interrupt ongoing animation when interruptable is true", async () => {
        // Given
        const plugin = new Arrow({ interruptable: true });
        await waitEvent(flicking, "ready");
        flicking.addPlugins(plugin);

        // When
        const nextArrow = flicking.element.querySelector(".flicking-arrow-next");

        nextArrow?.dispatchEvent(new Event("click"));
        tick(500);
        nextArrow?.dispatchEvent(new Event("click"));
        tick(2000);

        // Then
        expect(flicking.index).to.be.equal(2);
      });

      it("should not interrupt ongoing animation when interruptable is true", async () => {
        // Given
        const plugin = new Arrow({ interruptable: false });
        await waitEvent(flicking, "ready");
        flicking.addPlugins(plugin);

        // When
        const nextArrow = flicking.element.querySelector(".flicking-arrow-next");

        nextArrow?.dispatchEvent(new Event("click"));
        tick(500);
        nextArrow?.dispatchEvent(new Event("click"));
        tick(2000);

        // Then
        expect(flicking.index).to.be.equal(1);
      });
    });
  });

});
