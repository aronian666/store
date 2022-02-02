import Category from "$lib/db/Category";
import Unit from "$lib/db/Unit";

export async function get() {
  const units = await Unit.find()
  const categories = await Category.find()
  return { body: { units, categories } }
}