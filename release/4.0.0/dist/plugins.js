/*
Copyright (c) 2019-present NAVER Corp.
name: @egjs/flicking-plugins
license: MIT
author: NAVER Corp.
repository: https://github.com/naver/egjs-flicking-plugins
version: 4.0.0
*/
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@egjs/flicking')) :
  typeof define === 'function' && define.amd ? define(['exports', '@egjs/flicking'], factory) :
  (global = global || self, factory((global.Flicking = global.Flicking || {}, global.Flicking.Plugins = {}), global.Flicking));
}(this, function (exports, flicking) { 'use strict';

  /**
   * You can apply parallax effect while panel is moving.
   * @ko 패널들을 움직이면서 parallax 효과를 부여할 수 있습니다.
   * @memberof Flicking.Plugins
   */

  var Parallax =
  /*#__PURE__*/
  function () {
    /**
     * @param {string} selector Selector of the element to apply parallax effect<ko> Parallax 효과를 적용할 엘리먼트의 선택자 </ko>
     * @param {number} scale Effect amplication scale<ko>효과 증폭도</ko>
     * @example
     * ```ts
     * flicking.addPlugins(new Parallax("img", 1));
     * ```
     */
    function Parallax(selector, scale) {
      var _this = this;

      if (selector === void 0) {
        selector = "";
      }

      if (scale === void 0) {
        scale = 1;
      }

      this.update = function () {
        _this._onMove();
      };

      this._onMove = function () {
        var flicking = _this._flicking;
        if (!flicking) return;
        var panels = flicking.visiblePanels;
        panels.forEach(function (panel) {
          var progress = panel.outsetProgress;
          var el = panel.element;
          var target = _this._selector ? el.querySelector(_this._selector) : el;
          var parentTarget = target.parentNode;
          var rect = target.getBoundingClientRect();
          var parentRect = parentTarget.getBoundingClientRect();
          var position = (parentRect.width - rect.width) / 2 * progress * _this._scale;
          var transform = "translate(-50%) translate(" + position + "px)";
          var style = target.style;
          style.cssText += "transform: " + transform + ";-webkit-transform: " + transform + ";-ms-transform:" + transform;
        });
      };

      this._flicking = null;
      this._selector = selector;
      this._scale = scale;
    }

    var __proto = Parallax.prototype;
    Object.defineProperty(__proto, "selector", {
      get: function () {
        return this._selector;
      },
      set: function (val) {
        this._selector = val;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(__proto, "scale", {
      get: function () {
        return this._scale;
      },
      set: function (val) {
        this._scale = val;
      },
      enumerable: false,
      configurable: true
    });

    __proto.init = function (flicking$1) {
      if (this._flicking) {
        this.destroy();
      }

      this._flicking = flicking$1;
      flicking$1.on(flicking.EVENTS.MOVE, this._onMove);
      flicking$1.on(flicking.EVENTS.AFTER_RESIZE, this.update);

      this._onMove();
    };

    __proto.destroy = function () {
      if (!this._flicking) return;

      this._flicking.off(flicking.EVENTS.MOVE, this._onMove);

      this._flicking = null;
    };

    return Parallax;
  }();

  /**
   * You can apply fade in / out effect while panel is moving.
   * @ko 패널들을 움직이면서 fade in / out 효과를 부여할 수 있습니다.
   * @memberof Flicking.Plugins
   */

  var Fade =
  /*#__PURE__*/
  function () {
    /**
     * @param - The selector of the element to which the fade effect is to be applied. If the selector is blank, it applies to panel element. <ko>Fade 효과를 적용할 대상의 선택자. 선택자가 공백이면 패널 엘리먼트에 적용된다.</ko>
     * @param - Effect amplication scale<ko>효과 증폭도</ko>
     * @example
     * ```ts
     * flicking.addPlugins(new Fade("p", 1));
     * ```
     */
    function Fade(selector, scale) {
      var _this = this;

      if (selector === void 0) {
        selector = "";
      }

      if (scale === void 0) {
        scale = 1;
      }

      this.update = function () {
        _this._onMove();
      };

      this._onMove = function () {
        var flicking = _this._flicking;
        var selector = _this._selector;
        var scale = _this._scale;
        if (!flicking) return;
        var panels = flicking.visiblePanels;
        panels.forEach(function (panel) {
          var progress = panel.outsetProgress;
          var el = panel.element;
          var target = selector ? el.querySelector(selector) : el;
          var opacity = Math.min(1, Math.max(0, 1 - Math.abs(progress * scale)));
          target.style.opacity = "" + opacity;
        });
      };

      this._flicking = null;
      this._selector = selector;
      this._scale = scale;
    }

    var __proto = Fade.prototype;
    Object.defineProperty(__proto, "selector", {
      get: function () {
        return this._selector;
      },
      set: function (val) {
        this._selector = val;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(__proto, "scale", {
      get: function () {
        return this._scale;
      },
      set: function (val) {
        this._scale = val;
      },
      enumerable: false,
      configurable: true
    });

    __proto.init = function (flicking$1) {
      if (this._flicking) {
        this.destroy();
      }

      this._flicking = flicking$1;
      flicking$1.on(flicking.EVENTS.MOVE, this._onMove);
      flicking$1.on(flicking.EVENTS.AFTER_RESIZE, this.update);

      this._onMove();
    };

    __proto.destroy = function () {
      if (!this._flicking) return;

      this._flicking.off(flicking.EVENTS.MOVE, this._onMove);

      this._flicking = null;
    };

    return Fade;
  }();

  /**
   * Plugin that allow you to automatically move to the next/previous panel, on a specific time basis
   * @ko 일정 시간마다, 자동으로 다음/이전 패널로 넘어가도록 할 수 있는 플러그인
   * @memberof Flicking.Plugins
   */

  var AutoPlay =
  /*#__PURE__*/
  function () {
    /**
     * @param {AutoPlayOptions} options Options for the AutoPlay instance.<ko>AutoPlay 옵션</ko>
     * @param {number} options.duration Time to wait before moving on to the next panel.<ko>다음 패널로 움직이기까지 대기 시간</ko>
     * @param {"PREV" | "NEXT"} options.direction The direction in which the panel moves.<ko>패널이 움직이는 방향</ko>
     * @param {boolean} options.stopOnHover Whether to stop when mouse hover upon the element.<ko>엘리먼트에 마우스를 올렸을 때 AutoPlay를 정지할지 여부</ko>
     * @example
     * ```ts
     * flicking.addPlugins(new AutoPlay({ duration: 2000, direction: "NEXT" }));
     * ```
     */
    function AutoPlay(_a) {
      var _this = this;

      var _b = _a === void 0 ? {} : _a,
          _c = _b.duration,
          duration = _c === void 0 ? 2000 : _c,
          _d = _b.direction,
          direction = _d === void 0 ? flicking.DIRECTION.NEXT : _d,
          _e = _b.stopOnHover,
          stopOnHover = _e === void 0 ? false : _e;
      /* Internal Values */


      this._flicking = null;
      this._timerId = 0;
      this._mouseEntered = false;

      this.play = function () {
        var flicking$1 = _this._flicking;
        var direction = _this._direction;

        if (!flicking$1) {
          return;
        }

        _this.stop();

        if (_this._mouseEntered || flicking$1.animating) {
          return;
        }

        _this._timerId = window.setTimeout(function () {
          if (direction === flicking.DIRECTION.NEXT) {
            flicking$1.next().catch(function () {
              return void 0;
            });
          } else {
            flicking$1.prev().catch(function () {
              return void 0;
            });
          }

          _this.play();
        }, _this._duration);
      };

      this.stop = function () {
        clearTimeout(_this._timerId);
      };

      this._onMouseEnter = function () {
        _this._mouseEntered = true;

        _this.stop();
      };

      this._onMouseLeave = function () {
        _this._mouseEntered = false;

        _this.play();
      };

      this._duration = duration;
      this._direction = direction;
      this._stopOnHover = stopOnHover;
    }

    var __proto = AutoPlay.prototype;
    Object.defineProperty(__proto, "duration", {
      get: function () {
        return this._duration;
      },
      set: function (val) {
        this._duration = val;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(__proto, "direction", {
      get: function () {
        return this._direction;
      },
      set: function (val) {
        this._direction = val;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(__proto, "stopOnHover", {
      get: function () {
        return this._stopOnHover;
      },
      set: function (val) {
        this._stopOnHover = val;
      },
      enumerable: false,
      configurable: true
    });

    __proto.init = function (flicking$1) {
      var _a;

      if (this._flicking) {
        this.destroy();
      }

      flicking$1.on((_a = {}, _a[flicking.EVENTS.MOVE_START] = this.stop, _a[flicking.EVENTS.HOLD_START] = this.stop, _a[flicking.EVENTS.MOVE_END] = this.play, _a[flicking.EVENTS.SELECT] = this.play, _a));
      this._flicking = flicking$1;

      if (this._stopOnHover) {
        var targetEl = this._flicking.element;
        targetEl.addEventListener("mouseenter", this._onMouseEnter, false);
        targetEl.addEventListener("mouseleave", this._onMouseLeave, false);
      }

      this.play();
    };

    __proto.destroy = function () {
      var flicking$1 = this._flicking;
      this._mouseEntered = false;
      this.stop();

      if (!flicking$1) {
        return;
      }

      flicking$1.off(flicking.EVENTS.MOVE_START, this.stop);
      flicking$1.off(flicking.EVENTS.HOLD_START, this.stop);
      flicking$1.off(flicking.EVENTS.MOVE_END, this.play);
      flicking$1.off(flicking.EVENTS.SELECT, this.play);
      var targetEl = flicking$1.element;
      targetEl.removeEventListener("mouseenter", this._onMouseEnter, false);
      targetEl.removeEventListener("mouseleave", this._onMouseLeave, false);
      this._flicking = null;
    };

    __proto.update = function () {// DO-NOTHING
    };

    return AutoPlay;
  }();

  /**
   * @namespace Flicking
   */

  exports.AutoPlay = AutoPlay;
  exports.Fade = Fade;
  exports.Parallax = Parallax;

}));
//# sourceMappingURL=plugins.js.map
