import Flicking from "@egjs/flicking";

import Perspective from "../../src/Perspective";
import { sandbox, cleanup, waitEvent } from "../unit/utils";

describe("Perspective", () => {
  let flicking: Flicking;

  beforeEach(() => {
    const wrapper = sandbox("flick");
    wrapper.style.width = "199px";
    wrapper.classList.add("flicking-viewport");
    wrapper.innerHTML = `
      <div class="flicking-camera">
        <div style="width: 200px; height: 200px;"><p></p></div>
        <div style="width: 200px; height: 200px;"><p></p></div>
        <div style="width: 200px; height: 200px;"><p></p></div>
      </div>
    `;
    flicking = new Flicking(wrapper);
  });

  afterEach(() => {
    cleanup();
    flicking.destroy();
  });

  it("should set transform to default for current panel", async () => {
    // Given & When
    flicking.addPlugins(new Perspective());
    await waitEvent(flicking, "ready");

    // Then
    expect(flicking.currentPanel.element.style.transform).to.equal("perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)");
  });

  it("should set transform to default that except perspective for current panel when allocated other arguments", async () => {
    // Given & When
    flicking.addPlugins(new Perspective({perspective: 500, rotate: 0.5, scale: 0.5}));
    await waitEvent(flicking, "ready");

    // Then
    expect(flicking.currentPanel.element.style.transform).to.equal("perspective(500px) rotateX(0deg) rotateY(0deg) scale(1)");
  });

  it("should apply transform to child elements if a selector is given", async () => {
    // Given & When
    flicking.addPlugins(new Perspective({selector: "p"}));
    await waitEvent(flicking, "ready");

    // Then
    const currentPanelEl = flicking.currentPanel.element;

    expect(currentPanelEl.style.transform).to.equal("");
    expect(currentPanelEl.querySelector("p").style.transform).to.equal("perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)");
  });

  it("should not set transform for invisible panels", () => {
    // Given & When
    flicking.addPlugins(new Perspective());

    // Then
    expect(flicking.getPanel(1).element.style.transform).to.equal("");
    expect(flicking.getPanel(2).element.style.transform).to.equal("");
  });

  it("should be updated whenever flicking moves", async () => {
    // Given
    flicking.addPlugins(new Perspective());
    await waitEvent(flicking, "ready");

    // When
    void flicking.moveTo(1, 0);

    // Then
    expect(flicking.getPanel(1).element.style.transform).to.equal("perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)");
  });
});
