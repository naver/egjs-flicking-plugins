const flicking0 = new Flicking("#flick0", {
  bound: true,
  bounce: 30
});

const flicking1 = new Flicking("#flick1", {
  bound: true,
  bounce: 30
});

const flicking2 = new Flicking("#flick2", {
  bound: true,
  bounce: 30
});

const flickings = [flicking0, flicking1, flicking2];

flicking0.addPlugins(new Flicking.Plugins.Sync({
  others: [flicking1, flicking2]
}));
