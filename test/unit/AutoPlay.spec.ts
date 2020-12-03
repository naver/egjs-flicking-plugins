import Flicking from "@egjs/flicking";
import * as sinon from "sinon";
import AutoPlay from "../../src/AutoPlay";
import { tick } from "./utils";

describe("AutoPlay", () => {
  it("can receive older API of receiving duration and direction", () => {
    // Given & When
    const plugin = new AutoPlay(500 as any, "PREV");

    // Then
    expect((plugin as any).duration).to.equal(500);
    expect((plugin as any).direction).to.equal("PREV");
  });

  it("should call play after initializing", () => {
    // Given
    const plugin = new AutoPlay();
    const flicking = new Flicking(document.createElement("div"));
    const playSpy = sinon.spy();

    plugin.play = playSpy;

    // When
    flicking.addPlugins(plugin);

    // Then
    expect(playSpy.calledOnce).to.be.true;
  });

  it("should call Flicking's move method after duration", () => {
    // Given
    const plugin = new AutoPlay({ direction: "NEXT", duration: 500 });
    const flicking = new Flicking(document.createElement("div"));
    const nextSpy = sinon.spy();

    flicking.next = nextSpy;

    // When
    flicking.addPlugins(plugin);

    // Then
    expect(nextSpy.called).to.be.false;
    tick(500);
    expect(nextSpy.calledOnce).to.be.true;
  });

  it("can stop autoplay if stop is called before duration", () => {
    // Given
    const plugin = new AutoPlay({ direction: "NEXT", duration: 500 });
    const flicking = new Flicking(document.createElement("div"));
    const nextSpy = sinon.spy();

    flicking.next = nextSpy;

    // When
    flicking.addPlugins(plugin);

    // Then
    expect(nextSpy.called).to.be.false;
    tick(250);
    expect(nextSpy.called).to.be.false;
    plugin.stop();
    tick(500);
    expect(nextSpy.called).to.be.false;
  });

  it("should call stop if mouse is entered and stopOnHover is true", () => {
    // Given
    const plugin = new AutoPlay({ stopOnHover: true });
    const flicking = new Flicking(document.createElement("div"));
    const stopSpy = sinon.spy();

    plugin.stop = stopSpy;

    // When
    flicking.addPlugins(plugin);
    const wrapper = flicking.getElement();

    // Then
    expect(stopSpy.calledOnce).to.be.true; // removing previous one
    wrapper.dispatchEvent(new Event("mouseenter"));
    expect(stopSpy.calledTwice).to.be.true;
  });

  it("should call play if mouse leaved and stopOnHover is true", () => {
    // Given
    const plugin = new AutoPlay({ stopOnHover: true });
    const flicking = new Flicking(document.createElement("div"));
    const playSpy = sinon.spy();

    plugin.play = playSpy;

    // When
    flicking.addPlugins(plugin);
    const wrapper = flicking.getElement();

    // Then
    expect(playSpy.calledOnce).to.be.true; // first play call
    wrapper.dispatchEvent(new Event("mouseleave"));
    expect(playSpy.calledTwice).to.be.true;
  });

  it("should detach flicking event handlers when destroyed", () => {
    // Given
    const plugin = new AutoPlay({ stopOnHover: true });
    const flicking = new Flicking(document.createElement("div"));
    const playSpy = sinon.spy();
    const stopSpy = sinon.spy();

    plugin.play = playSpy;
    plugin.stop = stopSpy;

    // When
    flicking.addPlugins(plugin);
    plugin.destroy();
    playSpy.resetHistory();
    stopSpy.resetHistory();

    flicking.next(500);
    tick(500);

    // Then
    expect(playSpy.called).to.be.false;
    expect(stopSpy.called).to.be.false;
  });

  it("won't call next if Flicking is already moving", () => {
    // Given
    const plugin = new AutoPlay({ duration: 500, stopOnHover: true });
    const flicking = new Flicking(document.createElement("div"));
    const nextSpy = sinon.spy();

    // When
    flicking.isPlaying = () => true;
    flicking.next = nextSpy;
    flicking.addPlugins(plugin);
    tick(1000);

    // Then
    expect(nextSpy.called).to.be.false;
  });
});
