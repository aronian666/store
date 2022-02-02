<script>
  import Icon from "./Icon.svelte";

  export let items;
  export let count = 10;
  export let paginate = [];
  const max = 5;
  let page = 0;
  $: {
    paginate = items.slice(page * count, (page + 1) * count);
  }
  $: {
    items;
    page = 0;
  }
  $: pages = parseInt(items.length / count) + 1;
  $: maxPages = Math.min(max, pages);
  $: half = parseInt(maxPages / 2);

  $: rest = Array(maxPages)
    .fill(0)
    .map((a, index) => {
      if (page - half < 0) return index;
      if (page + maxPages > pages) return pages - maxPages + index;
      return index + page - half;
    });
</script>

{#if pages > 1}
  <section class="flex gap">
    <ul>
      <li
        on:click={(e) => {
          if (page > 0) page--;
        }}
      >
        <Icon icon="west" />
      </li>
      {#if page - half > 0}
        <li on:click={(e) => (page = 0)}>1</li>
      {/if}
    </ul>
    {#if page - half > 0}
      <span>...</span>
    {/if}
    <ul>
      {#each rest as index}
        <li class:active={index === page} on:click={(e) => (page = index)}>
          {index + 1}
        </li>
      {/each}
    </ul>
    {#if page + maxPages - half + 1 < pages}
      <span>...</span>
    {/if}
    <ul>
      {#if page + maxPages - half + 1 < pages}
        <li on:click={(e) => (page = pages - 1)}>{pages}</li>
      {/if}
      <li
        on:click={(e) => {
          if (page < pages) page++;
        }}
      >
        <Icon icon="east" />
      </li>
    </ul>
  </section>
{/if}

<style>
  ul {
    display: flex;
    gap: 0.5rem;
    list-style-type: none;
  }
  li {
    padding: 0.25rem 0.75rem;
    border: 1px solid #ccc;
    border-radius: 0.5rem;
    cursor: pointer;
    display: grid;
    place-content: center;
  }
  .active {
    background-color: black;
    color: white;
    border: 1px solid black;
  }
</style>
