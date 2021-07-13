const flicking0 = new Flicking("#flick0", {
  bound: true,
});

const flicking1 = new Flicking("#flick1", {
  bound: true,
});

const flicking2 = new Flicking("#flick2", {
  bound: true,
});

flicking0.addPlugins(new Flicking.Plugins.Sync({
  type: "camera",
  synchronizedFlickings: [
    {
      flicking: flicking0,
      isClickable: true,
    },
    {
      flicking: flicking1,
      isClickable: true,
    },
    {
      flicking: flicking2,
      isClickable: true,
    }
  ],
}));

const flicking3 = new Flicking("#flick3");

const flicking4 = new Flicking("#flick4", {
  bound: true,
});

flicking0.addPlugins(new Flicking.Plugins.Sync({
  type: "index",
  synchronizedFlickings: [
    {
      flicking: flicking3,
      isSlidable: true,
    },
    {
      flicking: flicking4,
      isClickable: true,
      activeClass: "flicking-thumbnail-active",
    }
  ],
}));