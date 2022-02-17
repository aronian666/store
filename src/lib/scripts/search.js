export function searchIndividual(array, strings, properties) {
  if (strings.length === 0) return array
  const newArray = searchArray(array, strings[0], properties)
  return searchIndividual(newArray, strings.slice(1, strings.length))
}
export function searchArray(array, string, properties) {
  return array.filter((element) => {
    if (["string", "number"].includes(typeof element)) return element.toString().toLocaleLowerCase().includes(string.toLocaleLowerCase())
    if (Array.isArray(element)) return searchArray(element, string).length > 0
    if (typeof element === "object") return searchObject(element, string, properties)
    return false
  });
};
const searchObject = (object, string, properties) => {
  const keys = properties || Object.keys(object)
  for (const key of keys) {
    if (["string", "number"].includes(typeof object[key]) && object[key].toString().toLocaleLowerCase().includes(string.toLocaleLowerCase())) return true
    if (typeof object[key] === "object" && searchObject(object[key], string)) return true
    if (Array.isArray(object[key]) && searchArray(object[key], string).length > 0) return true
  }
  return false
}