import Flicking from "@egjs/flicking";
import Parallax from "../../src/Parallax";
import { sandbox, cleanup } from "../unit/utils";

describe("Parallax", () => {
  let flicking: Flicking;

  beforeEach(() => {
    const wrapper = sandbox("flick");
    wrapper.style.width = "200px";
    wrapper.innerHTML = `
      <div style="width: 200px; height: 200px;"><p></p></div>
      <div style="width: 200px; height: 200px;"><p></p></div>
      <div style="width: 200px; height: 200px;"><p></p></div>
    `;
    flicking = new Flicking(wrapper);
  });

  afterEach(() => {
    cleanup();
    flicking.destroy();
  });

  it("should apply transform for visible panels", () => {
    // Given & When
    flicking.addPlugins(new Parallax());

    // Then
    const visiblePanels = flicking.getVisiblePanels();
    visiblePanels.forEach(panel => {
      expect(panel.getElement().style.transform).not.to.equal("");
    });
  });

  it("should apply opacity to child elements if a selector is given", () => {
    // Given & When
    flicking.addPlugins(new Parallax("p"));

    // Then
    const visiblePanels = flicking.getVisiblePanels();
    visiblePanels.forEach(panel => {
      expect(panel.getElement().querySelector("p").style.transform).not.to.equal("");
    });
  });

  it("should not set opacity for invisible panels", () => {
    // Given & When
    flicking.addPlugins(new Parallax());

    // Then
    expect(flicking.getPanel(1).getElement().style.transform).to.equal("");
    expect(flicking.getPanel(2).getElement().style.transform).to.equal("");
  });

  it("should be updated whenever flicking moves", () => {
    // Given & When
    flicking.addPlugins(new Parallax());
    flicking.moveTo(1, 0);

    // Then
    expect(flicking.getPanel(1).getElement().style.transform).not.to.equal("");
  });
});
