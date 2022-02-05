<script context="module">
  export async function load({ session, fetch }) {
    if (!session.current_user) return { status: 303, redirect: "/login" };
    return { props: null };
  }
</script>

<script>
  import { session } from "$app/stores";
  import Fieldset from "$lib/components/Fieldset.svelte";
  import Loading from "$lib/components/Loading.svelte";
  import Table from "$lib/components/Table.svelte";
  import ActiveRecord from "$lib/models/ActiveRecord";

  import Order from "$lib/models/Order";
  import { getInputDate } from "$lib/scripts/date";
  let current_user = $session.current_user;
  let orders = [];
  const day = 1000 * 60 * 60 * 24;
  let startDate = new Date();
  startDate.setHours(0, 0, 0, 0);
  let endDate = new Date(startDate.getTime() + day);
  startDate = getInputDate(startDate);
  endDate = getInputDate(endDate);
  const changeDate = async (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const request = `?start=${startDate.getTime()}&end=${endDate.getTime()}`;
    const { data } = await ActiveRecord.get(
      `/orders.json${request}&cart_products=true`
    );
    return data;
  };
  $: {
    loading = true;
    changeDate(startDate, endDate)
      .then((data) => {
        orders = data.map((order) => new Order(order));
        loading = false;
      })
      .catch((error) => {
        orders = [];
        loading = false;
      });
  }
  $: employees = Order.groupEmployess(orders);
  $: products = Order.groupProducts(orders);
  let loading = false;
</script>

<div class="grid" style="gap: 1rem" id="print">
  <div class="panel">
    <h3>Fecha</h3>
    <div class="flex gap">
      <Fieldset title="Inicio" type="date" bind:input={startDate} />
      <Fieldset title="Final" type="date" bind:input={endDate} />
    </div>
  </div>
  {#if loading}
    <div class="grid place-content">
      <Loading />
    </div>
  {:else}
    <div class="panel grid">
      <h3>Resumen de ventas</h3>
      <div class="flex wrap gap" style="--color: tomato">
        <section class="panel grid gap">
          <h4>Ventas</h4>
          <p>{orders.length}</p>
        </section>
        <section class="panel grid gap">
          <h4>Productos vendidos</h4>
          <p>{Order.totalQuantity(orders)}</p>
        </section>

        <section class="panel grid gap">
          <h4>Total vendido</h4>
          <p>S./ {Order.totalSell(orders)}</p>
        </section>
        <section class="panel grid gap">
          <h4>Ganancia total</h4>
          <p>S./ {Order.totalGain(orders)}</p>
        </section>
      </div>
    </div>
    <section class="panel grid">
      <h3>Resumen de vendedores</h3>
      <Table
        items={employees}
        properties={[
          { name: "Venderor", property: "name" },
          { name: "Numero de ventas", property: "ordersCount" },
          { name: "Total vendido", property: "sellQuantity" },
          { name: "Productos vendidos", property: "productQuantity" },
        ]}
      />
    </section>
    <section class="panel grid">
      <h3>Resumen de productos</h3>
      <Table
        items={products}
        properties={[
          { name: "Producto", property: "name" },
          { name: "Vendidos", property: "quantity" },
          { name: "Recaudado", property: "totalSell" },
          { name: "Ganancia", property: "gain" },
        ]}
      />
    </section>
  {/if}
</div>
