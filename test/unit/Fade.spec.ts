import Flicking from "@egjs/flicking";
import Fade from "../../src/Fade";
import { sandbox, cleanup } from "../unit/utils";

describe("Fade", () => {
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

  it("should set opacity to 1 for current panel", () => {
    // Given & When
    flicking.addPlugins(new Fade());

    // Then
    expect(flicking.getCurrentPanel().getElement().style.opacity).to.equal("1");
  });

  it("should apply opacity to child elements if a selector is given", () => {
    // Given & When
    flicking.addPlugins(new Fade("p"));

    // Then
    const currentPanelEl = flicking.getCurrentPanel().getElement();
    expect(currentPanelEl.style.opacity).to.equal("");
    expect(currentPanelEl.querySelector("p").style.opacity).to.equal("1");
  });

  it("should not set opacity for invisible panels", () => {
    // Given & When
    flicking.addPlugins(new Fade());

    // Then
    expect(flicking.getPanel(1).getElement().style.opacity).to.equal("");
    expect(flicking.getPanel(2).getElement().style.opacity).to.equal("");
  });

  it("should be updated whenever flicking moves", () => {
    // Given & When
    flicking.addPlugins(new Fade());
    flicking.moveTo(1, 0);

    // Then
    expect(flicking.getPanel(1).getElement().style.opacity).to.equal("1");
  });
});
