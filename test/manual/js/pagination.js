const flicking = new Flicking("#pagination");

flicking.addPlugins(new Flicking.Plugins.Pagination());

const flicking2 = new Flicking("#pagination-number");

flicking2.addPlugins(new Flicking.Plugins.Pagination({ type: "fraction" }));
