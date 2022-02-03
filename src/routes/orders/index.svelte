<script context="module">
  export async function load({ fetch }) {
    const response = await fetch("/orders.json");
    const orders = await response.json();
    return { props: { orders } };
  }
</script>

<script>
  import Filter from "$lib/components/Filter.svelte";
  import Search from "$lib/components/Search.svelte";
  import Order from "$lib/models/Order";

  export let orders;
  orders = orders.map((order) => new Order(order));
  let filtered = [];
  let searched = [];
</script>

<svelte:head>
  <title>Ventas</title>
</svelte:head>
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
  </Filter>
</section>
<section class="panel grid">
  <h3>Ventas</h3>
  <table>
    <thead>
      <tr>
        <th>Cliente</th>
        <th>Productos</th>
        <th>Fecha</th>
        <th>Detalles</th>
      </tr>
    </thead>
    <tbody>
      {#each searched as order}
        <tr>
          <td>{order.client.name}</td>
          <td>{order.cartProducts.length}</td>
          <td>{order.createdAt.toLocaleString()}</td>
          <td>
            <a sveltekit:prefetch href={`/orders/${order._id}`}>Detalles</a>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</section>
