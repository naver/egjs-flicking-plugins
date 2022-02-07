import Flicking, { EVENTS } from "@egjs/flicking";

declare let Simulator: any;

export const tick = (time: number) => {
  (window as any).timer.tick(time);
};

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

  return viewport;
};

export const createPaginationFixture = () => {
  const defaultFixture = createFlickingFixture();
  const paginationWrapper = document.createElement("div");

  paginationWrapper.className = "flicking-pagination";
  defaultFixture.appendChild(paginationWrapper);

  return defaultFixture;
};

export const createArrowFixture = () => {
  const defaultFixture = createFlickingFixture();
  const prevArrow = document.createElement("span");
  const nextArrow = document.createElement("span");

  prevArrow.className = "flicking-arrow-prev";
  nextArrow.className = "flicking-arrow-next";

  defaultFixture.appendChild(prevArrow);
  defaultFixture.appendChild(nextArrow);

  return defaultFixture;
};

export const createFlicking = async (el: HTMLElement, option: ConstructorParameters<typeof Flicking>[1] = {}): Promise<Flicking> => {
  const flicking = new Flicking(el, option);

  if (!flicking.autoInit) return Promise.resolve(flicking);

  return new Promise(resolve => {
    flicking.once(EVENTS.READY, () => resolve(flicking));
  });
};


export const simulate = (el: HTMLElement, option: Partial<{
  pos: [number, number];
  deltaX: number;
  deltaY: number;
  duration: number;
  easing: string;
}> = {}, time: number = 10000): Promise<void> => {
  const elBbox = el.getBoundingClientRect();

  return new Promise<void>(resolve => {
    Simulator.gestures.pan(el, {
      pos: [elBbox.left + elBbox.width / 2, elBbox.top + elBbox.height / 2],
      deltaX: 0,
      deltaY: 0,
      duration: 500,
      easing: "linear",
      ...option
    }, resolve);

    tick(time);
  });
};

export const waitEvent = (flicking: Flicking, eventName: typeof EVENTS[keyof typeof EVENTS]) => new Promise(res => {
  flicking.once(eventName, res);
});
