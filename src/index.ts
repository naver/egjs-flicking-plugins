/**
 * @namespace Flicking
 */
/**
 * @namespace Flicking.Plugins
 */
import Parallax from "./Parallax";
import Fade from "./Fade";
import AutoPlay from "./AutoPlay";
import Arrow from "./Arrow";
import Sync, { SyncOptions, SychronizableFlickingOptions } from "./Sync";
import Perspective from "./Perspective";

export * from "./pagination";

export {
  Parallax,
  Fade,
  AutoPlay,
  Arrow,
  Sync,
  Perspective
};

export type {
  SyncOptions,
  SychronizableFlickingOptions
};

export * from "./const";
