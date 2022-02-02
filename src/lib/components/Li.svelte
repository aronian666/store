<script>
  export let text;
  export let onDelete;
  export let active;
  export let onClick;
</script>

<li {...$$restProps} class:active>
  <p on:click={onClick} style={onClick ? "cursor: pointer" : ""}>
    {text}
  </p>
  {#if onDelete}
    <span on:click={onDelete}>X</span>
  {/if}
</li>

<style>
  li {
    list-style-type: none;
    display: flex;
    border-radius: 0.25rem;
    overflow: hidden;
  }
  li > * {
    padding: 0.5rem 0.75rem;
    border: 1px solid black;
  }
  span {
    cursor: pointer;
    transition: 0.3s;
    border-left: none;
    font-weight: 600;
  }
  span:hover {
    color: white;
    background-color: black;
  }
  .active {
    color: white;
    background-color: black;
  }
</style>
