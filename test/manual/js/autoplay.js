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


const flicking3 = new Flicking("#autoplay2", {
  align: "prev",
  moveType: "freeScroll",
  circular: true,
  easing: x => x
  // duration: 5000,
});

// AutoPlay
const autoplay3 = new Flicking.Plugins.AutoPlay({
  direction: "prev",
  duration: 0,
  animationDuration: 1000
});
flicking3.addPlugins(autoplay3);
