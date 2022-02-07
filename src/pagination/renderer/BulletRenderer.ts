import { FlickingError } from "@egjs/flicking";

import { PAGINATION } from "../../const";
import { BROWSER } from "../../event";
import { addClass, removeClass } from "../../utils";

import Renderer from "./Renderer";

class BulletRenderer extends Renderer {
  private _childs: HTMLElement[] = [];

  public render() {
    const flicking = this._flicking;
    const pagination = this._pagination;
    const renderBullet = pagination.renderBullet;
    const bulletWrapperClass = `${pagination.classPrefix}-${PAGINATION.BULLET_WRAPPER_SUFFIX}`;
    const bulletClass = `${pagination.classPrefix}-${PAGINATION.BULLET_SUFFIX}`;
    const bulletActiveClass = `${pagination.classPrefix}-${PAGINATION.BULLET_ACTIVE_SUFFIX}`;
    const anchorPoints = flicking.camera.anchorPoints;
    const wrapper = this._wrapper;

    addClass(wrapper, bulletWrapperClass);

    wrapper.innerHTML = anchorPoints
      .map((_, index) => renderBullet(bulletClass, index))
      .join("\n");

    const bullets = [].slice.call(wrapper.children) as HTMLElement[];

    bullets.forEach((bullet, index) => {
      const anchorPoint = anchorPoints[index];

      if (anchorPoint.panel.index === flicking.index) {
        addClass(bullet, bulletActiveClass);
      }

      bullet.addEventListener(BROWSER.MOUSE_DOWN, e => {
        e.stopPropagation();
      });

      bullet.addEventListener(BROWSER.TOUCH_START, e => {
        e.stopPropagation();
      }, { passive: true });

      bullet.addEventListener(BROWSER.CLICK, () => {
        flicking.moveTo(anchorPoint.panel.index)
          .catch(err => {
            if (err instanceof FlickingError) return;
            throw err;
          });
      });
    });

    this._childs = bullets;
  }

  public update(index: number) {
    const flicking = this._flicking;
    const pagination = this._pagination;
    const bullets = this._childs;
    const activeClass = `${pagination.classPrefix}-${PAGINATION.BULLET_ACTIVE_SUFFIX}`;
    const anchorPoints = flicking.camera.anchorPoints;

    if (anchorPoints.length <= 0) return;

    bullets.forEach(bullet => {
      removeClass(bullet, activeClass);
    });

    const anchorOffset = anchorPoints[0].panel.index;
    const activeBullet = bullets[index - anchorOffset];

    addClass(activeBullet, activeClass);
  }
}

export default BulletRenderer;
