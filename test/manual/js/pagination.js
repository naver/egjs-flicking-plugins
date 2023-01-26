const flicking = new Flicking("#pagination", { bound: true });

flicking.addPlugins(new Flicking.Plugins.Pagination());

const flicking1_1 = new Flicking("#pagination2", { bound: true });

flicking1_1.addPlugins(new Flicking.Plugins.Pagination({
  renderBullet: (className, index) => `<span class="${className}">${index + 1}</span>`,
  renderActiveBullet: (className) => `<span class="${className}"></span>`
}));

const flicking2 = new Flicking("#pagination-number");

flicking2.addPlugins(new Flicking.Plugins.Pagination({ type: "fraction" }));

const flicking3 = new Flicking("#pagination-dynamic");

flicking3.addPlugins(new Flicking.Plugins.Pagination({
  type: "scroll",
  renderBullet: (className, index) => `<span class="${className}">${index + 1}</span>`,
  renderActiveBullet: (className) => `<span class="${className}"></span>`
}));

const flicking4 = new Flicking("#pagination-dynamic2");

flicking4.addPlugins(new Flicking.Plugins.Pagination({
  type: "scroll",
  classPrefix: "pagination-bound",
  renderBullet: (className) => `<span class="${className} hi"></span>`,
  scrollOnChange: (index, ctx) => {
    if (ctx.sliderIndex < 0) {
      const firstIndex = Math.min(Math.max(index, 2), ctx.total - 2);
      ctx.moveTo(firstIndex);
      applyBulletSize(firstIndex, ctx);
      return;
    }

    const offset = Math.abs(index - ctx.sliderIndex);
    if (offset < 2) return;

    const newIndex = Math.min(Math.max(index - Math.sign(index - ctx.sliderIndex), 2), ctx.total - 3);
    ctx.moveTo(newIndex);

    applyBulletSize(newIndex, ctx);
  }
}));

const applyBulletSize = (newIndex, ctx) => {
  const bullets = ctx.bullets;
  const visibleBullets = bullets.slice(newIndex - 2, newIndex + 3)
    .map((bullet, idx) => ({
      index: newIndex - 2 + idx,
      bullet
    }));

  const middle = visibleBullets.splice(1, 3);

  visibleBullets.forEach(({ index, bullet }) => {
    if (index === 0 || index === ctx.total - 1) {
      bullet.style.transform = "";
    } else {
      bullet.style.transform = "scale(0.5)";
    }
  });

  middle.forEach(({ bullet }) => {
    bullet.style.transform = "";
  });
};

document.querySelector("#remove").addEventListener("click", () => {
  flicking.remove(0, flicking.panelCount);
});

document.querySelector("#add").addEventListener("click", () => {
  flicking.append(`<div class="card mr-2"></div>`);
});
