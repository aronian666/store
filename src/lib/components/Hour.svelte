<script>
  import Contract from "$lib/models/Contract";
  import { getContext } from "svelte";

  import CreateContract from "./CreateContract.svelte";
  import Modal from "./Modal.svelte";
  import { goto } from "$app/navigation";

  export let day;
  export let month;
  export let year;
  export let hour;
  export let contracts = [];
  $: date = new Date(year, month, day, hour);
  let open = false;
  const quote = getContext("quote");
  const newContract = (e) => {
    if (quote) return (open = true);
    alert("No hay cotizacion seleccionada, por favor seleccione uno!");
    goto(`/contracts/quotes`);
  };
  $: know =
    Date.now() > date.getTime() && Date.now() < date.getTime() + 1000 * 3600;
</script>

<div class="father">
  <div class="contract" on:click={newContract}>
    {#if know}
      <div
        class="know"
        style={`--position: ${(new Date().getMinutes() / 60) * 100}%`}
      />
    {/if}
  </div>
  {#each contracts as contract}
    <a
      href={`/contracts/${contract._id}`}
      sveltekit:prefetch
      class="flex column wrap"
      style={`--start: ${(contract.start.getMinutes() / 60) * 50}%; --end: ${
        (Contract.getMinutes(contract.start, contract.end) / 60) * 100
      }%; --color: ${contract.statusColor}`}
    >
      <span>
        {contract.service.name}
      </span>
      <span>
        {`${hour}:${contract.start.getMinutes()} - ${contract.end.getHours()}:${contract.end.getMinutes()}`}
      </span>
    </a>
  {/each}
</div>
{#if open}
  <Modal handler={(e) => (open = false)}><CreateContract {date} /></Modal>
{/if}

<style>
  .father {
    position: relative;
  }
  .know {
    background-color: red;
    height: 2px;
    position: absolute;
    top: var(--position);
    width: 100%;
  }
  .contract {
    aspect-ratio: 3;
    background-color: white;
    cursor: pointer;
  }
  .contract:hover {
    background-color: #eee;
    transition: 0.5s;
  }
  a {
    position: absolute;
    top: var(--start);
    background-color: var(--color);
    height: var(--end);
    width: 100%;
    font-size: 0.8rem;
    color: white;
  }
</style>
