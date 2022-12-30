/* eslint-disable @typescript-eslint/no-unused-expressions */
import Flicking, { EVENTS } from "@egjs/flicking";
import * as sinon from "sinon";

import AutoPlay from "../../src/AutoPlay";

import { cleanup, createFlickingFixture, sandbox, tick, waitEvent } from "./utils";

describe("AutoPlay", () => {
  it("can receive older API of receiving duration and direction", () => {
    // Given & When
    const plugin = new AutoPlay({ duration: 500, direction: "PREV" });

    // Then
    expect(plugin.duration).to.equal(500);
    expect(plugin.direction).to.equal("PREV");
  });

  it("should call play after initializing", async () => {
    // Given
    const plugin = new AutoPlay();
    const flicking = new Flicking(createFlickingFixture());
    const playSpy = sinon.spy(plugin, "play");

    // When
    flicking.addPlugins(plugin);
    await waitEvent(flicking, "ready");

    // Then
    expect(playSpy.calledOnce).to.be.true;
  });

  it("should call Flicking's move method after duration", async () => {
    // Given
    const plugin = new AutoPlay({ direction: "NEXT", duration: 500 });
    const flicking = new Flicking(createFlickingFixture());
    const nextStub = sinon.stub(flicking, "next");

    nextStub.resolves(void 0);

    // When
    flicking.addPlugins(plugin);
    await waitEvent(flicking, "ready");

    // Then
    expect(nextStub.called).to.be.false;
    tick(500);
    expect(nextStub.calledOnce).to.be.true;
  });

  it("should apply animationDuration to animation when moving panel", async () => {
    // Given
    const plugin = new AutoPlay({ direction: "NEXT", duration: 500, animationDuration: 200 });
    const flicking = new Flicking(createFlickingFixture());
    const nextSpy = sinon.spy(flicking, "next");

    // When
    flicking.addPlugins(plugin);
    await waitEvent(flicking, "ready");

    // Then
    expect(nextSpy.called).to.be.false;
    tick(500);
    expect(nextSpy.calledOnce).to.be.true;
    expect(nextSpy.firstCall.calledWith(200)).to.be.true;
  });

  it("can stop autoplay if stop is called before duration", () => {
    // Given
    const plugin = new AutoPlay({ direction: "NEXT", duration: 500 });
    const flicking = new Flicking(createFlickingFixture());
    const nextStub = sinon.stub(flicking, "next");

    nextStub.resolves(void 0);

    // When
    flicking.addPlugins(plugin);

    // Then
    expect(nextStub.called).to.be.false;
    tick(250);
    expect(nextStub.called).to.be.false;
    plugin.stop();
    tick(500);
    expect(nextStub.called).to.be.false;
  });

  it("should call stop if mouse is entered and stopOnHover is true", async () => {
    // Given
    const plugin = new AutoPlay({ stopOnHover: true });
    const flicking = new Flicking(createFlickingFixture());
    const stopSpy = sinon.spy();

    plugin.stop = stopSpy;

    // When
    flicking.addPlugins(plugin);
    await waitEvent(flicking, "ready");
    const wrapper = flicking.element;

    // Then
    expect(stopSpy.calledOnce).to.be.true; // removing previous one
    wrapper.dispatchEvent(new Event("mouseenter"));
    expect(stopSpy.calledTwice).to.be.true;
  });

  it("should call next after duration if mouse leaved and stopOnHover is true", async () => {
    // Given
    const plugin = new AutoPlay({ stopOnHover: true });
    const flicking = new Flicking(createFlickingFixture());
    const nextStub = sinon.stub(flicking, "next");

    nextStub.resolves(void 0);

    // When
    flicking.addPlugins(plugin);
    await waitEvent(flicking, "ready");
    const wrapper = flicking.element;

    // Then
    expect(nextStub.called).to.be.false;
    wrapper.dispatchEvent(new Event("mouseleave"));
    tick(2000);
    expect(nextStub.calledOnce).to.be.true;
    tick(2000);
    expect(nextStub.calledTwice).to.be.true;
  });

  it("should call next after delayAfterHover milliseconds when mouse leaved and stopOnHover is true", async () => {
    // Given
    const plugin = new AutoPlay({
      direction: "NEXT",
      duration: 1000,
      stopOnHover: true,
      delayAfterHover: 500
    });
    const flicking = new Flicking(createFlickingFixture());
    const nextStub = sinon.stub(flicking, "next");

    nextStub.resolves(void 0);

    // When
    flicking.addPlugins(plugin);
    await waitEvent(flicking, "ready");
    const wrapper = flicking.element;

    // Then
    expect(nextStub.called).to.be.false;
    tick(1200);
    expect(nextStub.calledOnce).to.be.true;
    wrapper.dispatchEvent(new Event("mouseenter"));
    tick(1200);
    expect(nextStub.calledOnce).to.be.true;
    wrapper.dispatchEvent(new Event("mouseleave"));
    tick(700);
    expect(nextStub.calledTwice).to.be.true;
  });

  it("should detach flicking event handlers when destroyed", () => {
    // Given
    const plugin = new AutoPlay({ stopOnHover: true });
    const flicking = new Flicking(createFlickingFixture());
    const playSpy = sinon.spy();
    const stopSpy = sinon.spy();

    plugin.play = playSpy;
    plugin.stop = stopSpy;

    // When
    flicking.addPlugins(plugin);
    plugin.destroy();
    playSpy.resetHistory();
    stopSpy.resetHistory();

    void flicking.next(500);
    tick(500);

    // Then
    expect(playSpy.called).to.be.false;
    expect(stopSpy.called).to.be.false;
  });

  it("won't call next if Flicking is already moving", () => {
    // Given
    const plugin = new AutoPlay({ duration: 500, stopOnHover: true });
    const flicking = new Flicking(createFlickingFixture());
    const nextStub = sinon.stub(flicking, "next");

    nextStub.resolves(void 0);

    // When
    const animatingStub = sinon.stub(flicking, "animating");
    animatingStub.get(() => true);

    flicking.addPlugins(plugin);
    tick(1000);

    // Then
    expect(nextStub.called).to.be.false;
  });

  it("should apply the status of autoplay to playing property", async () => {
    // Given
    const plugin = new AutoPlay({ stopOnHover: true });
    const flicking = new Flicking(createFlickingFixture());

    // When
    flicking.addPlugins(plugin);
    await waitEvent(flicking, "ready");
    const wrapper = flicking.element;

    // Then
    expect(plugin.playing).to.be.true;
    wrapper.dispatchEvent(new Event("mouseenter"));
    expect(plugin.playing).to.be.false;
    wrapper.dispatchEvent(new Event("mouseleave"));
    expect(plugin.playing).to.be.true;
  });
});
