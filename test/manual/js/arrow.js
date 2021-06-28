const flicking = new Flicking("#arrow", { moveType: "freeScroll" });

flicking.addPlugins(new Flicking.Plugins.Arrow({
  moveByViewportSize: true
}));

const flicking2 = new Flicking("#arrow2", { circular: true });

flicking2.addPlugins(new Flicking.Plugins.Arrow({
  moveCount: 3
}));

const flicking3 = new Flicking("#arrow3");

flicking3.addPlugins(new Flicking.Plugins.Arrow({
  parentEl: document.querySelector("#arrow3-wrapper")
}));
