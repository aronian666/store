<script context="module">
  export async function load({ fetch, url }) {
    const response = await fetch("/contracts.json");
    const usersResponse = await fetch("/users.json");
    const users = await usersResponse.json();
    let contracts = await response.json();
    const id = url.searchParams.get("quote");
    const responseQuote = id && (await fetch(`/quotes/${id}.json`));
    const quote = responseQuote && (await responseQuote.json());
    return { props: { contracts, quote, users } };
  }
</script>

<script>
  import Calendar from "$lib/components/Calendar.svelte";
  import ContractStatus from "$lib/components/ContractStatus.svelte";
  import Week from "$lib/components/Week.svelte";
  import Contract from "$lib/models/Contract";
  import Quote from "$lib/models/Quote";
  import Service from "$lib/models/Service";

  import { onMount, setContext } from "svelte";

  export let contracts = [];
  export let clients = [];
  export let users = [];
  export let quote;
  let services = [];
  onMount(async () => {
    const response = await fetch("/services.json");
    services = await response.json();
    contracts = contracts.map((contract) => {
      contract.service = services.find(
        (service) => contract.service === service._id
      );
      contract.service = new Service(contract.service);
      return contract;
    });
  });
  quote = quote && new Quote(quote);
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
  setContext("quote", quote);
  let current = new Date();
  let statuses = Contract.statuses.map((status) => status.name);
</script>

<div class="flex" style="gap: 1rem">
  <div class="calendar">
    <Calendar bind:current />
    <div class="divide" />
    <ContractStatus bind:statuses />
    <div class="divide" />
    {#if quote}
      <section class="grid gap">
        <h3>Contizacion seleccionada</h3>
        <div class="grid auto-fit" style="--size: 100px; gap: .25rem">
          <div>
            <b>Cliente</b>
            <p>{quote.clientName}</p>
          </div>
          <div>
            <b>Vendedor</b>
            <p>{quote.employeeName}</p>
          </div>
          <div>
            <b>Productos</b>
            <p>{quote.productCount}</p>
          </div>
          <div>
            <b>Total</b>
            <p>{quote.total}</p>
          </div>
        </div>
        <a
          href={`/contracts/quotes`}
          class="button holed"
          style="--color: green">Cambiar</a
        >
      </section>
    {/if}
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
  b {
    font-weight: 500;
  }
  p {
    color: var(--text);
  }
</style>
