/*
Copyright (c) 2019-present NAVER Corp.
name: @egjs/flicking-plugins
license: MIT
author: NAVER Corp.
repository: https://github.com/naver/egjs-flicking-plugins
version: 4.7.0
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

      this._flicking.off(flicking.EVENTS.AFTER_RESIZE, this.update);

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

          if (target) {
            var opacity = Math.min(1, Math.max(0, 1 - Math.abs(progress * scale)));
            target.style.opacity = "" + opacity;
          }
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

      this._flicking.off(flicking.EVENTS.AFTER_RESIZE, this.update);

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
     * @param {number | undefined} options.animationDuration Duration of animation of moving to the next panel. If undefined, duration option of the Flicking instance is used instead.<ko>패널이 움직이는 애니메이션의 지속 시간, undefined라면 Flicking 인스턴스의 duration 값을 사용한다</ko>
     * @param {"PREV" | "NEXT"} options.direction The direction in which the panel moves.<ko>패널이 움직이는 방향</ko>
     * @param {boolean} options.stopOnHover Whether to stop when mouse hover upon the element.<ko>엘리먼트에 마우스를 올렸을 때 AutoPlay를 정지할지 여부</ko>
     * @param {number} options.delayAfterHover If stopOnHover is true, the amount of time to wait before moving on to the next panel when mouse leaves the element.<ko>stopOnHover를 사용한다면 마우스가 엘리먼트로부터 나간 뒤 다음 패널로 움직이기까지 대기 시간</ko>
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
          _d = _b.animationDuration,
          animationDuration = _d === void 0 ? undefined : _d,
          _e = _b.direction,
          direction = _e === void 0 ? flicking.DIRECTION.NEXT : _e,
          _f = _b.stopOnHover,
          stopOnHover = _f === void 0 ? false : _f,
          delayAfterHover = _b.delayAfterHover;
      /* Internal Values */


      this._flicking = null;
      this._timerId = 0;
      this._mouseEntered = false;
      this._playing = false;

      this.play = function () {
        _this._movePanel(_this._duration);
      };

      this.stop = function () {
        _this._playing = false;
        clearTimeout(_this._timerId);
      };

      this._onMouseEnter = function () {
        _this._mouseEntered = true;

        _this.stop();
      };

      this._onMouseLeave = function () {
        _this._mouseEntered = false;

        _this._movePanel(_this._delayAfterHover);
      };

      this._duration = duration;
      this._animationDuration = animationDuration;
      this._direction = direction;
      this._stopOnHover = stopOnHover;
      this._delayAfterHover = delayAfterHover !== null && delayAfterHover !== void 0 ? delayAfterHover : duration;
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
    Object.defineProperty(__proto, "animationDuration", {
      get: function () {
        return this._animationDuration;
      },
      set: function (val) {
        this._animationDuration = val;
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
    Object.defineProperty(__proto, "delayAfterHover", {
      get: function () {
        return this._delayAfterHover;
      },
      set: function (val) {
        this._delayAfterHover = val;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(__proto, "playing", {
      get: function () {
        return this._playing;
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

    __proto._movePanel = function (duration) {
      var _this = this;

      var flicking$1 = this._flicking;
      var direction = this._direction;

      if (!flicking$1) {
        return;
      }

      this.stop();

      if (this._mouseEntered || flicking$1.animating) {
        return;
      }

      this._playing = true;
      this._timerId = window.setTimeout(function () {
        if (direction === flicking.DIRECTION.NEXT) {
          flicking$1.next(_this._animationDuration).catch(function () {
            return void 0;
          });
        } else {
          flicking$1.prev(_this._animationDuration).catch(function () {
            return void 0;
          });
        }

        _this.play();
      }, duration);
    };

    return AutoPlay;
  }();

  var BROWSER = {
    CLICK: "click",
    MOUSE_DOWN: "mousedown",
    TOUCH_START: "touchstart"
  };

  var ARROW = {
    PREV_SELECTOR: ".flicking-arrow-prev",
    NEXT_SELECTOR: ".flicking-arrow-next",
    DISABLED_CLASS: "flicking-arrow-disabled"
  };
  var PAGINATION = {
    SELECTOR: ".flicking-pagination",
    PREFIX: "flicking-pagination",
    BULLET_WRAPPER_SUFFIX: "bullets",
    BULLET_SUFFIX: "bullet",
    BULLET_ACTIVE_SUFFIX: "bullet-active",
    FRACTION_WRAPPER_SUFFIX: "fraction",
    FRACTION_CURRENT_SUFFIX: "fraction-current",
    FRACTION_TOTAL_SUFFIX: "fraction-total",
    SCROLL_UNINIT_SUFFIX: "uninitialized",
    SCROLL_WRAPPER_SUFFIX: "scroll",
    SCROLL_SLIDER_SUFFIX: "slider",
    SCROLL_PREV_SUFFIX: "bullet-prev",
    SCROLL_NEXT_SUFFIX: "bullet-next",
    TYPE: {
      BULLET: "bullet",
      FRACTION: "fraction",
      SCROLL: "scroll"
    }
  };
  var SYNC = {
    TYPE: {
      CAMERA: "camera",
      INDEX: "index"
    }
  };

  var addClass = function (el, className) {
    if (!el) return;

    if (el.classList) {
      el.classList.add(className);
    } else {
      var classes = el.className.split(" ");

      if (classes.indexOf(className) < 0) {
        el.className = el.className + " " + className;
      }
    }
  };
  var removeClass = function (el, className) {
    if (!el) return;

    if (el.classList) {
      el.classList.remove(className);
    } else {
      var classRegex = new RegExp("( |^)" + className + "( |$)", "g");
      el.className.replace(classRegex, " ");
    }
  };
  var getElement = function (selector, parent, pluginName) {
    var el = parent.querySelector(selector);

    if (!el) {
      throw new Error("[Flicking-" + pluginName + "] Couldn't find element with the given selector: " + selector);
    }

    return el;
  };

  /**
   * A plugin to easily create prev/right arrow button of Flicking
   * @ko 이전/다음 버튼을 쉽게 만들 수 있는 플러그인
   * @memberof Flicking.Plugins
   */

  var Arrow =
  /*#__PURE__*/
  function () {
    function Arrow(_a) {
      var _this = this;

      var _b = _a === void 0 ? {} : _a,
          _c = _b.parentEl,
          parentEl = _c === void 0 ? null : _c,
          _d = _b.prevElSelector,
          prevElSelector = _d === void 0 ? ARROW.PREV_SELECTOR : _d,
          _e = _b.nextElSelector,
          nextElSelector = _e === void 0 ? ARROW.NEXT_SELECTOR : _e,
          _f = _b.disabledClass,
          disabledClass = _f === void 0 ? ARROW.DISABLED_CLASS : _f,
          _g = _b.moveCount,
          moveCount = _g === void 0 ? 1 : _g,
          _h = _b.moveByViewportSize,
          moveByViewportSize = _h === void 0 ? false : _h;
      /* Internal Values */


      this._flicking = null;

      this._preventInputPropagation = function (e) {
        e.stopPropagation();
      };

      this._onPrevClick = function () {
        var flicking = _this._flicking;
        var camera = flicking.camera;
        var anchorPoints = camera.anchorPoints;
        if (flicking.animating || anchorPoints.length <= 0) return;
        var firstAnchor = anchorPoints[0];
        var moveCount = _this._moveCount;

        if (_this._moveByViewportSize) {
          flicking.control.moveToPosition(camera.position - camera.size, flicking.duration).catch(_this._onCatch);
        } else {
          if (flicking.circularEnabled) {
            var targetPanel = flicking.currentPanel;

            for (var i = 0; i < moveCount; i++) {
              targetPanel = targetPanel.prev();
            }

            targetPanel.focus().catch(_this._onCatch);
          } else if (flicking.index > firstAnchor.panel.index) {
            flicking.moveTo(Math.max(flicking.index - moveCount, firstAnchor.panel.index)).catch(_this._onCatch);
          } else if (camera.position > camera.range.min) {
            flicking.moveTo(flicking.index).catch(_this._onCatch);
          }
        }
      };

      this._onNextClick = function () {
        var flicking = _this._flicking;
        var camera = flicking.camera;
        var anchorPoints = camera.anchorPoints;
        if (flicking.animating || anchorPoints.length <= 0) return;
        var lastAnchor = anchorPoints[anchorPoints.length - 1];
        var moveCount = _this._moveCount;

        if (_this._moveByViewportSize) {
          flicking.control.moveToPosition(camera.position + camera.size, flicking.duration).catch(_this._onCatch);
        } else {
          if (flicking.circularEnabled) {
            var targetPanel = flicking.currentPanel;

            for (var i = 0; i < moveCount; i++) {
              targetPanel = targetPanel.next();
            }

            targetPanel.focus().catch(_this._onCatch);
          } else if (flicking.index < lastAnchor.panel.index) {
            flicking.moveTo(Math.min(flicking.index + moveCount, lastAnchor.panel.index)).catch(_this._onCatch);
          } else if (camera.position > camera.range.min) {
            flicking.moveTo(flicking.index).catch(_this._onCatch);
          }
        }
      };

      this._onAnimation = function () {
        var flicking = _this._flicking;
        var camera = flicking.camera;
        var controller = flicking.control.controller;

        if (flicking.holding) {
          _this._updateClass(camera.position);
        } else {
          _this._updateClass(controller.animatingContext.end);
        }
      };

      this._onCatch = function (err) {
        if (err instanceof flicking.FlickingError) return;
        throw err;
      };

      this._parentEl = parentEl;
      this._prevElSelector = prevElSelector;
      this._nextElSelector = nextElSelector;
      this._disabledClass = disabledClass;
      this._moveCount = moveCount;
      this._moveByViewportSize = moveByViewportSize;
    }

    var __proto = Arrow.prototype;
    Object.defineProperty(__proto, "prevEl", {
      get: function () {
        return this._prevEl;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(__proto, "nextEl", {
      get: function () {
        return this._nextEl;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(__proto, "parentEl", {
      get: function () {
        return this._parentEl;
      },
      set: function (val) {
        this._parentEl = val;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(__proto, "prevElSelector", {
      get: function () {
        return this._prevElSelector;
      },
      set: function (val) {
        this._prevElSelector = val;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(__proto, "nextElSelector", {
      get: function () {
        return this._nextElSelector;
      },
      set: function (val) {
        this._nextElSelector = val;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(__proto, "disabledClass", {
      get: function () {
        return this._disabledClass;
      },
      set: function (val) {
        this._disabledClass = val;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(__proto, "moveCount", {
      get: function () {
        return this._moveCount;
      },
      set: function (val) {
        this._moveCount = val;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(__proto, "moveByViewportSize", {
      get: function () {
        return this._moveByViewportSize;
      },
      set: function (val) {
        this._moveByViewportSize = val;
      },
      enumerable: false,
      configurable: true
    });

    __proto.init = function (flicking$1) {
      var _this = this;

      if (this._flicking) {
        this.destroy();
      }

      this._flicking = flicking$1;
      flicking$1.on(flicking.EVENTS.MOVE, this._onAnimation);
      var parentEl = this._parentEl ? this._parentEl : flicking$1.element;
      var prevEl = getElement(this._prevElSelector, parentEl, "Arrow");
      var nextEl = getElement(this._nextElSelector, parentEl, "Arrow");
      [BROWSER.MOUSE_DOWN, BROWSER.TOUCH_START].forEach(function (evt) {
        prevEl.addEventListener(evt, _this._preventInputPropagation, {
          passive: true
        });
        nextEl.addEventListener(evt, _this._preventInputPropagation, {
          passive: true
        });
      });
      prevEl.addEventListener(BROWSER.CLICK, this._onPrevClick);
      nextEl.addEventListener(BROWSER.CLICK, this._onNextClick);
      this._prevEl = prevEl;
      this._nextEl = nextEl;
      this.update();
    };

    __proto.destroy = function () {
      var _this = this;

      var flicking$1 = this._flicking;

      if (!flicking$1) {
        return;
      }

      flicking$1.off(flicking.EVENTS.MOVE, this._onAnimation);
      var prevEl = this._prevEl;
      var nextEl = this._nextEl;
      [BROWSER.MOUSE_DOWN, BROWSER.TOUCH_START].forEach(function (evt) {
        prevEl.removeEventListener(evt, _this._preventInputPropagation);
        nextEl.removeEventListener(evt, _this._preventInputPropagation);
      });
      prevEl.removeEventListener(BROWSER.CLICK, this._onPrevClick);
      nextEl.removeEventListener(BROWSER.CLICK, this._onNextClick);
      this._flicking = null;
    };

    __proto.update = function () {
      this._updateClass(this._flicking.camera.position);
    };

    __proto._updateClass = function (pos) {
      var flicking = this._flicking;
      var disabledClass = this._disabledClass;
      var prevEl = this._prevEl;
      var nextEl = this._nextEl;
      var cameraRange = flicking.camera.range;
      var stopAtPrevEdge = flicking.circularEnabled ? false : pos <= cameraRange.min;
      var stopAtNextEdge = flicking.circularEnabled ? false : pos >= cameraRange.max;

      if (stopAtPrevEdge) {
        addClass(prevEl, disabledClass);
      } else {
        removeClass(prevEl, disabledClass);
      }

      if (stopAtNextEdge) {
        addClass(nextEl, disabledClass);
      } else {
        removeClass(nextEl, disabledClass);
      }
    };

    return Arrow;
  }();

  /**
   * Plugin for synchronizing multiple flickings
   * @ko 다양한 형태로 Flicking들이 같이 움직이게 할 수 있습니다.
   * @memberof Flicking.Plugins
   */

  var Sync =
  /*#__PURE__*/
  function () {
    /** */
    function Sync(_a) {
      var _this = this;

      var _b = _a === void 0 ? {} : _a,
          _c = _b.type,
          type = _c === void 0 ? SYNC.TYPE.CAMERA : _c,
          _d = _b.synchronizedFlickingOptions,
          synchronizedFlickingOptions = _d === void 0 ? [] : _d;
      /* Internal Values */


      this._flicking = null;

      this._addEvents = function () {
        var type = _this._type;
        var synced = _this._synchronizedFlickingOptions;
        synced.forEach(function (_a) {
          var flicking$1 = _a.flicking,
              isSlidable = _a.isSlidable,
              isClickable = _a.isClickable;

          if (type === SYNC.TYPE.CAMERA) {
            flicking$1.on(flicking.EVENTS.MOVE, _this._onMove);
            flicking$1.on(flicking.EVENTS.MOVE_START, _this._onMoveStart);
            flicking$1.on(flicking.EVENTS.MOVE_END, _this._onMoveEnd);
          }

          if (type === SYNC.TYPE.INDEX && isSlidable) {
            flicking$1.on(flicking.EVENTS.WILL_CHANGE, _this._onIndexChange);
            flicking$1.on(flicking.EVENTS.WILL_RESTORE, _this._onIndexChange);
          }

          if (isClickable) {
            flicking$1.on(flicking.EVENTS.SELECT, _this._onSelect);
          }
        });
      };

      this._removeEvents = function () {
        var type = _this._type;
        var synced = _this._synchronizedFlickingOptions;
        synced.forEach(function (_a) {
          var flicking$1 = _a.flicking,
              isSlidable = _a.isSlidable,
              isClickable = _a.isClickable;

          if (type === SYNC.TYPE.CAMERA) {
            flicking$1.off(flicking.EVENTS.MOVE, _this._onMove);
            flicking$1.off(flicking.EVENTS.MOVE_START, _this._onMoveStart);
            flicking$1.off(flicking.EVENTS.MOVE_END, _this._onMoveEnd);
          }

          if (type === SYNC.TYPE.INDEX && isSlidable) {
            flicking$1.off(flicking.EVENTS.WILL_CHANGE, _this._onIndexChange);
            flicking$1.off(flicking.EVENTS.WILL_RESTORE, _this._onIndexChange);
          }

          if (isClickable) {
            flicking$1.off(flicking.EVENTS.SELECT, _this._onSelect);
          }
        });
      };

      this._onIndexChange = function (e) {
        var flicking = e.currentTarget;

        if (!flicking.initialized) {
          return;
        }

        _this._synchronizeByIndex(flicking, e.index);
      };

      this._onMove = function (e) {
        var camera = e.currentTarget.camera;
        var progress = (camera.position - camera.range.min) / camera.rangeDiff;

        _this._synchronizedFlickingOptions.forEach(function (_a) {
          var flicking = _a.flicking;
          if (flicking === e.currentTarget) return;
          var targetPosition = 0;

          if (camera.position < camera.range.min) {
            targetPosition = camera.position;
          } else if (camera.position > camera.range.max) {
            targetPosition = flicking.camera.range.max + camera.position - camera.range.max;
          } else {
            targetPosition = flicking.camera.range.min + flicking.camera.rangeDiff * progress;
          }

          void flicking.camera.lookAt(targetPosition);
        });
      };

      this._onMoveStart = function (e) {
        _this._synchronizedFlickingOptions.forEach(function (_a) {
          var flicking = _a.flicking;

          if (flicking !== e.currentTarget) {
            flicking.disableInput();
          }
        });
      };

      this._onMoveEnd = function (e) {
        _this._synchronizedFlickingOptions.forEach(function (_a) {
          var flicking = _a.flicking;

          if (flicking !== e.currentTarget) {
            flicking.enableInput();
            flicking.control.updateInput();
          }
        });
      };

      this._onSelect = function (e) {
        void e.currentTarget.moveTo(e.index).catch(function () {
          return void 0;
        });

        _this._synchronizeByIndex(e.currentTarget, e.index);
      };

      this._synchronizeByIndex = function (activeFlicking, index) {
        var synchronizedFlickingOptions = _this._synchronizedFlickingOptions;

        _this._preventEvent(function () {
          synchronizedFlickingOptions.forEach(function (options) {
            // Active class should be applied same to the Flicking which triggered event
            _this._updateClass(options, index);

            var flicking$1 = options.flicking;
            if (flicking$1 === activeFlicking) return;
            var targetIndex = flicking.clamp(index, 0, flicking$1.panels.length);

            if (flicking$1.animating) {
              // Reserve moveTo once previous animation is finished
              flicking$1.once(flicking.EVENTS.MOVE_END, function () {
                void flicking$1.moveTo(targetIndex).catch(function () {
                  return void 0;
                });
              });
            } else {
              void flicking$1.moveTo(targetIndex);
            }
          });
        });
      };

      this._updateClass = function (_a, index) {
        var flicking = _a.flicking,
            activeClass = _a.activeClass;
        if (!activeClass) return;
        flicking.panels.forEach(function (panel) {
          if (panel.index === index) {
            addClass(panel.element, activeClass);
          } else {
            removeClass(panel.element, activeClass);
          }
        });
      };

      this._type = type;
      this._synchronizedFlickingOptions = synchronizedFlickingOptions;
    }

    var __proto = Sync.prototype;
    Object.defineProperty(__proto, "type", {
      get: function () {
        return this._type;
      },
      set: function (val) {
        this._type = val;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(__proto, "synchronizedFlickingOptions", {
      get: function () {
        return this._synchronizedFlickingOptions;
      },
      set: function (val) {
        this._synchronizedFlickingOptions = val;
      },
      enumerable: false,
      configurable: true
    });

    __proto.init = function (flicking) {
      var _this = this;

      var synced = this._synchronizedFlickingOptions;

      if (this._flicking) {
        this.destroy();
      }

      this._flicking = flicking;

      this._addEvents();

      synced.forEach(function (options) {
        var syncedFlicking = options.flicking;

        _this._updateClass(options, syncedFlicking.defaultIndex);
      });
    };

    __proto.destroy = function () {
      var flicking = this._flicking;

      if (!flicking) {
        return;
      }

      this._removeEvents();

      this._flicking = null;
    };

    __proto.update = function () {
      var _this = this;

      this._synchronizedFlickingOptions.forEach(function (options) {
        _this._updateClass(options, options.flicking.index);
      });
    };

    __proto._preventEvent = function (fn) {
      this._removeEvents();

      fn();

      this._addEvents();
    };

    return Sync;
  }();

  /* eslint-disable no-underscore-dangle */
  /**
   * You can apply perspective effect while panel is moving.
   * @ko 패널들을 움직이면서 입체감을 부여할 수 있습니다.
   * @memberof Flicking.Plugins
   */

  var Perspective =
  /*#__PURE__*/
  function () {
    /**
     * @param - The selector of the element to which the perspective effect is to be applied. If the selector is blank, it applies to panel element. <ko>입체 효과를 적용할 대상의 선택자. 선택자가 공백이면 패널 엘리먼트에 적용된다.</ko>
     * @param - Effect amplication scale.<ko>효과 증폭도</ko>
     * @param - Effect amplication rotate.<ko>회전 증폭도</ko>
     * @param - The value of perspective CSS property. <ko>css perspective 속성 값</ko>
     * @example
     * ```ts
     * flicking.addPlugins(new Perspective({ selector: "p", scale: 1, rotate: 1, perspective = 1000 }));
     * ```
     */
    function Perspective(_a) {
      var _this = this;

      var _b = _a === void 0 ? {} : _a,
          _c = _b.selector,
          selector = _c === void 0 ? "" : _c,
          _d = _b.scale,
          scale = _d === void 0 ? 1 : _d,
          _e = _b.rotate,
          rotate = _e === void 0 ? 1 : _e,
          _f = _b.perspective,
          perspective = _f === void 0 ? 1000 : _f;

      this.update = function () {
        _this._onMove();
      };

      this._onMove = function () {
        var flicking = _this._flicking;
        var selector = _this._selector;
        var scale = _this._scale;
        var rotate = _this._rotate;
        var perspective = _this._perspective;
        if (!flicking) return;
        var horizontal = flicking.horizontal;
        var panels = flicking.visiblePanels;
        panels.forEach(function (panel) {
          var progress = panel.outsetProgress;
          var el = panel.element;
          var target = selector ? el.querySelector(selector) : el;
          var panelScale = 1 / (Math.abs(progress * scale) + 1);
          var rotateDegree = progress > 0 ? Math.min(90, progress * 100 * rotate) : Math.max(-90, progress * 100 * rotate);

          var _a = horizontal ? [0, rotateDegree] : [rotateDegree, 0],
              rotateX = _a[0],
              rotateY = _a[1];

          target.style.transform = "perspective(" + perspective + "px) rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) scale(" + panelScale + ")";
        });
      };

      this._flicking = null;
      this._selector = selector;
      this._scale = scale;
      this._rotate = rotate;
      this._perspective = perspective;
    }

    var __proto = Perspective.prototype;
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
    Object.defineProperty(__proto, "rotate", {
      get: function () {
        return this._rotate;
      },
      set: function (val) {
        this._rotate = val;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(__proto, "perspective", {
      get: function () {
        return this._perspective;
      },
      set: function (val) {
        this._perspective = val;
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

      this._flicking.off(flicking.EVENTS.AFTER_RESIZE, this.update);

      this._flicking = null;
    };

    return Perspective;
  }();

  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation.

  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.

  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** */

  /* global Reflect, Promise */
  var extendStatics = function (d, b) {
    extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
    };

    return extendStatics(d, b);
  };

  function __extends(d, b) {
    if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  }
  function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
        if (!ar) ar = Array.prototype.slice.call(from, 0, i);
        ar[i] = from[i];
      }
    }
    return to.concat(ar || from);
  }

  var Renderer =
  /*#__PURE__*/
  function () {
    function Renderer(_a) {
      var flicking = _a.flicking,
          pagination = _a.pagination,
          wrapper = _a.wrapper;
      this._flicking = flicking;
      this._pagination = pagination;
      this._wrapper = wrapper;
    }

    var __proto = Renderer.prototype;

    __proto._createBulletFromString = function (html, index) {
      var range = document.createRange();
      var frag = range.createContextualFragment(html);
      var bullet = frag.firstChild;

      this._addBulletEvents(bullet, index);

      return bullet;
    };

    __proto._addBulletEvents = function (bullet, index) {
      var _this = this;

      var anchorPoints = this._flicking.camera.anchorPoints;
      var panelIndex = anchorPoints[index].panel.index;
      bullet.addEventListener(BROWSER.MOUSE_DOWN, function (e) {
        e.stopPropagation();
      });
      bullet.addEventListener(BROWSER.TOUCH_START, function (e) {
        e.stopPropagation();
      }, {
        passive: true
      });
      bullet.addEventListener(BROWSER.CLICK, function () {
        _this._flicking.moveTo(panelIndex).catch(function (err) {
          if (err instanceof flicking.FlickingError) return;
          throw err;
        });
      });
    };

    return Renderer;
  }();

  var BulletRenderer =
  /*#__PURE__*/
  function (_super) {
    __extends(BulletRenderer, _super);

    function BulletRenderer() {
      var _this = _super !== null && _super.apply(this, arguments) || this;

      _this._bullets = [];
      _this._prevIndex = -1;
      return _this;
    }

    var __proto = BulletRenderer.prototype;
    Object.defineProperty(__proto, "_bulletClass", {
      get: function () {
        var pagination = this._pagination;
        return pagination.classPrefix + "-" + PAGINATION.BULLET_SUFFIX;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(__proto, "_activeClass", {
      get: function () {
        var pagination = this._pagination;
        return pagination.classPrefix + "-" + PAGINATION.BULLET_ACTIVE_SUFFIX;
      },
      enumerable: false,
      configurable: true
    });

    __proto.destroy = function () {
      this._bullets = [];
      this._prevIndex = -1;
    };

    __proto.render = function () {
      var _this = this;

      var flicking = this._flicking;
      var pagination = this._pagination;
      var wrapper = this._wrapper;
      var bulletClass = this._bulletClass;
      var activeClass = this._activeClass;
      var renderBullet = pagination.renderBullet;
      var renderActiveBullet = pagination.renderActiveBullet;
      var bulletWrapperClass = pagination.classPrefix + "-" + PAGINATION.BULLET_WRAPPER_SUFFIX;
      var anchorPoints = flicking.camera.anchorPoints;
      addClass(wrapper, bulletWrapperClass);
      wrapper.innerHTML = anchorPoints.map(function (anchorPoint, index) {
        if (renderActiveBullet && anchorPoint.panel.index === flicking.index) {
          return renderActiveBullet(bulletClass, index);
        } else {
          return renderBullet(bulletClass, index);
        }
      }).join("\n");
      var bullets = [].slice.call(wrapper.children);
      bullets.forEach(function (bullet, index) {
        var anchorPoint = anchorPoints[index];

        if (anchorPoint.panel.index === flicking.index) {
          addClass(bullet, activeClass);
          _this._prevIndex = index;
        }

        _this._addBulletEvents(bullet, index);
      });
      this._bullets = bullets;
    };

    __proto.update = function (index) {
      var flicking = this._flicking;
      var pagination = this._pagination;
      var wrapper = this._wrapper;
      var bullets = this._bullets;
      var bulletClass = this._bulletClass;
      var activeClass = this._activeClass;
      var prevIndex = this._prevIndex;
      var anchorPoints = flicking.camera.anchorPoints;
      var renderBullet = pagination.renderBullet;
      var renderActiveBullet = pagination.renderActiveBullet;
      if (anchorPoints.length <= 0) return;
      var anchorOffset = anchorPoints[0].panel.index;
      var activeBulletIndex = index - anchorOffset;
      if (prevIndex === activeBulletIndex) return;

      if (renderActiveBullet) {
        var prevBullet = bullets[prevIndex];

        if (prevBullet) {
          var newBullet = this._createBulletFromString(renderBullet(bulletClass, prevIndex), prevIndex);

          prevBullet.parentElement.replaceChild(newBullet, prevBullet);
          bullets[prevIndex] = newBullet;
        }

        var activeBullet = bullets[activeBulletIndex];

        var newActiveBullet = this._createBulletFromString(renderActiveBullet(bulletClass + " " + activeClass, activeBulletIndex), activeBulletIndex);

        wrapper.replaceChild(newActiveBullet, activeBullet);
        bullets[activeBulletIndex] = newActiveBullet;
      } else {
        var activeBullet = bullets[activeBulletIndex];
        var prevBullet = bullets[prevIndex];

        if (prevBullet) {
          removeClass(prevBullet, activeClass);
        }

        addClass(activeBullet, activeClass);
      }

      this._prevIndex = activeBulletIndex;
    };

    return BulletRenderer;
  }(Renderer);

  var FractionRenderer =
  /*#__PURE__*/
  function (_super) {
    __extends(FractionRenderer, _super);

    function FractionRenderer() {
      var _this = _super !== null && _super.apply(this, arguments) || this;

      _this._prevIndex = -1;
      _this._prevTotal = -1;
      return _this;
    }

    var __proto = FractionRenderer.prototype;

    __proto.destroy = function () {
      this._prevIndex = -1;
      this._prevTotal = -1;
    };

    __proto.render = function () {
      var flicking = this._flicking;
      var wrapper = this._wrapper;
      var pagination = this._pagination;
      var fractionWrapperClass = pagination.classPrefix + "-" + PAGINATION.FRACTION_WRAPPER_SUFFIX;
      var fractionCurrentClass = pagination.classPrefix + "-" + PAGINATION.FRACTION_CURRENT_SUFFIX;
      var fractionTotalClass = pagination.classPrefix + "-" + PAGINATION.FRACTION_TOTAL_SUFFIX;
      addClass(wrapper, fractionWrapperClass);
      wrapper.innerHTML = pagination.renderFraction(fractionCurrentClass, fractionTotalClass);
      this.update(flicking.index);
    };

    __proto.update = function (index) {
      var flicking = this._flicking;
      var wrapper = this._wrapper;
      var pagination = this._pagination;
      var anchorPoints = flicking.camera.anchorPoints;
      var currentIndex = anchorPoints.length > 0 ? index - anchorPoints[0].panel.index + 1 : 0;
      var anchorCount = anchorPoints.length;
      if (currentIndex === this._prevIndex && anchorCount === this._prevTotal) return;
      var fractionCurrentSelector = "." + pagination.classPrefix + "-" + PAGINATION.FRACTION_CURRENT_SUFFIX;
      var fractionTotalSelector = "." + pagination.classPrefix + "-" + PAGINATION.FRACTION_TOTAL_SUFFIX;
      var currentWrapper = wrapper.querySelector(fractionCurrentSelector);
      var totalWrapper = wrapper.querySelector(fractionTotalSelector);
      currentWrapper.innerHTML = pagination.fractionCurrentFormat(currentIndex);
      totalWrapper.innerHTML = pagination.fractionTotalFormat(anchorCount);
      this._prevIndex = currentIndex;
      this._prevTotal = anchorCount;
    };

    return FractionRenderer;
  }(Renderer);

  var ScrollBulletRenderer =
  /*#__PURE__*/
  function (_super) {
    __extends(ScrollBulletRenderer, _super);

    function ScrollBulletRenderer() {
      var _this = _super !== null && _super.apply(this, arguments) || this;

      _this._bullets = [];
      _this._bulletSize = 0;
      _this._previousIndex = -1;
      _this._sliderIndex = -1;

      _this.moveTo = function (index) {
        var pagination = _this._pagination;
        var sliderEl = _this._wrapper.firstElementChild;
        var bulletSize = _this._bulletSize;
        var wrapperSize = bulletSize * pagination.bulletCount;
        sliderEl.style.transform = "translate(" + (wrapperSize / 2 - (index + 0.5) * bulletSize) + "px)";
        _this._sliderIndex = index;
      };

      return _this;
    }

    var __proto = ScrollBulletRenderer.prototype;

    __proto.destroy = function () {
      this._bullets = [];
      this._bulletSize = 0;
      this._previousIndex = -1;
      this._sliderIndex = -1;
    };

    __proto.render = function () {
      var _this = this;

      var wrapper = this._wrapper;
      var flicking = this._flicking;
      var pagination = this._pagination;
      var renderBullet = pagination.renderBullet;
      var anchorPoints = flicking.camera.anchorPoints;
      var dynamicWrapperClass = pagination.classPrefix + "-" + PAGINATION.SCROLL_WRAPPER_SUFFIX;
      var bulletClass = pagination.classPrefix + "-" + PAGINATION.BULLET_SUFFIX;
      var sliderClass = pagination.classPrefix + "-" + PAGINATION.SCROLL_SLIDER_SUFFIX;
      var uninitClass = pagination.classPrefix + "-" + PAGINATION.SCROLL_UNINIT_SUFFIX;
      var sliderEl = document.createElement("div");
      addClass(sliderEl, sliderClass);
      addClass(wrapper, uninitClass);
      addClass(wrapper, dynamicWrapperClass);
      wrapper.appendChild(sliderEl);
      sliderEl.innerHTML = anchorPoints.map(function (_, index) {
        return renderBullet(bulletClass, index);
      }).join("\n");
      var bullets = [].slice.call(sliderEl.children);
      bullets.forEach(function (bullet, index) {
        _this._addBulletEvents(bullet, index);
      });
      if (bullets.length <= 0) return;
      var bulletStyle = getComputedStyle(bullets[0]);
      var bulletSize = bullets[0].clientWidth + parseFloat(bulletStyle.marginLeft) + parseFloat(bulletStyle.marginRight);
      wrapper.style.width = bulletSize * pagination.bulletCount + "px";
      this._bullets = bullets;
      this._bulletSize = bulletSize;
      this._previousIndex = -1;
      this.update(this._flicking.index);
      window.requestAnimationFrame(function () {
        removeClass(wrapper, uninitClass);
      });
    };

    __proto.update = function (index) {
      var pagination = this._pagination;
      var flicking$1 = this._flicking;
      var bullets = this._bullets;
      var prevIndex = this._previousIndex;
      var renderBullet = pagination.renderBullet;
      var renderActiveBullet = pagination.renderActiveBullet;
      var anchorPoints = flicking$1.camera.anchorPoints;
      var anchorOffset = anchorPoints[0].panel.index;
      var activeIndex = index - anchorOffset;
      if (anchorPoints.length <= 0) return;
      var bulletClass = pagination.classPrefix + "-" + PAGINATION.BULLET_SUFFIX;
      var bulletActiveClass = pagination.classPrefix + "-" + PAGINATION.BULLET_ACTIVE_SUFFIX;
      var prevClassPrefix = pagination.classPrefix + "-" + PAGINATION.SCROLL_PREV_SUFFIX;
      var nextClassPrefix = pagination.classPrefix + "-" + PAGINATION.SCROLL_NEXT_SUFFIX;

      var bulletPrevClass = function (offset) {
        return "" + prevClassPrefix + (offset > 1 ? offset : "");
      };

      var bulletNextClass = function (offset) {
        return "" + nextClassPrefix + (offset > 1 ? offset : "");
      };

      var prevClassRegex = new RegExp("^" + prevClassPrefix);
      var nextClassRegex = new RegExp("^" + nextClassPrefix);

      if (renderActiveBullet) {
        var prevBullet = bullets[prevIndex];

        if (prevBullet) {
          var newBullet = this._createBulletFromString(renderBullet(bulletClass, prevIndex), prevIndex);

          prevBullet.parentElement.replaceChild(newBullet, prevBullet);
          bullets[prevIndex] = newBullet;
        }

        var activeBullet = bullets[activeIndex];

        if (activeBullet) {
          var newActiveBullet = this._createBulletFromString(renderActiveBullet(bulletClass, activeIndex), activeIndex);

          activeBullet.parentElement.replaceChild(newActiveBullet, activeBullet);
          bullets[activeIndex] = newActiveBullet;
        }
      }

      bullets.forEach(function (bullet, idx) {
        var indexOffset = idx - activeIndex;
        var classList = bullet.className.split(" ");

        for (var _i = 0, classList_1 = classList; _i < classList_1.length; _i++) {
          var className = classList_1[_i];

          if (className === bulletActiveClass || prevClassRegex.test(className) || nextClassRegex.test(className)) {
            removeClass(bullet, className);
          }
        }

        if (indexOffset === 0) {
          addClass(bullet, bulletActiveClass);
        } else if (indexOffset > 0) {
          addClass(bullet, bulletNextClass(Math.abs(indexOffset)));
        } else {
          addClass(bullet, bulletPrevClass(Math.abs(indexOffset)));
        }
      });
      pagination.scrollOnChange(activeIndex, {
        total: bullets.length,
        prevIndex: prevIndex,
        sliderIndex: this._sliderIndex,
        direction: activeIndex > prevIndex ? flicking.DIRECTION.NEXT : flicking.DIRECTION.PREV,
        bullets: __spreadArray([], bullets),
        moveTo: this.moveTo
      });
      this._previousIndex = activeIndex;
    };

    return ScrollBulletRenderer;
  }(Renderer);

  /**
   * @memberof Flicking.Plugins
   */

  var Pagination =
  /*#__PURE__*/
  function () {
    function Pagination(_a) {
      var _this = this;

      var _b = _a === void 0 ? {} : _a,
          _c = _b.parentEl,
          parentEl = _c === void 0 ? null : _c,
          _d = _b.selector,
          selector = _d === void 0 ? PAGINATION.SELECTOR : _d,
          _e = _b.type,
          type = _e === void 0 ? PAGINATION.TYPE.BULLET : _e,
          _f = _b.classPrefix,
          classPrefix = _f === void 0 ? PAGINATION.PREFIX : _f,
          _g = _b.bulletCount,
          bulletCount = _g === void 0 ? 5 : _g,
          _h = _b.renderBullet,
          renderBullet = _h === void 0 ? function (className) {
        return "<span class=\"" + className + "\"></span>";
      } : _h,
          _j = _b.renderActiveBullet,
          renderActiveBullet = _j === void 0 ? null : _j,
          _k = _b.renderFraction,
          renderFraction = _k === void 0 ? function (currentClass, totalClass) {
        return "<span class=\"" + currentClass + "\"></span>/<span class=\"" + totalClass + "\"></span>";
      } : _k,
          _l = _b.fractionCurrentFormat,
          fractionCurrentFormat = _l === void 0 ? function (index) {
        return index.toString();
      } : _l,
          _m = _b.fractionTotalFormat,
          fractionTotalFormat = _m === void 0 ? function (index) {
        return index.toString();
      } : _m,
          _o = _b.scrollOnChange,
          scrollOnChange = _o === void 0 ? function (index, ctx) {
        return ctx.moveTo(index);
      } : _o;
      /* Internal Values */


      this._flicking = null;

      this.update = function () {
        _this._removeAllChilds();

        _this._renderer.render();
      };

      this._onIndexChange = function (evt) {
        _this._renderer.update(evt.index);
      };

      this._parentEl = parentEl;
      this._selector = selector;
      this._type = type;
      this._classPrefix = classPrefix;
      this._bulletCount = bulletCount;
      this._renderBullet = renderBullet;
      this._renderActiveBullet = renderActiveBullet;
      this._renderFraction = renderFraction;
      this._fractionCurrentFormat = fractionCurrentFormat;
      this._fractionTotalFormat = fractionTotalFormat;
      this._scrollOnChange = scrollOnChange;
    }

    var __proto = Pagination.prototype;
    Object.defineProperty(__proto, "parentEl", {
      get: function () {
        return this._parentEl;
      },
      set: function (val) {
        this._parentEl = val;
      },
      enumerable: false,
      configurable: true
    });
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
    Object.defineProperty(__proto, "type", {
      get: function () {
        return this._type;
      },
      set: function (val) {
        this._type = val;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(__proto, "classPrefix", {
      get: function () {
        return this._classPrefix;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(__proto, "bulletCount", {
      get: function () {
        return this._bulletCount;
      },
      set: function (val) {
        this._bulletCount = val;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(__proto, "renderBullet", {
      get: function () {
        return this._renderBullet;
      },
      set: function (val) {
        this._renderBullet = val;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(__proto, "renderActiveBullet", {
      get: function () {
        return this._renderActiveBullet;
      },
      set: function (val) {
        this._renderActiveBullet = val;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(__proto, "renderFraction", {
      get: function () {
        return this._renderFraction;
      },
      set: function (val) {
        this._renderFraction = val;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(__proto, "fractionCurrentFormat", {
      get: function () {
        return this._fractionCurrentFormat;
      },
      set: function (val) {
        this._fractionCurrentFormat = val;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(__proto, "fractionTotalFormat", {
      get: function () {
        return this._fractionTotalFormat;
      },
      set: function (val) {
        this._fractionTotalFormat = val;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(__proto, "scrollOnChange", {
      get: function () {
        return this._scrollOnChange;
      },
      set: function (val) {
        this._scrollOnChange = val;
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(__proto, "bulletWrapperclassPrefixClass", {
      set: function (val) {
        this._classPrefix = val;
      },
      enumerable: false,
      configurable: true
    });

    __proto.init = function (flicking$1) {
      if (this._flicking) {
        this.destroy();
      }

      this._flicking = flicking$1;
      var type = this._type;
      var selector = this._selector;
      var parentEl = this._parentEl ? this._parentEl : flicking$1.element;
      var wrapper = parentEl.querySelector(selector);

      if (!wrapper) {
        throw new Error("[Flicking-Pagination] Couldn't find element with the given selector: " + selector);
      }

      this._wrapper = wrapper;
      this._renderer = this._createRenderer(type);
      flicking$1.on(flicking.EVENTS.WILL_CHANGE, this._onIndexChange);
      flicking$1.on(flicking.EVENTS.WILL_RESTORE, this._onIndexChange);
      flicking$1.on(flicking.EVENTS.PANEL_CHANGE, this.update);
      this.update();
    };

    __proto.destroy = function () {
      var flicking$1 = this._flicking;

      if (!flicking$1) {
        return;
      }

      flicking$1.off(flicking.EVENTS.WILL_CHANGE, this._onIndexChange);
      flicking$1.off(flicking.EVENTS.WILL_RESTORE, this._onIndexChange);
      flicking$1.off(flicking.EVENTS.PANEL_CHANGE, this.update);

      this._renderer.destroy();

      this._removeAllChilds();

      this._flicking = null;
    };

    __proto._createRenderer = function (type) {
      var options = {
        flicking: this._flicking,
        pagination: this,
        wrapper: this._wrapper
      };

      switch (type) {
        case PAGINATION.TYPE.BULLET:
          return new BulletRenderer(options);

        case PAGINATION.TYPE.FRACTION:
          return new FractionRenderer(options);

        case PAGINATION.TYPE.SCROLL:
          return new ScrollBulletRenderer(options);

        default:
          throw new Error("[Flicking-Pagination] type \"" + type + "\" is not supported.");
      }
    };

    __proto._removeAllChilds = function () {
      var wrapper = this._wrapper;

      while (wrapper.firstChild) {
        wrapper.removeChild(wrapper.firstChild);
      }
    };

    return Pagination;
  }();

  /**
   * @namespace Flicking
   */

  exports.ARROW = ARROW;
  exports.Arrow = Arrow;
  exports.AutoPlay = AutoPlay;
  exports.Fade = Fade;
  exports.PAGINATION = PAGINATION;
  exports.Pagination = Pagination;
  exports.Parallax = Parallax;
  exports.Perspective = Perspective;
  exports.SYNC = SYNC;
  exports.Sync = Sync;

}));
//# sourceMappingURL=plugins.js.map
