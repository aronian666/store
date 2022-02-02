
import { isEqualObject } from "$lib/scripts/equal";
import ActiveRecord from "./ActiveRecord";
import Combination from "./Combination";

export default class Group extends ActiveRecord {
  constructor({ _id, name = "", photo = {}, variants = [], combinations = [] }) {
    super(_id)
    this.name = name
    this.photo = photo
    this.combinations = combinations.map(combination => new Combination(combination))
    this.combination = this.combinations[0]
    this.products = []
    this.variants = variants.map(variant => {
      variant.value = this.combination.variant[variant.name]
      return variant
    })
  }
  setCombination(product) {
    if (!product) return
    this.combination = this.combinations.find(combination => combination.product._id === product._id)
    return this
  }
  getVariant() {
    let statusVariant = {}
    this.variants.map(v => {
      statusVariant[v.name] = v.value
    })
    return statusVariant
  }
  get showVariants() {
    let statusVariant = this.getVariant()
    const that = this
    this.combination = this.combinations.find(combination => isEqualObject(statusVariant, combination.variant))
    if (!this.combination) {
      this.combination = this.combinations.find(combination => combination.variant[this.variants[0].name] === statusVariant[this.variants[0].name])
      this.variants = this.variants.map(variant => {
        variant.value = this.combination.variant[variant.name]
        return variant
      })
      statusVariant = this.getVariant()
    }
    const availableVariants = this.variants.map((variant, index) => {
      let combinations = this.combinations
      if (index >= 1) {
        combinations = this.combinations.filter((combination => {
          return Array(index).fill(0).reduce((a, b, i) => {
            const beforeVariantName = that.variants[index - i - 1].name
            return a && combination.variant[beforeVariantName] === statusVariant[beforeVariantName]
          }, true)
        }))
      }
      variant.combinations = combinations.filter((v, i, a) => a.findIndex(t => (t.variant[variant.name] === v.variant[variant.name])) === i)
      return variant
    })
    return availableVariants
  }
  combine() {
    const combinations = Group.getCombinations(this.variants).map(combination => new Combination({ product_id: "", product_name: "", variant: combination }))
    this.combinations = [...this.combinations, ...combinations]
  }
  reset() {
    this.variants = this.variants.map(variant => {
      variant.values = [""]
      return variant
    })
  }
  static getCombinations(variants = []) {
    let ga = [];
    variants.forEach(variant => {
      if (variant.values.length === 0) return
      ga = Group.combine(ga, { name: variant.name, options: variant.values.filter(value => value.length > 0) })
    })
    return ga;
  }
  static combine = (combinations, variant) => {
    const allCombinations = [];
    if (combinations.length === 0) {
      variant.options.forEach((option) => {
        allCombinations.push({ [variant.name]: option });
      });
    }
    combinations.forEach((conbination) => {
      variant.options.forEach((option) => {
        allCombinations.push({
          ...conbination,
          [variant.name]: option,
        });
      });
    });
    return allCombinations;
  };
}