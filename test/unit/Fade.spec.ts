import Flicking from "@egjs/flicking";

import Fade from "../../src/Fade";
import { sandbox, cleanup, waitEvent } from "../unit/utils";

describe("Fade", () => {
  let flicking: Flicking;

  beforeEach(() => {
    const wrapper = sandbox("flick");
    const viewportEl = document.createElement("div");
    viewportEl.style.width = "199px";
    viewportEl.className = "flicking-viewport";
    viewportEl.innerHTML = `
      <div class="flicking-camera">
        <div style="width: 200px; height: 200px;"><p></p></div>
        <div style="width: 200px; height: 200px;"><p></p></div>
        <div style="width: 200px; height: 200px;"><p></p></div>
      </div>
    `;
    wrapper.appendChild(viewportEl);
    flicking = new Flicking(viewportEl);
  });

  afterEach(() => {
    cleanup();
    flicking.destroy();
  });

  it("should set opacity to 1 for current panel", async () => {
    // Given & When
    await waitEvent(flicking, "ready");
    flicking.addPlugins(new Fade());

    // Then
    expect(flicking.currentPanel.element.style.opacity).to.equal("1");
  });

  it("should apply opacity to child elements if a selector is given", async () => {
    // Given & When
    await waitEvent(flicking, "ready");
    flicking.addPlugins(new Fade("p"));

    // Then
    const currentPanelEl = flicking.currentPanel.element;

    expect(currentPanelEl.style.opacity).to.equal("");
    expect(currentPanelEl.querySelector("p").style.opacity).to.equal("1");
  });

  it("should not set opacity for invisible panels", () => {
    // Given & When
    flicking.addPlugins(new Fade());

    // Then
    expect(flicking.getPanel(1).element.style.opacity).to.equal("");
    expect(flicking.getPanel(2).element.style.opacity).to.equal("");
  });

  it("should be updated whenever flicking moves", async () => {
    // Given
    await waitEvent(flicking, "ready");
    flicking.addPlugins(new Fade());

    // When
    void flicking.moveTo(1, 0);

    // Then
    expect(flicking.getPanel(1).element.style.opacity).to.equal("1");
  });
});
