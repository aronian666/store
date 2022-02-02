<script>
  import Info from "./Info.svelte";
  export let input;
  export let items;
  export let name;
  export let blank;
  export let title;
  export let change;
  export let info;
</script>

<fieldset>
  <label for={name} class="gap">
    {title}
    {#if info}
      <Info text={info} />
    {/if}
  </label>
  <div>
    <select
      {name}
      id={name}
      bind:value={input}
      on:change={change}
      {...$$restProps}
    >
      {#if blank}
        <option value={null} />
      {/if}
      {#each items as item}
        <slot name="option" {item} />
      {/each}
    </select>
  </div>
</fieldset>

<style>
  div {
    position: relative;
  }
  select {
    width: 100%;
  }
</style>
