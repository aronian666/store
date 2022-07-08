<script context="module">
  export async function load({ fetch }) {
    const response = await fetch("/contracts.json");
    const contracts = await response.json();
    return { props: contracts };
  }
</script>

<script>
  import Calendar from "$lib/components/Calendar.svelte";
  import ContractStatus from "$lib/components/ContractStatus.svelte";
  import Week from "$lib/components/Week.svelte";
  import Contract from "$lib/models/Contract";

  import { setContext } from "svelte";
  export let contracts = [];
  export let clients = [];
  export let users = [];
  export let services = [];
  contracts = contracts.map((contract) => new Contract(contract));
  const addContract = (contract) => {
    contracts.push(contract);
    contracts = contracts;
  };

  setContext("contracts", contracts);
  setContext("clients", clients);
  setContext("users", users);
  setContext("services", services);
  setContext("addContract", addContract);
  let current = new Date();
  let statuses = Contract.statuses.map((status) => status.name);
</script>

<div class="flex" style="gap: 1rem">
  <div class="calendar">
    <Calendar bind:current />
    <ContractStatus bind:statuses />
  </div>
  <div class="week">
    <Week
      bind:current
      contracts={contracts.filter((contract) =>
        statuses.includes(contract.statusString)
      )}
    />
  </div>
</div>

<style>
  .calendar {
    flex: auto 1 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .week {
    flex: auto 14 1;
  }
</style>
