import { DIRECTION, FlickingError } from "@egjs/flicking";

import { PAGINATION } from "../../const";
import { BROWSER } from "../../event";
import { addClass, removeClass } from "../../utils";

import Renderer from "./Renderer";

class ScrollBulletRenderer extends Renderer {
  private _bullets: HTMLElement[] = [];
  private _bulletSize: number = 0;
  private _previousIndex: number = -1;
  private _sliderIndex: number = -1;

  public render() {
    const wrapper = this._wrapper;
    const flicking = this._flicking;
    const pagination = this._pagination;
    const renderBullet = pagination.renderBullet;
    const anchorPoints = flicking.camera.anchorPoints;

    const dynamicWrapperClass = `${pagination.classPrefix}-${PAGINATION.SCROLL_WRAPPER_SUFFIX}`;
    const bulletClass = `${pagination.classPrefix}-${PAGINATION.BULLET_SUFFIX}`;
    const sliderClass = `${pagination.classPrefix}-${PAGINATION.SCROLL_SLIDER_SUFFIX}`;
    const uninitClass = `${pagination.classPrefix}-${PAGINATION.SCROLL_UNINIT_SUFFIX}`;

    const sliderEl = document.createElement("div");

    addClass(sliderEl, sliderClass);
    addClass(wrapper, uninitClass);
    addClass(wrapper, dynamicWrapperClass);
    wrapper.appendChild(sliderEl);

    sliderEl.innerHTML = anchorPoints
      .map((_, index) => renderBullet(bulletClass, index))
      .join("\n");

    const bullets = [].slice.call(sliderEl.children) as HTMLElement[];

    bullets.forEach((bullet, index) => {
      const anchorPoint = anchorPoints[index];

      bullet.addEventListener(BROWSER.MOUSE_DOWN, e => {
        e.stopPropagation();
      });

      bullet.addEventListener(BROWSER.TOUCH_START, e => {
        e.stopPropagation();
      });

      bullet.addEventListener(BROWSER.CLICK, () => {
        flicking.moveTo(anchorPoint.panel.index)
          .catch(err => {
            if (err instanceof FlickingError) return;
            throw err;
          });
      });
    });

    if (bullets.length <= 0) return;

    const bulletStyle = getComputedStyle(bullets[0]);
    const bulletSize = bullets[0].clientWidth + parseFloat(bulletStyle.marginLeft) + parseFloat(bulletStyle.marginRight);

    wrapper.style.width = `${bulletSize * pagination.dynamicBulletCount}px`;

    this._bullets = bullets;
    this._bulletSize = bulletSize;

    this.update(this._flicking.index);

    window.requestAnimationFrame(() => {
      removeClass(wrapper, uninitClass);
    });
  }

  public update(index: number) {
    const pagination = this._pagination;
    const flicking = this._flicking;
    const bullets = this._bullets;
    const prevIndex = this._previousIndex;

    const anchorPoints = flicking.camera.anchorPoints;
    const anchorOffset = anchorPoints[0].panel.index;
    const activeIndex = index - anchorOffset;

    if (anchorPoints.length <= 0) return;

    const bulletClass = `${pagination.classPrefix}-${PAGINATION.BULLET_SUFFIX}`;
    const bulletActiveClass = `${pagination.classPrefix}-${PAGINATION.BULLET_ACTIVE_SUFFIX}`;
    const bulletPrevClass = (offset: number) => `${pagination.classPrefix}-${PAGINATION.SCROLL_PREV_SUFFIX}${offset > 1 ? offset : ""}`;
    const bulletNextClass = (offset: number) => `${pagination.classPrefix}-${PAGINATION.SCROLL_NEXT_SUFFIX}${offset > 1 ? offset : ""}`;

    bullets.forEach((bullet, idx) => {
      const indexOffset = idx - activeIndex;

      if (indexOffset === 0) {
        bullet.className = `${bulletClass} ${bulletActiveClass}`;
      } else if (indexOffset > 0) {
        bullet.className = `${bulletClass} ${bulletNextClass(Math.abs(indexOffset))}`;
      } else {
        bullet.className = `${bulletClass} ${bulletPrevClass(Math.abs(indexOffset))}`;
      }
    });

    pagination.scrollOnChange(activeIndex, {
      total: bullets.length,
      prevIndex: prevIndex,
      sliderIndex: this._sliderIndex,
      direction: activeIndex > prevIndex ? DIRECTION.NEXT : DIRECTION.PREV,
      bullets: [...bullets],
      moveTo: this.moveTo
    });

    this._previousIndex = activeIndex;
  }

  public moveTo = (index: number): void => {
    const pagination = this._pagination;
    const sliderEl = this._wrapper.firstElementChild as HTMLElement;
    const bulletSize = this._bulletSize;
    const wrapperSize = bulletSize * pagination.dynamicBulletCount;

    sliderEl.style.transform = `translate(${wrapperSize / 2 - (index + 0.5) * bulletSize}px)`;
    this._sliderIndex = index;
  };
}

export default ScrollBulletRenderer;
