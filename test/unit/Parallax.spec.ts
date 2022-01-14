import Flicking from "@egjs/flicking";

import Parallax from "../../src/Parallax";
import { sandbox, cleanup, waitEvent } from "../unit/utils";

describe("Parallax", () => {
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

  it("should apply transform for visible panels", () => {
    // Given & When
    flicking.addPlugins(new Parallax());

    // Then
    const visiblePanels = flicking.visiblePanels;

    visiblePanels.forEach(panel => {
      expect(panel.element.style.transform).not.to.equal("");
    });
  });

  it("should apply opacity to child elements if a selector is given", () => {
    // Given & When
    flicking.addPlugins(new Parallax("p"));

    // Then
    const visiblePanels = flicking.visiblePanels;
    visiblePanels.forEach(panel => {
      expect(panel.element.querySelector("p").style.transform).not.to.equal("");
    });
  });

  it("should not set opacity for invisible panels", () => {
    // Given & When
    flicking.addPlugins(new Parallax());

    // Then
    expect(flicking.getPanel(1).element.style.transform).to.equal("");
    expect(flicking.getPanel(2).element.style.transform).to.equal("");
  });

  it("should be updated whenever flicking moves", async () => {
    // Given
    flicking.addPlugins(new Parallax());
    await waitEvent(flicking, "ready");

    // When
    void flicking.moveTo(1, 0);

    // Then
    expect(flicking.getPanel(1).element.style.transform).not.to.equal("");
  });
});
