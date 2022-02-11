import Flicking from "@egjs/flicking";
import * as sinon from "sinon";
import Pagination from "../../src/pagination/Pagination";
import { cleanup, createFlicking, createPaginationFixture, sandbox } from "./utils";

describe("Pagination", () => {
  afterEach(() => {
    cleanup();
  });

  const createFixture = () => {
    const fixtureWrapper = sandbox("pagination");
    const fixture = createPaginationFixture();
    fixtureWrapper.appendChild(fixture);

    return fixture;
  };

  describe("Options", () => {
    describe("renderBullet", () => {
      it("should not remove custom classes when the 'scroll' type is used", () => {
        // Given
        const flicking = new Flicking(createFixture());
        const pagination = new Pagination({
          renderBullet: (className: string) => `<span class="${className} test"></span>`,
          type: "scroll"
        });

        // When
        pagination.init(flicking);

        // Then
        const bullets = [].slice.apply(document.querySelectorAll(".flicking-pagination-bullet"));
        expect(bullets.every(bullet => bullet.classList.contains("test"))).to.be.true;
      });
    });
  });

  describe("Index change", () => {
    it("should not throw any error while Flicking is replacing all panels", async () => {
      // Given
      const flicking = await createFlicking(createFixture());
      const pagination = new Pagination({
        renderBullet: (className: string) => `<span class="${className} test"></span>`,
        type: "bullet"
      });

      // When
      pagination.init(flicking);
      flicking.remove(0, flicking.panelCount);
      flicking.append(document.createElement("div"));

      // Then
      // There should be one active bullet selected
      const bullets = [].slice.apply(document.querySelectorAll(".flicking-pagination-bullet-active"));
      expect(bullets.length).to.equal(1);
    });
  });

  describe("Events", () => {
    let addEventListener: sinon.SinonStub;

    beforeEach(() => {
      addEventListener = sinon.stub(HTMLElement.prototype, "addEventListener");
    });

    afterEach(() => {
      addEventListener.restore();
    });

    it("should add touch start listener with passive: true", async () => {
      // Given
      const flicking = await createFlicking(createFixture());
      const pagination = new Pagination();

      // When
      flicking.addPlugins(pagination);
      await flicking.init();

      // Then
      const touchStartEvents = addEventListener.getCalls()
        .filter(call => {
          return call.args[0] === "touchstart" && call.thisValue.classList.contains("flicking-pagination-bullet");
        });

      expect(touchStartEvents.length).to.be.greaterThan(0);
      expect(touchStartEvents.every(call => {
        const [type, _, options] = call.args;
        return type === "touchstart" && options && (options as AddEventListenerOptions).passive;
      })).to.be.true;
    });
  });
});
