<script context="module">
  export async function load({ fetch, url }) {
    if (url.search === "") {
      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(startDate.getTime() + 1000 * 60 * 60 * 24);
      url.search = `?start=${startDate.getTime()}&end=${endDate.getTime()}`;
      return { status: 303, redirect: `/orders${url.search}` };
    }
    const response = await fetch("/orders.json" + url.search);
    const orders = await response.json();
    return { props: { orders } };
  }
</script>

<script>
  import Filter from "$lib/components/Filter.svelte";
  import Search from "$lib/components/Search.svelte";
  import Order from "$lib/models/Order";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import Fieldset from "$lib/components/Fieldset.svelte";
  import { getInputDate } from "$lib/scripts/date";
  import Table from "$lib/components/Table.svelte";
  export let orders;
  orders = orders.map((order) => new Order(order));
  let filtered = [];
  let searched = [];
  let start = getInputDate($page.url.searchParams.get("start"));
  let end = getInputDate($page.url.searchParams.get("end"));
  const changeDate = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    goto(`/orders?start=${startDate.getTime()}&end=${endDate.getTime()}`);
  };
</script>

<svelte:head>
  <title>Ventas</title>
</svelte:head>
<div class="grid" style="gap: 1rem">
  <section class="panel">
    <h3>Filtros</h3>
    <Filter
      items={orders}
      bind:filtered
      filter={[
        { name: "Cliente", property: "clientName" },
        { name: "Vendedor", property: "employeeName" },
      ]}
    >
      <Search items={filtered} bind:searched />
      <Fieldset
        title="Inicio"
        type="date"
        bind:input={start}
        onChange={(e) => changeDate(start, end)}
      />
      <Fieldset
        title="Fin"
        type="date"
        bind:input={end}
        onChange={(e) => changeDate(start, end)}
      />
    </Filter>
  </section>
  <section class="panel grid">
    <h3>Ventas</h3>
    <p>
      Las filas de color <span style="color: red; font-weight: 600">Rojo</span> tienen
      el precio modificado.
    </p>
    <Table
      let:item
      items={searched}
      properties={[
        { name: "Cliente", property: "clientName" },
        { name: "Vendedor", property: "employeeName" },
        { name: "Productos", property: "productCount" },
        { name: "Fecha", property: "createdAt" },
        { name: "Detalles" },
      ]}
    >
      <tr slot="tr" class:changed={item.changed}>
        <td>{item.clientName}</td>
        <td>{item.employee.name}</td>
        <td>{item.cartProducts.length}</td>
        <td>{item.createdAt.toLocaleString()}</td>
        <td>
          <a sveltekit:prefetch href={`/orders/${item._id}`}>Detalles</a>
        </td>
      </tr>
    </Table>
  </section>
</div>

<style>
  .changed {
    background-color: rgba(255, 99, 71, 0.137);
  }
</style>
