<script>
  import List from "./List.svelte";
  import Group from "$lib/models/Group";
  import Li from "./Li.svelte";
  import Sale from "./Sale.svelte";
  export let group = new Group({});
  export let handler;
  export let index;
  export let cartProduct;
</script>

<div class="grid gap">
  <div class="grid gap">
    {#each group.showVariants as variant, i}
      <div class="grid gap" style="gap: 0.25rem">
        <h5>{variant.name}</h5>
        <List items={variant.combinations} let:item>
          <Li
            slot="li"
            text={item.variant[variant.name]}
            onClick={(e) => (variant.value = item.variant[variant.name])}
            active={variant.value === item.variant[variant.name]}
          />
        </List>
      </div>
    {/each}
  </div>
  <Sale
    {cartProduct}
    product={group.products.find((p) => p._id === group.combination.product)}
    {handler}
    {group}
    {index}
  />
</div>
