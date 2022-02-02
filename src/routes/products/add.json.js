import Category from "$lib/db/Category";
import Product from "$lib/db/Product";
import Unit from "$lib/db/Unit";

export async function get() {
  const units = await Unit.find()
  const categories = await Category.find()
  return { body: { units, categories } }
}

export async function post({ request }) {
  const body = await request.json()
  const categories = await Category.find()
  const newCategories = []
  const units = await Unit.find()
  const newUnits = []
  const products = body.products.map(product => {
    let category = [...categories, ...newCategories].find(category => category.name == product.category.name)
    if (!category) {
      category = new Category(product.category)
      newCategories.push(category)
    }
    product.category = category
    product.unitProducts = product.unitProducts.map(unitProduct => {
      let unit = [...units, ...newUnits].find(unit => unit.name == unitProduct.unit.name)
      if (!unit) {
        unit = new Unit(unitProduct.unit)
        newUnits.push(unit)
      }
      unitProduct.unit = unit
      return unitProduct
    })
    return product
  })
  await Category.insertMany(newCategories)
  await Unit.insertMany(newUnits)
  await Product.insertManyAll(products)
  return { body: true }
}