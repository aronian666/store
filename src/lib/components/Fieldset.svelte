<script>
  import Icon from "./Icon.svelte";

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
    <span>
      <Icon {icon} />
    </span>
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
  div:hover span {
    display: none;
  }
  span {
    position: absolute;
    height: 100%;
    aspect-ratio: 1/1;
    display: grid;
    right: 0;
    place-content: center;
  }
  input {
    width: 100%;
  }
</style>
