const containers = Array.from(document.querySelectorAll(".flick-container"));

const flickings = containers.map(el => new eg.Flicking(el, { circular: true }));

// AutoPlay
flickings[0].addPlugins([new eg.Flicking.plugins.AutoPlay({
  stopOnHover: true
})])
