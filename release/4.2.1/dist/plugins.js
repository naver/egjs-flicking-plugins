/*
Copyright (c) 2019-present NAVER Corp.
name: @egjs/flicking-plugins
license: MIT
author: NAVER Corp.
repository: https://github.com/naver/egjs-flicking-plugins
version: 4.2.1
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
        prevEl.addEventListener(evt, _this._preventInputPropagation);
        nextEl.addEventListener(evt, _this._preventInputPropagation);
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

      this._addEvents = function (synchronizedFlickingOptions) {
        synchronizedFlickingOptions.forEach(function (_a) {
          var flicking$1 = _a.flicking,
              isSlidable = _a.isSlidable,
              isClickable = _a.isClickable;

          if (_this._type === "camera") {
            flicking$1.on(flicking.EVENTS.MOVE, _this._onMove);
            flicking$1.on(flicking.EVENTS.MOVE_START, _this._onMoveStart);
            flicking$1.on(flicking.EVENTS.MOVE_END, _this._onMoveEnd);
          }

          if (_this._type === "index" && isSlidable) {
            flicking$1.on(flicking.EVENTS.WILL_CHANGE, _this._onIndexChange);
          }

          if (isClickable) {
            flicking$1.on(flicking.EVENTS.SELECT, _this._onIndexChange);
          }
        });
      };

      this._removeEvents = function (synchronizedFlickingOptions) {
        synchronizedFlickingOptions.forEach(function (_a) {
          var flicking$1 = _a.flicking,
              isSlidable = _a.isSlidable,
              isClickable = _a.isClickable;

          if (_this._type === "camera") {
            flicking$1.off(flicking.EVENTS.MOVE, _this._onMove);
            flicking$1.off(flicking.EVENTS.MOVE_START, _this._onMoveStart);
            flicking$1.off(flicking.EVENTS.MOVE_END, _this._onMoveEnd);
          }

          if (_this._type === "index" && isSlidable) {
            flicking$1.off(flicking.EVENTS.WILL_CHANGE, _this._onIndexChange);
          }

          if (isClickable) {
            flicking$1.off(flicking.EVENTS.SELECT, _this._onIndexChange);
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

          if (flicking !== e.currentTarget) {
            if (camera.position < camera.range.min) {
              void flicking.camera.lookAt(camera.position);
            } else if (camera.position > camera.range.max) {
              void flicking.camera.lookAt(flicking.camera.range.max + camera.position - camera.range.max);
            } else {
              void flicking.camera.lookAt(flicking.camera.range.min + flicking.camera.rangeDiff * progress);
            }
          }
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

      this._synchronizeByIndex = function (activeFlicking, index) {
        var synchronizedFlickingOptions = _this._synchronizedFlickingOptions;
        var activePanel = activeFlicking.panels.find(function (panel) {
          return panel.index === index;
        });
        var lastPanel = activeFlicking.panels[activeFlicking.panels.length - 1];

        if (!activePanel) {
          return;
        }

        _this._preventEvent(function () {
          synchronizedFlickingOptions.forEach(function (_a) {
            var flicking = _a.flicking,
                activeClass = _a.activeClass; // calculate new target flicking position with active flicking size and target flicking size

            var targetLastPanel = flicking.panels[flicking.panels.length - 1];
            var targetPos = activePanel.position / (lastPanel.position + lastPanel.size / 2) * (targetLastPanel.position + targetLastPanel.size / 2);
            flicking.control.moveToPosition(targetPos, 500).catch(function () {
              return void 0;
            });

            if (activeClass) {
              _this._updateClass({
                flicking: flicking,
                activeClass: activeClass
              }, targetPos);
            }
          });
        });
      };

      this._updateClass = function (synchronizedFlickingOption, pos) {
        var target = _this._findNearsetPanel(synchronizedFlickingOption.flicking, pos);

        synchronizedFlickingOption.flicking.panels.forEach(function (panel) {
          return panel.index === target.index ? addClass(panel.element, synchronizedFlickingOption.activeClass) : removeClass(panel.element, synchronizedFlickingOption.activeClass);
        });
      };

      this._findNearsetPanel = function (flicking, pos) {
        var nearsetIndex = flicking.panels.reduce(function (nearest, panel, index) {
          return Math.abs(panel.position - pos) <= nearest.range ? {
            index: index,
            range: Math.abs(panel.position - pos)
          } : nearest;
        }, {
          index: 0,
          range: Infinity
        }).index;
        return flicking.panels[nearsetIndex];
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
        var _this = this;

        this._preventEvent(function () {
          _this._type = val;
        });
      },
      enumerable: false,
      configurable: true
    });
    Object.defineProperty(__proto, "synchronizedFlickingOptions", {
      get: function () {
        return this._synchronizedFlickingOptions;
      },
      set: function (val) {
        var _this = this;

        this._preventEvent(function () {
          _this._synchronizedFlickingOptions = val;
        });
      },
      enumerable: false,
      configurable: true
    });

    __proto.init = function (flicking) {
      var _this = this;

      if (this._flicking) {
        this.destroy();
      }

      this._flicking = flicking;

      this._addEvents(this._synchronizedFlickingOptions);

      this._synchronizedFlickingOptions.forEach(function (synchronizedFlickingOption) {
        _this._updateClass(synchronizedFlickingOption, 0);
      });
    };

    __proto.destroy = function () {
      var flicking = this._flicking;

      if (!flicking) {
        return;
      }

      this._removeEvents(this._synchronizedFlickingOptions);

      this._flicking = null;
    };

    __proto.update = function () {
      var _this = this;

      this._synchronizedFlickingOptions.forEach(function (_a) {
        var flicking = _a.flicking,
            activeClass = _a.activeClass;

        _this._updateClass({
          flicking: flicking,
          activeClass: activeClass
        }, flicking.camera.position);
      });
    };

    __proto._preventEvent = function (fn) {
      this._removeEvents(this._synchronizedFlickingOptions);

      fn();

      this._addEvents(this._synchronizedFlickingOptions);
    };

    return Sync;
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

    return Renderer;
  }();

  var BulletRenderer =
  /*#__PURE__*/
  function (_super) {
    __extends(BulletRenderer, _super);

    function BulletRenderer() {
      var _this = _super !== null && _super.apply(this, arguments) || this;

      _this._childs = [];
      return _this;
    }

    var __proto = BulletRenderer.prototype;

    __proto.render = function () {
      var flicking$1 = this._flicking;
      var pagination = this._pagination;
      var renderBullet = pagination.renderBullet;
      var bulletWrapperClass = pagination.classPrefix + "-" + PAGINATION.BULLET_WRAPPER_SUFFIX;
      var bulletClass = pagination.classPrefix + "-" + PAGINATION.BULLET_SUFFIX;
      var bulletActiveClass = pagination.classPrefix + "-" + PAGINATION.BULLET_ACTIVE_SUFFIX;
      var anchorPoints = flicking$1.camera.anchorPoints;
      var wrapper = this._wrapper;
      addClass(wrapper, bulletWrapperClass);
      wrapper.innerHTML = anchorPoints.map(function (_, index) {
        return renderBullet(bulletClass, index);
      }).join("\n");
      var bullets = [].slice.call(wrapper.children);
      bullets.forEach(function (bullet, index) {
        var anchorPoint = anchorPoints[index];

        if (anchorPoint.panel.index === flicking$1.index) {
          addClass(bullet, bulletActiveClass);
        }

        bullet.addEventListener(BROWSER.MOUSE_DOWN, function (e) {
          e.stopPropagation();
        });
        bullet.addEventListener(BROWSER.TOUCH_START, function (e) {
          e.stopPropagation();
        });
        bullet.addEventListener(BROWSER.CLICK, function () {
          flicking$1.moveTo(anchorPoint.panel.index).catch(function (err) {
            if (err instanceof flicking.FlickingError) return;
            throw err;
          });
        });
      });
      this._childs = bullets;
    };

    __proto.update = function (index) {
      var flicking = this._flicking;
      var pagination = this._pagination;
      var bullets = this._childs;
      var activeClass = pagination.classPrefix + "-" + PAGINATION.BULLET_ACTIVE_SUFFIX;
      var anchorPoints = flicking.camera.anchorPoints;
      if (anchorPoints.length <= 0) return;
      bullets.forEach(function (bullet) {
        removeClass(bullet, activeClass);
      });
      var anchorOffset = anchorPoints[0].panel.index;
      var activeBullet = bullets[index - anchorOffset];
      addClass(activeBullet, activeClass);
    };

    return BulletRenderer;
  }(Renderer);

  var FractionRenderer =
  /*#__PURE__*/
  function (_super) {
    __extends(FractionRenderer, _super);

    function FractionRenderer() {
      return _super !== null && _super.apply(this, arguments) || this;
    }

    var __proto = FractionRenderer.prototype;

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
      var fractionCurrentClass = pagination.classPrefix + "-" + PAGINATION.FRACTION_CURRENT_SUFFIX;
      var fractionTotalClass = pagination.classPrefix + "-" + PAGINATION.FRACTION_TOTAL_SUFFIX;
      var currentWrapper = wrapper.querySelector("." + fractionCurrentClass);
      var totalWrapper = wrapper.querySelector("." + fractionTotalClass);
      var anchorPoints = flicking.camera.anchorPoints;
      var currentIndex = anchorPoints.length > 0 ? index - anchorPoints[0].panel.index + 1 : 0;
      currentWrapper.innerHTML = pagination.fractionCurrentFormat(currentIndex);
      totalWrapper.innerHTML = pagination.fractionTotalFormat(anchorPoints.length);
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

    __proto.render = function () {
      var wrapper = this._wrapper;
      var flicking$1 = this._flicking;
      var pagination = this._pagination;
      var renderBullet = pagination.renderBullet;
      var anchorPoints = flicking$1.camera.anchorPoints;
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
        var anchorPoint = anchorPoints[index];
        bullet.addEventListener(BROWSER.MOUSE_DOWN, function (e) {
          e.stopPropagation();
        });
        bullet.addEventListener(BROWSER.TOUCH_START, function (e) {
          e.stopPropagation();
        });
        bullet.addEventListener(BROWSER.CLICK, function () {
          flicking$1.moveTo(anchorPoint.panel.index).catch(function (err) {
            if (err instanceof flicking.FlickingError) return;
            throw err;
          });
        });
      });
      if (bullets.length <= 0) return;
      var bulletStyle = getComputedStyle(bullets[0]);
      var bulletSize = bullets[0].clientWidth + parseFloat(bulletStyle.marginLeft) + parseFloat(bulletStyle.marginRight);
      wrapper.style.width = bulletSize * pagination.bulletCount + "px";
      this._bullets = bullets;
      this._bulletSize = bulletSize;
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
      var anchorPoints = flicking$1.camera.anchorPoints;
      var anchorOffset = anchorPoints[0].panel.index;
      var activeIndex = index - anchorOffset;
      if (anchorPoints.length <= 0) return;
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
          _j = _b.renderFraction,
          renderFraction = _j === void 0 ? function (currentClass, totalClass) {
        return "<span class=\"" + currentClass + "\"></span>/<span class=\"" + totalClass + "\"></span>";
      } : _j,
          _k = _b.fractionCurrentFormat,
          fractionCurrentFormat = _k === void 0 ? function (index) {
        return index.toString();
      } : _k,
          _l = _b.fractionTotalFormat,
          fractionTotalFormat = _l === void 0 ? function (index) {
        return index.toString();
      } : _l,
          _m = _b.scrollOnChange,
          scrollOnChange = _m === void 0 ? function (index, ctx) {
        return ctx.moveTo(index);
      } : _m;
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
  exports.SYNC = SYNC;
  exports.Sync = Sync;

}));
//# sourceMappingURL=plugins.js.map
