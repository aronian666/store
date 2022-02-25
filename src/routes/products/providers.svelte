<script context="module">
  export async function load({ fetch }) {
    const response = await fetch("/providers.json");
    const providers = await response.json();
    return { props: { providers } };
  }
</script>

<script>
  import HandleProvider from "$lib/components/HandleProvider.svelte";
  import Modal from "$lib/components/Modal.svelte";
  export let providers = [];
  let p;
</script>

<div class="grid" style="gap: 1rem">
  <div>
    <button
      on:click={(e) => (p = { name: "" })}
      style="--color: black"
      class="inverted"
    >
      Añadir proveedor
    </button>
  </div>
  <div class="grid auto-fill gap">
    {#each providers as provider (provider._id)}
      <div
        class="panel"
        style="cursor: pointer;"
        on:click={(e) => (p = provider)}
      >
        <h4>{provider.name}</h4>
      </div>
    {/each}
  </div>
</div>

{#if p}
  <Modal handler={(e) => (p = null)}>
    <HandleProvider provider={p} />
  </Modal>
{/if}
