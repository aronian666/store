<script context="module">
  export async function load({ fetch }) {
    const response = await fetch("/units.json");
    const units = await response.json();
    return { props: { units } };
  }
</script>

<script>
  import ManageUnit from "$lib/components/ManageUnit.svelte";
  import Modal from "$lib/components/Modal.svelte";
  import Unit from "$lib/models/Unit";
  export let units = [];
  units = units.map((unit) => new Unit(unit));
  let u;
</script>

<div class="grid" style="gap: 1rem">
  <div>
    <button
      on:click={(e) => (u = new Unit({}))}
      style="--color: black"
      class="inverted"
    >
      Añadir unidad
    </button>
  </div>
  <div class="grid auto-fill gap">
    {#each units as unit (unit._id)}
      <div class="panel" style="cursor: pointer;" on:click={(e) => (u = unit)}>
        <h4>{unit.name}</h4>
      </div>
    {/each}
  </div>
</div>

{#if u}
  <Modal handler={(e) => (u = null)}>
    <ManageUnit unit={u} />
  </Modal>
{/if}
