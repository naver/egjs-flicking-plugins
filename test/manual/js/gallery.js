const flicking0 = new Flicking("#flick0");

const flicking1 = new Flicking("#flick1", {
  bound: true,
});

flicking0.addPlugins(new Flicking.Plugins.Gallery({
  thumbs: flicking1
}));
