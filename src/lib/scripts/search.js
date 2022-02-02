export function searchIndividual(array, strings) {
  if (strings.length === 0) return array
  const newArray = searchArray(array, strings[0])
  return searchIndividual(newArray, strings.slice(1, strings.length))
}
export function searchArray(array, string) {
  return array.filter((element) => {
    if (["string", "number"].includes(typeof element)) return element.toString().toLocaleLowerCase().includes(string.toLocaleLowerCase())
    if (Array.isArray(element)) return searchArray(element, string).length > 0
    if (typeof element === "object") return searchObject(element, string)
    return false
  });
};
const searchObject = (object, string) => {
  for (const key in object) {
    if (["string", "number"].includes(typeof object[key]) && object[key].toString().toLocaleLowerCase().includes(string.toLocaleLowerCase())) return true
    if (typeof object[key] === "object" && searchObject(object[key], string)) return true
    if (Array.isArray(object[key]) && searchArray(object[key], string).length > 0) return true
  }
  return false
}