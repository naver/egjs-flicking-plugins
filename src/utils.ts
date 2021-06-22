export const addClass = (el: HTMLElement, className: string) => {
  if (el.classList) {
    el.classList.add(className);
  } else {
    if (el.className.indexOf(className) < 0) {
      el.className = `${el.className} ${className}`;
    }
  }
};

export const removeClass = (el: HTMLElement, className: string) => {
  if (el.classList) {
    el.classList.remove(className);
  } else {
    const classRegex = new RegExp(`( |^)${className}( |$)`, "g");
    el.className.replace(classRegex, " ");
  }
};
