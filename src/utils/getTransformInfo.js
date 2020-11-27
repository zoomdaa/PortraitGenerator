/**
 * 通过getComputedStyle获取translate的值
 */
export default (el) => {
  let val = { x: 0, y: 0 };
  if (!el) return val;
  let res = window.getComputedStyle(el).getPropertyValue("transform");
  if (!res || res === "none") return val;
  // matrix(1, 0, 0, 1, 10, 20)
  res = res.replace(")", "");
  const resArr = res.split(",");
  val.x = Number(resArr[resArr.length - 2]);
  val.y = Number(resArr[resArr.length - 1]);
  return val;
};
