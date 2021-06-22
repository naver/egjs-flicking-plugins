export const ARROW = {
  PREV_SELECTOR: ".flicking-arrow-prev",
  NEXT_SELECTOR: ".flicking-arrow-next",
  DISABLED_CLASS: "flicking-arrow-disabled"
} as const;

export const PAGINATION = {
  SELECTOR: ".flicking-pagination",
  BULLET_CLASS: "flicking-pagination-bullet",
  BULLET_ACTIVE_CLASS: "flicking-pagination-bullet-active",
  FRACTION_CURRENT_CLASS: "flicking-pagination-fraction-current",
  FRACTION_TOTAL_CLASS: "flicking-pagination-fraction-total",
  TYPE: {
    BULLET: "bullet",
    FRACTION: "fraction"
  }
} as const;
