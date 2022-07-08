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
  export let onFocus;
  export let onBlur;
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
      class:icon
      bind:value={input}
      on:focus={onFocus}
      on:blur={onBlur}
      {...$$restProps}
    />
    {#if onClick}
      <button type="button" on:click={onClick}>
        <Icon icon="edit" size={14} />
      </button>
    {/if}
  </div>
  <slot />
</fieldset>

<style>
  .icon {
    padding-left: 2rem;
  }
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
