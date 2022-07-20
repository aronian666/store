<script>
  import Pagination from "./Pagination.svelte";
  export let index = false;
  export let properties = [];
  export let items = [];
  export let sort = properties[0];
  export let asc = true;
  export let count = 10;
  let paginate = [];

  $: {
    items = items.sort((a, b) => {
      if (asc) return a[sort.property] > b[sort.property] ? 1 : -1;
      return b[sort.property] > a[sort.property] ? 1 : -1;
    });
  }

  const setProperty = (property) => {
    if (sort.property === property.property) return (asc = !asc);
    sort = property;
    asc = true;
  };
</script>

<section class="flex gap column space-between">
  <table>
    <thead>
      <tr>
        {#if index}
          <th>Numero</th>
        {/if}
        {#each properties as property, i}
          <th
            class={property.property === sort.property
              ? asc
                ? "asc"
                : "desc"
              : ""}
            on:click={(e) => setProperty(property)}
          >
            {property.name}
          </th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each paginate as item, i}
        {#if $$slots.tr}
          <slot name="tr" {item} />
        {:else}
          <tr>
            {#each properties as property}
              <td class={property.class}>
                {property.eval
                  ? property.eval(item[property.property])
                  : item[property.property]}
              </td>
            {/each}
          </tr>
        {/if}
      {/each}
    </tbody>
  </table>
  <Pagination {items} bind:paginate {count} />
</section>

<style>
  th {
    cursor: pointer;
  }
</style>
