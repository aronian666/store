export const evalPrice = (price) => {
  let string = "x + x * 30 / 100"
  string = string.replaceAll("x", price)
  const value = new Function('return ' + string)();
  return parseFloat(value.toFixed(2))
}