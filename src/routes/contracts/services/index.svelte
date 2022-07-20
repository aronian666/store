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
  import Service from "$lib/models/Service";

  export let services = [];
  let create = false;
</script>

<div class="grid gap">
  <div>
    <button
      class="inverted"
      style="--color: green"
      on:click={(e) => (create = true)}
    >
      Crear servicio
    </button>
  </div>

  <div class="grid gap auto-fill">
    {#each services as service}
      <div class="panel grid gap">
        <h4 style="text-align: center">{service.name}</h4>
        <div class="grid auto-fit gap" style="--size: 100px">
          <button class="holed" style="--color: orange">Editar</button>
          <button
            on:click={async (e) => {
              await Service.del({ _id: service._id });
              location.reload();
            }}
            class="holed"
            style="--color: red">Eliminar</button
          >
        </div>
      </div>
    {/each}
  </div>
</div>
{#if create}
  <Modal handler={(e) => (create = false)}>
    <CreateService />
  </Modal>
{/if}
