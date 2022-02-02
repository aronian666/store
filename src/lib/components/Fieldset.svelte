<script>
  import Info from "./Info.svelte";

  export let icon;
  export let input;
  export let readonly = false;
  export let name;
  export let title;
  export let info;
  export let error;
  export let onChange;
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
    <input
      {name}
      id={name}
      {readonly}
      on:change={onChange}
      bind:value={input}
      {...$$restProps}
    />
    {#if error}
      <p class="error">{error}</p>
    {/if}
  </div>
</fieldset>

<style>
  div {
    position: relative;
  }
  div:hover i {
    display: none;
  }
  i {
    position: absolute;
    height: 100%;
    aspect-ratio: 1/1;
    display: grid;
    right: 0;
    place-content: center;
  }
  i:hover {
    display: none;
  }
  input {
    width: 100%;
  }
</style>
