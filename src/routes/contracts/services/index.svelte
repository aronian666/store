<script context="module">
  export async function load({ fetch }) {
    const response1 = await fetch("/contracts/services.json");
    const services = await response1.json();
    return { props: { services } };
  }
</script>

<script>
  import CreateService from "$lib/components/CreateService.svelte";
  import Modal from "$lib/components/Modal.svelte";

  export let services = [];
  let create = false;
</script>

<div>
  <button on:click={(e) => (create = true)}> Crear servicio </button>
</div>
{#if create}
  <Modal handler={(e) => (create = false)}>
    <CreateService />
  </Modal>
{/if}

{services.length}
