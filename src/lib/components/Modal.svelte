<script>
  import { onMount, setContext } from "svelte";
  import { writable } from "svelte/store";
  import { scale } from "svelte/transition";
  import Icon from "./Icon.svelte";
  import Loading from "./Loading.svelte";
  export let handler;
  export let exit = false;
  export let index = 1;
  export let loading = false;
  let loadingWritable = writable(loading);
  setContext("loading", loadingWritable);
  setContext("handler", handler);

  onMount(() => {
    if (exit) return;
    const handleEvent = (event) => {
      if (!document.querySelector("#modal").contains(event.target)) handler();
    };
    document.addEventListener("mousedown", handleEvent);
    return () => {
      document.removeEventListener("mousedown", handleEvent);
    };
  });
</script>

<div style={`z-index: ${index}`} in:scale>
  {#if $loadingWritable}
    <Loading />
  {:else}
    <section id="modal">
      <slot {handler} />
      <span on:click={handler}>
        <Icon icon="close" />
      </span>
    </section>
  {/if}
</div>

<style>
  div {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #00000090;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  #modal {
    padding: 1.5rem;
    background-color: #fff;
    border-radius: 0.75rem;
    position: relative;
  }
  span {
    position: absolute;
    right: 0.5rem;
    top: 0;
    cursor: pointer;
    width: 1.125rem;
    transition: 0.1s;
  }
  span:hover {
    transform: scale(1.2);
  }
</style>
