import { ComponentEvent } from "@egjs/component";
import Flicking from "@egjs/flicking";

import Sync from "../../src/Sync";
import { sandbox, cleanup, waitEvent, tick } from "../unit/utils";

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
    void flicking0.control.moveToPosition(500, 0);

    // Then
    expect(flicking1.camera.position).equal(1100);
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
    void flicking1.control.moveToPosition(1100, 0);

    // Then
    expect(flicking0.camera.position).equal(500);
    expect(flicking0.camera.position).not.to.equal(100);
  });

  it("active panel should have active class", async () => {
    // Given
    flicking0.addPlugins(new Sync({
      type: "index",
      synchronizedFlickingOptions: [
        {
          flicking: flicking0,
          isSlidable: true
        },
        {
          flicking: flicking1,
          activeClass: "flicking-thumbnail-active"
        }
      ]
    }));
    await waitEvent(flicking0, "ready");

    // When
    void flicking0.moveTo(1, 0);
    tick(1000);

    // Then
    flicking1.panels.forEach((panel, index) => {
      expect(panel.element.className.includes("flicking-thumbnail-active")).equal(index === 3);
    });
  });

  it("slidable flicking should move other flickings", async () => {
    // Given
    flicking0.addPlugins(new Sync({
      type: "index",
      synchronizedFlickingOptions: [
        {
          flicking: flicking0,
          isSlidable: true
        },
        {
          flicking: flicking1
        }
      ]
    }));
    await waitEvent(flicking0, "ready");

    // When
    void flicking0.moveTo(2, 0);
    tick(1000);
    await waitEvent(flicking1, "changed");

    // Then
    expect(flicking1.index).equal(5);
    expect(flicking1.index).not.to.equal(0);
    expect(flicking1.camera.position).equal(1100);
    expect(flicking1.camera.position).not.to.equal(100);
  });

  it("clickable flicking should move other flickings", async () => {
    // Given
    flicking0.addPlugins(new Sync({
      type: "index",
      synchronizedFlickingOptions: [
        {
          flicking: flicking0,
          isClickable: true
        },
        {
          flicking: flicking1
        }
      ]
    }));
    await waitEvent(flicking0, "ready");

    // When
    flicking0.trigger(new ComponentEvent("select", { index: 2, panel: flicking0.getPanel(2), direction: null }));
    tick(1000);
    await waitEvent(flicking1, "changed");

    // Then
    expect(flicking1.index).equal(5);
    expect(flicking1.index).not.to.equal(0);
    expect(flicking1.camera.position).equal(1100);
    expect(flicking1.camera.position).not.to.equal(100);
  });
});
