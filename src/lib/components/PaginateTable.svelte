<script>
  import Pagination from "./Pagination.svelte";

  export let items;
  export let header = [];
  let paginate = [];
</script>

<div class="grid gap">
  <table>
    <thead>
      <tr>
        {#each header as head}
          <th>{head}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each paginate as item}
        <slot {item} />
      {/each}
    </tbody>
  </table>
  <Pagination bind:paginate {items} count={5} />
</div>
