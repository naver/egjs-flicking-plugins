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
      it("should not remove custom classes when the 'scroll' type is used", async () => {
        // Given
        const flicking = await createFlicking(createFixture());
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

    describe("renderActiveBullet", () => {
      it("is false by default", async () => {
        // Given
        const flicking = await createFlicking(createFixture());
        const pagination = new Pagination();

        // When
        pagination.init(flicking);

        // Then
        expect(pagination.renderActiveBullet).to.be.null;
      });

      it("should render active bullet if a render function is given", async () => {
        // Given
        const flicking = await createFlicking(createFixture());
        const pagination = new Pagination({
          type: "bullet", // default
          renderActiveBullet: (className) => `<span class="${className}">ACTIVE</span>`
        });

        // When
        pagination.init(flicking);

        // Then
        const activeBullet = document.querySelector(".flicking-pagination-bullet-active");
        expect(activeBullet).not.to.be.null;
        expect(activeBullet?.innerHTML).to.equal("ACTIVE");
      });

      it("should render active bullet if a render function is given & type is scroll", async () => {
        // Given
        const flicking = await createFlicking(createFixture());
        const pagination = new Pagination({
          type: "scroll",
          renderActiveBullet: (className) => `<span class="${className}">ACTIVE</span>`
        });

        // When
        pagination.init(flicking);

        // Then
        const activeBullet = document.querySelector(".flicking-pagination-bullet-active");
        expect(activeBullet).not.to.be.null;
        expect(activeBullet?.innerHTML).to.equal("ACTIVE");
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
