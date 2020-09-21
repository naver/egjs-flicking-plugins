const flicking = new eg.Flicking("#autoplay", {
  circular: true,
});

// AutoPlay
const autoplay = new eg.Flicking.plugins.AutoPlay({
  stopOnHover: true
});
flicking.addPlugins([autoplay])

document.getElementById("play").addEventListener("click", () => {
  autoplay.play();
});

document.getElementById("stop").addEventListener("click", () => {
  autoplay.stop();
});
