export function isEqualObject(object1, object2) {
  const large = Object.keys(object1).length > Object.keys(object2).length ? object1 : object2
  for (const key in large) {
    if (typeof object1[key] === "object" && typeof object2[key] === "object" && isEqualObject(object1[key], object2[key])) continue
    if (object1[key] !== object2[key]) return false
  }
  return true
}