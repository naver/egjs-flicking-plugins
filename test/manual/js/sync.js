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

const flicking3 = new Flicking("#flick3");

const flicking4 = new Flicking("#flick4", {
  bound: true,
});

flicking3.addPlugins(new Flicking.Plugins.Sync({
  thumbs: flicking4
}));
