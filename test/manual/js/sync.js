const flicking0 = new Flicking("#flick0", {
  bound: true,
});

const flicking1 = new Flicking("#flick1", {
  bound: true,
});

const flicking2 = new Flicking("#flick2", {
  bound: true,
});

let others = [flicking1, flicking2];
flicking0.addPlugins(new Flicking.Plugins.Sync({
  others,
}));
