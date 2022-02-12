export function randomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (var i = 0; i < 6; i++) {
    if ([0, 1].includes(i)) {
      color += "F"
      continue
    }
    color += letters[Math.floor(Math.random() * 4) + 5];
  }
  return color;
}