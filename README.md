# @egjs/flicking-plugins [![version][badge-version]][link-version] <a href="https://travis-ci.org/naver/egjs-flicking-plugins" target="_blank"><img alt="Travis (.org)" src="https://img.shields.io/travis/naver/egjs-flicking-plugins.svg?style=flat-square&label=build&logo=travis%20ci" /></a> [![Coverage Status](https://coveralls.io/repos/github/naver/egjs-flicking-plugins/badge.svg?branch=master)](https://coveralls.io/github/naver/egjs-flicking-plugins?branch=master)


<h1 align="center" style="max-width: 100%;">
  <img width="800" alt="Flicking Logo" src="https://naver.github.io/egjs-flicking/images/flicking.svg" style="max-width: 100%;" /><br/>
  <a href="https://naver.github.io/egjs-flicking/Plugins">@egjs/flicking-plugins</a>
</h1>

Ready to use plugins for [@egjs/flicking](https://github.com/naver/egjs-flicking)
- [Demos & Documents](https://naver.github.io/egjs-flicking/Plugins)
- [AutoPlay](https://naver.github.io/egjs-flicking/Plugins#autoplay): Add autoplay to move to the next/previous panel periodically.
- [Parallax](https://naver.github.io/egjs-flicking/Plugins#parallax): Add parallax effect attached with Flicking interaction.
- [Fade](https://naver.github.io/egjs-flicking/Plugins#fade): Add fade effect attached with Flicking interaction.
- [Arrow](https://naver.github.io/egjs-flicking/Plugins#arrow): Add prev/next button to Flicking.
- [Pagination](https://naver.github.io/egjs-flicking/Plugins#pagination): Add a pagination bullets to Flicking.

## ⚙️ Installation
#### npm
```bash
npm install @egjs/flicking-plugins
```

#### CDN
- **Latest**
   - https://naver.github.io/egjs-flicking-plugins/release/latest/dist/plugins.js (all)
   - https://naver.github.io/egjs-flicking-plugins/release/latest/dist/plugins.min.js (all)
- **Specific version**
   - https://naver.github.io/egjs-flicking-plugins/release/[PLUGIN-VERSION]/dist/plugins.js (all)
   - https://naver.github.io/egjs-flicking-plugins/release/[PLUGIN-VERSION]/dist/plugins.min.js (all)

## 🏃 Quick Start
```js
import { Fade, Parallax, AutoPlay } from "@egjs/flicking-plugins";

flicking.addPlugins(new Fade(), new Parallax(), new AutoPlay());
```

## 📝 Feedback
Please file an [Issue](https://github.com/naver/egjs-flicking/issues).

## 📜 License
egjs-flicking-plugins is released under the [MIT license](http://naver.github.io/egjs/license.txt).

```
Copyright (c) 2019-present NAVER Corp.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```

<p align="center">
  <a href="https://naver.github.io/egjs/"><img height="50" src="https://naver.github.io/egjs/img/logotype1_black.svg" /></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="https://github.com/naver"><img height="50" src="https://naver.github.io/OpenSourceGuide/book/assets/naver_logo.png" /></a>
</p>


<!-- badges -->
[badge-version]: https://img.shields.io/npm/v/@egjs/flicking-plugins.svg?style=flat

<!-- links -->
[link-version]: https://www.npmjs.com/package/@egjs/flicking-plugins
