import { PAGINATION } from "../../const";
import { addClass } from "../../utils";

import Renderer from "./Renderer";

class FractionRenderer extends Renderer {
  public render() {
    const flicking = this._flicking;
    const wrapper = this._wrapper;
    const pagination = this._pagination;
    const fractionWrapperClass = `${pagination.classPrefix}-${PAGINATION.FRACTION_WRAPPER_SUFFIX}`;
    const fractionCurrentClass = `${pagination.classPrefix}-${PAGINATION.FRACTION_CURRENT_SUFFIX}`;
    const fractionTotalClass = `${pagination.classPrefix}-${PAGINATION.FRACTION_TOTAL_SUFFIX}`;

    addClass(wrapper, fractionWrapperClass);

    wrapper.innerHTML = pagination.renderFraction(fractionCurrentClass, fractionTotalClass);

    this.update(flicking.index);
  }

  public update(index: number) {
    const flicking = this._flicking;
    const wrapper = this._wrapper;
    const pagination = this._pagination;
    const fractionCurrentClass = `${pagination.classPrefix}-${PAGINATION.FRACTION_CURRENT_SUFFIX}`;
    const fractionTotalClass = `${pagination.classPrefix}-${PAGINATION.FRACTION_TOTAL_SUFFIX}`;

    const currentWrapper = wrapper.querySelector(`.${fractionCurrentClass}`) as HTMLElement;
    const totalWrapper = wrapper.querySelector(`.${fractionTotalClass}`) as HTMLElement;
    const anchorPoints = flicking.camera.anchorPoints;

    const currentIndex = anchorPoints.length > 0
      ? index - anchorPoints[0].panel.index + 1
      : 0;

    currentWrapper.innerHTML = pagination.fractionCurrentFormat(currentIndex);
    totalWrapper.innerHTML = pagination.fractionTotalFormat(anchorPoints.length);
  }
}

export default FractionRenderer;
