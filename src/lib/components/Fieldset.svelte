<script>
  import Icon from "./Icon.svelte";
  import Info from "./Info.svelte";
  export let icon;
  export let input;
  export let readonly = false;
  export let name;
  export let title;
  export let info;
  export let onChange;
  export let onClick;
</script>

<fieldset>
  <label for={name} class="gap">
    {title}
    {#if info}
      <Info text={info} />
    {/if}
  </label>
  <div>
    {#if icon}
      <span>
        <Icon {icon} size={20} />
      </span>
    {/if}
    <input
      {name}
      id={name}
      {readonly}
      on:change={onChange}
      style={`padding-left: ${icon ? "2rem" : "1rem"}`}
      bind:value={input}
      {...$$restProps}
    />
    {#if onClick}
      <button type="button" on:click={onClick}>
        <Icon icon="edit" size={14} />
      </button>
    {/if}
  </div>
</fieldset>

<style>
  div {
    position: relative;
    display: flex;
    gap: 0.25rem;
    font: inherit;
  }
  span {
    position: absolute;
    height: 100%;
    aspect-ratio: 1/1;
    display: grid;
    left: -0.25rem;
    font-size: 1rem;
    place-content: center;
  }
  input {
    width: 100%;
  }
  button {
    padding: 0.5rem;
  }
</style>
