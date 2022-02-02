export default function parseFormData(formData = new FormData()) {
  const data = {}
  formData.forEach((value, key) => {
    const keys = key.split("[")
    data[keys[0]] = createObject(keys.slice(1, keys.length), value, data[keys[0]])
  })
  return data
}
function createObject(keys = [], value, object = {}) {
  if (keys.length === 0) return value
  object = JSON.parse(JSON.stringify(object))
  const key = keys[0].substring(0, keys[0].length - 1)
  object[key] = createObject(keys.slice(1, keys.length), value, object[key])
  return object
}