import Flicking, { FlickingEvent, Plugin } from "@egjs/flicking";

/**
 * You can apply parallax effect while panel is moving.
 * @ko 패널들을 움직이면서 parallax 효과를 부여할 수 있습니다.
 * @memberof eg.Flicking.plugins
 */
class Parallax implements Plugin {
  /**
   * @param - Selector of the element to apply parallax effect <ko> Parallax 효과를 적용할 엘리먼트의 선택자 </ko>
   * @param - Effect amplication scale <ko>효과 증폭도</ko>
   * @example
   * flicking.addPlugins(new eg.Flicking.plugins.Parallax("img", 1));
   */
  constructor(private selector: string = "", private scale: number = 1) {}
  public init(flicking: Flicking): void {
    flicking.on("move", this.onMove);
    this.move(flicking);
  }
  public update(flicking: Flicking): void {
    this.move(flicking);
  }
  public destroy(flicking: Flicking): void {
    flicking.off("move", this.onMove);
  }
  private onMove = (e: FlickingEvent): void => {
    this.move(e.currentTarget);
  }
  private move(flicking: Flicking): void {
    const panels = flicking.getVisiblePanels();

    panels.forEach(panel => {
      const progress = panel.getOutsetProgress();
      const el = panel.getElement();
      const target = el.querySelector<HTMLElement>(this.selector)!;
      const parentTarget = target.parentNode as Element;
      const rect = target.getBoundingClientRect();
      const parentRect = parentTarget.getBoundingClientRect();
      const position = (parentRect.width - rect.width) / 2 * progress * this.scale;
      const transform = `translate(-50%) translate(${position}px)`;
      const style = target.style;

      style.cssText += `transform: ${transform};-webkit-transform: ${transform};-ms-transform:${transform}`;
    });
  }
}
export default Parallax;
