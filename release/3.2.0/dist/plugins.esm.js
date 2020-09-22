/*
Copyright (c) 2019-present NAVER Corp.
name: @egjs/flicking-plugins
license: MIT <https://github.com/naver/egjs-flicking-plugins>
author: NAVER Corp.
repository: https://github.com/naver/egjs-flicking-plugins
version: 3.2.0
*/
/**
 * You can apply parallax effect while panel is moving.
 * @ko 패널들을 움직이면서 parallax 효과를 부여할 수 있습니다.
 * @memberof eg.Flicking.plugins
 */
var Parallax =
/*#__PURE__*/
function () {
  /**
   * @param - Selector of the element to apply parallax effect <ko> Parallax 효과를 적용할 엘리먼트의 선택자 </ko>
   * @param - Effect amplication scale <ko>효과 증폭도</ko>
   * @example
   * flicking.addPlugins(new eg.Flicking.plugins.Parallax("img", 1));
   */
  function Parallax(selector, scale) {
    if (selector === void 0) {
      selector = "";
    }

    if (scale === void 0) {
      scale = 1;
    }

    var _this = this;

    this.selector = selector;
    this.scale = scale;

    this.onMove = function (e) {
      _this.move(e.currentTarget);
    };
  }

  var __proto = Parallax.prototype;

  __proto.init = function (flicking) {
    flicking.on("move", this.onMove);
    this.move(flicking);
  };

  __proto.update = function (flicking) {
    this.move(flicking);
  };

  __proto.destroy = function (flicking) {
    flicking.off("move", this.onMove);
  };

  __proto.move = function (flicking) {
    var _this = this;

    var panels = flicking.getVisiblePanels();
    panels.forEach(function (panel) {
      var progress = panel.getOutsetProgress();
      var el = panel.getElement();
      var target = el.querySelector(_this.selector);
      var parentTarget = target.parentNode;
      var rect = target.getBoundingClientRect();
      var parentRect = parentTarget.getBoundingClientRect();
      var position = (parentRect.width - rect.width) / 2 * progress * _this.scale;
      var transform = "translate(-50%) translate(" + position + "px)";
      var style = target.style;
      style.cssText += "transform: " + transform + ";-webkit-transform: " + transform + ";-ms-transform:" + transform;
    });
  };

  return Parallax;
}();

/**
 * You can apply fade in / out effect while panel is moving.
 * @ko 패널들을 움직이면서 fade in / out 효과를 부여할 수 있습니다.
 * @memberof eg.Flicking.plugins
 */
var Fade =
/*#__PURE__*/
function () {
  /**
   * @param - The selector of the element to which the fade effect is to be applied. If the selector is blank, it applies to panel element. <ko>Fade 효과를 적용할 대상의 선택자. 선택자가 공백이면 패널 엘리먼트에 적용된다.</ko>
   * @param - Effect amplication scale <ko>효과 증폭도</ko>
   * @example
   * flicking.addPlugins(new eg.Flicking.plugins.Fade("p", 1));
   */
  function Fade(selector, scale) {
    if (selector === void 0) {
      selector = "";
    }

    if (scale === void 0) {
      scale = 1;
    }

    var _this = this;

    this.selector = selector;
    this.scale = scale;

    this.onMove = function (e) {
      _this.move(e.currentTarget);
    };
  }

  var __proto = Fade.prototype;

  __proto.init = function (flicking) {
    flicking.on("move", this.onMove);
    this.move(flicking);
  };

  __proto.update = function (flicking) {
    this.move(flicking);
  };

  __proto.destroy = function (flicking) {
    flicking.off("move", this.onMove);
  };

  __proto.move = function (flicking) {
    var panels = flicking.getVisiblePanels();
    var selector = this.selector;
    var scale = this.scale;
    panels.forEach(function (panel) {
      var progress = panel.getOutsetProgress();
      var el = panel.getElement();
      var target = selector ? el.querySelector(selector) : el;
      var opacity = Math.min(1, Math.max(0, 1 - Math.abs(progress * scale)));
      target.style.opacity = "" + opacity;
    });
  };

  return Fade;
}();

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
var __assign = function () {
  __assign = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var DEFAULT_OPTION = {
  duration: 2000,
  direction: "NEXT",
  stopOnHover: false
};
/**
 * Plugin that allow you to automatically move to the next/previous panel, on a specific time basis
 * @ko 일정 시간마다, 자동으로 다음/이전 패널로 넘어가도록 할 수 있는 플러그인
 * @memberof eg.Flicking.plugins
 */

var AutoPlay =
/*#__PURE__*/
function () {
  /**
   * @param options Options for the AutoPlay instance.<ko>AutoPlay 옵션</ko>
   * @param options.duration Time to wait before moving on to the next panel.<ko>다음 패널로 움직이기까지 대기 시간</ko>
   * @param options.direction The direction in which the panel moves.<ko>패널이 움직이는 방향</ko>
   * @param options.stopOnHover Whether to stop when mouse hover upon the element.<ko>엘리먼트에 마우스를 올렸을 때 AutoPlay를 정지할지 여부</ko>
   * @example
   * flicking.addPlugins(new eg.Flicking.plugins.AutoPlay(2000, "NEXT"));
   */
  function AutoPlay(options, direction) {
    if (options === void 0) {
      options = DEFAULT_OPTION;
    }

    if (direction === void 0) {
      direction = DEFAULT_OPTION.direction;
    }

    var _this = this;
    /* Internal Values */


    this.flicking = null;
    this.timerId = 0;
    this.mouseEntered = false;

    this.play = function () {
      var flicking = _this.flicking;
      if (!flicking) return;

      _this.stop();

      if (_this.mouseEntered || flicking.isPlaying()) return;
      _this.timerId = window.setTimeout(function () {
        flicking[_this.direction === "NEXT" ? "next" : "prev"]();

        _this.play();
      }, _this.duration);
    };

    this.stop = function () {
      clearTimeout(_this.timerId);
    };

    this.onMouseEnter = function () {
      _this.mouseEntered = true;

      _this.stop();
    };

    this.onMouseLeave = function () {
      _this.mouseEntered = false;

      _this.play();
    };

    if (typeof options === "number") {
      // Fallback for previous interface
      this.duration = options;
      this.direction = direction;
      this.stopOnHover = DEFAULT_OPTION.stopOnHover;
      return;
    }

    var mergedOptions = __assign({}, DEFAULT_OPTION, options);

    var duration = mergedOptions.duration,
        dir = mergedOptions.direction,
        stopOnHover = mergedOptions.stopOnHover;
    this.duration = duration;
    this.direction = dir;
    this.stopOnHover = stopOnHover;
  }

  var __proto = AutoPlay.prototype;

  __proto.init = function (flicking) {
    flicking.on({
      moveStart: this.stop,
      holdStart: this.stop,
      moveEnd: this.play,
      select: this.play
    });
    this.flicking = flicking;

    if (this.stopOnHover) {
      var targetEl = this.flicking.getElement();
      targetEl.addEventListener("mouseenter", this.onMouseEnter, false);
      targetEl.addEventListener("mouseleave", this.onMouseLeave, false);
    }

    this.play();
  };

  __proto.destroy = function () {
    var flicking = this.flicking;
    this.mouseEntered = false;
    this.stop();
    if (!flicking) return;
    flicking.off("moveStart", this.stop);
    flicking.off("holdStart", this.stop);
    flicking.off("moveEnd", this.play);
    flicking.off("select", this.play);
    var targetEl = flicking.getElement();
    targetEl.removeEventListener("mouseenter", this.onMouseEnter, false);
    targetEl.removeEventListener("mouseleave", this.onMouseLeave, false);
    this.flicking = null;
  };

  return AutoPlay;
}();

/**
 * @namepsace eg.Flicking
 */

export { AutoPlay, Fade, Parallax };
//# sourceMappingURL=plugins.esm.js.map
