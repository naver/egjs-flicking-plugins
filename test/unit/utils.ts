export function tick(time) {
  (window as any).timer.tick(time);
}

export const sandbox = (obj: object | string, prop?: object): HTMLElement => {
  const tmp = document.createElement("div");
  tmp.className = "_tempSandbox_";
  if (typeof obj === "string") {
    tmp.id = obj;
  } else {
    tmp.id = "sandbox";
  }

  if (typeof obj === "object" || typeof prop === "object") {
    const attrs = typeof prop === "object" ? prop : obj;
    for (const p in attrs as object) {
      if (/class|className/.test(p)) {
        tmp.setAttribute(p, attrs[p] + " _tempSandbox_");
      } else {
        tmp.setAttribute(p, attrs[p]);
      }
    }
  }
  return document.body.appendChild(tmp);
};

export function cleanup() {
  const elements: HTMLElement[] = [].slice.call(document.querySelectorAll("._tempSandbox_"));
  elements.forEach(v => {
    v.parentNode.removeChild(v);
  });
}

export const createFlickingFixture = () => {
  const viewport = document.createElement("div");
  const camera = document.createElement("div");
  const panels = [0, 1, 2].map(() => document.createElement("div"));

  viewport.className = "flicking-viewport";
  camera.className = "flicking-camera";

  viewport.appendChild(camera);
  panels.forEach(panel => camera.appendChild(panel));

  return viewport
}

declare var Simulator: any;
export function simulate(el: HTMLElement, option?: object, time: number = 15000): Promise<void> {
  let targetElement = el.querySelector(".eg-flick-viewport");

  if (!targetElement) {
    targetElement = el;
  }

  return new Promise<void>(resolve => {
    Simulator.gestures.pan(targetElement, {
      pos: [50, 15],
      deltaX: 0,
      deltaY: 0,
      duration: 500,
      easing: "linear",
      ...option,
    }, resolve);

    tick(time);
  });
}
