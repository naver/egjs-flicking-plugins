import Flicking, { FlickingEvent, Plugin } from "@egjs/flicking";

/**
 * You can apply fade in / out effect while panel is moving.
 * @ko 패널들을 움직이면서 fade in / out 효과를 부여할 수 있습니다.
 * @memberof eg.Flicking.plugins
 */
class Fade implements Plugin {
  /**
   * @param - The selector of the element to which the fade effect is to be applied. If the selector is blank, it applies to panel element. <ko>Fade 효과를 적용할 대상의 선택자. 선택자가 공백이면 패널 엘리먼트에 적용된다.</ko>
   * @param - Effect amplication scale <ko>효과 증폭도</ko>
   * @example
   * flicking.addPlugins(new eg.Flicking.plugins.Fade("p", 1));
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
    const selector = this.selector;
    const scale = this.scale;

    panels.forEach(panel => {
      const progress = panel.getOutsetProgress();
      const el = panel.getElement();
      const target = selector ? el.querySelector<HTMLElement>(selector)! : el;
      const opacity = Math.min(1, Math.max(0, (1 - Math.abs(progress * scale))));

      target.style.opacity = `${opacity}`;
    });
  }
}

export default Fade;
