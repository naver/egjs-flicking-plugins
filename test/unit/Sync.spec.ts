import Flicking from "@egjs/flicking";

import Sync from "../../src/Sync";
import { sandbox, cleanup, waitEvent } from "../unit/utils";

describe("Sync", () => {
  let flicking0: Flicking;
  let flicking1: Flicking;

  beforeEach(() => {
    const wrapper0 = sandbox("flick0");
    wrapper0.style.width = "199px";
    wrapper0.className = "flicking-viewport";
    wrapper0.innerHTML = `
      <div class="flicking-camera">
        <div style="width: 200px; height: 200px;"><p></p></div>
        <div style="width: 200px; height: 200px;"><p></p></div>
        <div style="width: 200px; height: 200px;"><p></p></div>
      </div>
    `;
    flicking0 = new Flicking(wrapper0);

    const wrapper1 = sandbox("flick1");
    wrapper1.style.width = "199px";
    wrapper1.className = "flicking-viewport";
    wrapper1.innerHTML = `
      <div class="flicking-camera">
        <div style="width: 200px; height: 200px;"><p></p></div>
        <div style="width: 200px; height: 200px;"><p></p></div>
        <div style="width: 200px; height: 200px;"><p></p></div>
        <div style="width: 200px; height: 200px;"><p></p></div>
        <div style="width: 200px; height: 200px;"><p></p></div>
        <div style="width: 200px; height: 200px;"><p></p></div>
        <div style="width: 200px; height: 200px;"><p></p></div>
      </div>
    `;
    flicking1 = new Flicking(wrapper1);
  });

  afterEach(() => {
    cleanup();
    flicking0.destroy();
    flicking1.destroy();
  });

  it("main flicking should move with other flickings", async () => {
    // Given
    flicking0.addPlugins(new Sync({
      type: "camera",
      synchronizedFlickingOptions: [
        {
          flicking: flicking0
        },
        {
          flicking: flicking1
        }
      ]
    }));
    await waitEvent(flicking0, "ready");

    // When
    void flicking0.control.moveToPosition(200, 0);

    // Then
    expect(flicking1.camera.position).not.to.equal(100);
  });

  it("other flickings should move main flicking", async () => {
    // Given
    flicking0.addPlugins(new Sync({
      type: "camera",
      synchronizedFlickingOptions: [
        {
          flicking: flicking0
        },
        {
          flicking: flicking1
        }
      ]
    }));
    await waitEvent(flicking1, "ready");

    // When
    void flicking1.control.moveToPosition(200, 0);

    // Then
    expect(flicking0.camera.position).not.to.equal(100);
  });
});
