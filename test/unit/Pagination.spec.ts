import Flicking from "@egjs/flicking";
import Pagination from "../../src/pagination/Pagination";
import { createFlickingFixture } from "./utils";

describe("Pagination", () => {
  describe("Options", () => {
    describe("renderBullet", () => {
      it("should not remove custom classes when the 'scroll' type is used", () => {
        // Given
        const flicking = new Flicking(createFlickingFixture());
        const pagination = new Pagination({
          renderBullet: (className: string) => `<span class="${className} test"></span>`,
          type: "scroll"
        });

        // When
        flicking.addPlugins(pagination);

        // Then
        const bullets = [].slice.apply(document.querySelectorAll(".flicking-pagination-bullet"));
        expect(bullets.every(bullet => bullet.classList.contains("test"))).to.be.true;
      });
    });
  });
});
