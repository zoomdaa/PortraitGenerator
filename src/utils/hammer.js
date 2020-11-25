import Hammer from "hammerjs";

export const onPan = (el) => {
  return new Promise((resolve) => {
    const hammer = new Hammer(el);
    hammer.on("pan", (ev) => resolve(ev));
  });
};
