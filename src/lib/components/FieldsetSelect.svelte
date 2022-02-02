<script>
  import Info from "./Info.svelte";

  export let icon;
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
    <i class={icon} />
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
  i {
    position: absolute;
    width: 1.5rem;
    display: grid;
    place-content: center;
    aspect-ratio: 1/1;
  }
  select {
    width: 100%;
  }
</style>
