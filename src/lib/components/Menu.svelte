<script>
  export let items = [];

  export let current;
</script>

<nav class="flex gap">
  {#each items as item}
    <div on:click={(e) => (current = item)} class:active={current === item}>
      {item}
    </div>
  {/each}
</nav>

<style>
  div {
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    cursor: pointer;
    background-color: var(--gray);
  }
  div.active {
    background-color: black;
    color: white;
  }
</style>
