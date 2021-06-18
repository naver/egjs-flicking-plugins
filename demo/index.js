const flicking = new Flicking("#autoplay", {
  circular: true
});

// AutoPlay
const autoplay = new Flicking.Plugins.AutoPlay({
  stopOnHover: true
});
flicking.addPlugins(autoplay)

document.getElementById("play").addEventListener("click", () => {
  autoplay.play();
});

document.getElementById("stop").addEventListener("click", () => {
  autoplay.stop();
});

const flicking2 = new Flicking("#parallax", {
  circular: true
});

flicking2.addPlugins(new Flicking.Plugins.Parallax("img"));
