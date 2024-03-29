<script>
  import Fieldset from "$lib/components/Fieldset.svelte";
  import Loading from "$lib/components/Loading.svelte";
  import Menu from "$lib/components/Menu.svelte";
  import Table from "$lib/components/Table.svelte";
  import ActiveRecord from "$lib/models/ActiveRecord";
  import Order from "$lib/models/Order";
  import Product from "$lib/models/Product";
  import { getInputDate } from "$lib/scripts/date";
  import { onMount } from "svelte";
  import Modal from "./Modal.svelte";
  import OrdersPerProduct from "./OrdersPerProduct.svelte";
  import Switch from "./Switch.svelte";
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
    endDate.setHours(23, 59, 59);
    const request = `?start=${startDate.getTime()}&end=${endDate.getTime()}`;
    const { data } = await ActiveRecord.get(`/orders.json${request}`);
    return data;
  };
  let replenishProducts = [];
  onMount(async () => {
    const { data } = await ActiveRecord.get("/products.json?replenish=true");
    replenishProducts = data.map((product) => new Product(product));
  });
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
  let openDetails = {
    open: false,
    cartProducts: [],
  };
  let loading = false;
  let current = "Resumen";
  const updateProduct = async (product) => {
    const { data, error } = await Product.send(
      { action: "/products.json?_method=PUT", method: "post" },
      { product }
    );
  };
</script>

<div class="grid" style="gap: 1rem">
  <Menu items={["Resumen", "Para comprar"]} bind:current />
  {#if current === "Resumen"}
    <div class="grid" style="gap: 1rem" id="print">
      <div class="panel grid">
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
          <div class="flex wrap gap" style="--color: #00000030">
            <section class="panel grid gap">
              <p class="b-500">Ventas</p>
              <h3>{orders.length}</h3>
            </section>
            <section class="panel grid gap">
              <p class="b-500">Productos vendidos</p>
              <h3>{Order.totalQuantity(orders)}</h3>
            </section>

            <section class="panel grid gap">
              <p class="b-500">Total vendido</p>
              <h3>S./ {Order.totalSell(orders)}</h3>
            </section>
            <section class="panel grid gap">
              <p class="b-500">Ganancia total</p>
              <h3>S./ {Order.totalGain(orders)}</h3>
            </section>
          </div>
        </div>
        <div class="flex gap wrap">
          <section class="panel flex column" style="flex: 1 1 auto">
            <h3>Resumen de vendedores</h3>
            <Table
              items={employees}
              count={5}
              properties={[
                { name: "Venderor", property: "name" },
                { name: "Numero de ventas", property: "ordersCount" },
                { name: "Total vendido", property: "sellQuantity" },
                { name: "Productos vendidos", property: "productQuantity" },
              ]}
              let:item
            >
              <tr slot="tr">
                <td>{item.name}</td>
                <td>{item.ordersCount}</td>
                <td>S./ {item.sellQuantity}</td>
                <td>{item.productQuantity}</td>
              </tr>
            </Table>
          </section>
          <section class="panel flex column" style="flex: 1 1 auto">
            <h3>Resumen de productos</h3>
            <Table
              items={products}
              count={5}
              properties={[
                { name: "Producto", property: "name" },
                { name: "Vendidos", property: "quantity" },
                { name: "Recaudado", property: "totalSell" },
                { name: "Ganancia", property: "gain" },
              ]}
              let:item
            >
              <tr slot="tr">
                <td
                  ><span
                    on:click={(e) =>
                      (openDetails = {
                        open: true,
                        cartProducts: item.cartProducts,
                      })}>{item.name}</span
                  ></td
                >
                <td>{item.quantity}</td>
                <td>S./ {item.totalSell}</td>
                <td>S./ {item.gain}</td>
              </tr>
            </Table>
          </section>
        </div>
      {/if}
    </div>
  {/if}
  {#if current === "Para comprar"}
    <Table
      items={replenishProducts}
      properties={[
        { name: "Nombre", property: "name" },
        { name: "Cantidad restante", property: "quantity" },
        { name: "Ver", property: "details" },
      ]}
      let:item
    >
      <tr slot="tr">
        <td>
          {item.name}
        </td>
        <td>
          {item.quantity}
        </td>
        <td>
          <Switch
            input={item.replenish}
            onChange={(value) => {
              item.replenish = value;
              updateProduct(item);
            }}
          />
        </td>
        <td>
          <a href={`/products/${item._id}`}>Ver</a>
        </td>
      </tr>
    </Table>
  {/if}
</div>

{#if openDetails.open}
  <Modal handler={(e) => (openDetails = false)}>
    <OrdersPerProduct cartProducts={openDetails.cartProducts} />
  </Modal>
{/if}

<style>
  span {
    cursor: pointer;
  }
  span:hover {
    text-decoration: underline;
    font-weight: bold;
  }
</style>
