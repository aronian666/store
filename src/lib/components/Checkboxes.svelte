<script>
  export let items;
  export let group;
  export let colors;
</script>

<div class="grid gap">
  {#each items as item, i}
    <label style={`--color: ${colors ? colors[i] : "#2196f3"}`}>
      {item}
      <input type="checkbox" bind:group value={item} />
      <span />
    </label>
  {/each}
</div>

<style>
  label {
    display: grid;
    position: relative;
    padding-left: 2rem;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }
  span {
    position: absolute;
    top: 0;
    left: 0;
    height: 1.125rem;
    width: 1.125rem;
    background-color: #eee;
  }
  label:hover input ~ span {
    background-color: #ccc;
  }
  label input:checked ~ span {
    background-color: var(--color, #2196f3);
  }
  span:after {
    content: "";
    position: absolute;
    display: none;
  }
  label input:checked ~ span:after {
    display: block;
  }
  label span:after {
    left: 0.4rem;
    top: 0.2rem;
    width: 0.25rem;
    height: 0.45rem;
    border: solid white;
    border-width: 0 2px 2px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
  }
</style>
