<script>
  export let items = [];
</script>

<ul {...$$restProps}>
  {#each items as item, i}
    <slot name="li" {item} {i} />
  {/each}
</ul>

<style>
  ul {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
    padding: 0;
  }
</style>
