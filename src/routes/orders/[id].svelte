<script context="module">
  export async function load({ fetch, params }) {
    const respose = await fetch(`/orders/${params.id}.json`);
    const order = await respose.json();
    return { props: { order } };
  }
</script>

<script>
  import Order from "$lib/models/Order";
  export let order;
  order = new Order(order);
</script>

<svelte:head>
  <title>Codigo: {order.code}</title>
</svelte:head>
<div id="print" class="grid" style="gap: 1rem">
  <div class="flex" style="gap: 1rem">
    <div>
      <h5>Cliente</h5>
      <p>{order.client.showName}</p>
    </div>
    <div>
      <h5>Telefono</h5>
      <p>{order.client.showPhone}</p>
    </div>
    <div>
      <h5>Direccion</h5>
      <p>{order.client.showDirection}</p>
    </div>
  </div>
  <table>
    <thead>
      <tr>
        <th>Cantidad</th>
        <th>Nombre</th>
        <th>Precio unitario</th>
        <th>Precio total</th>
      </tr>
    </thead>
    <tbody>
      {#each order.cartProducts as cartProduct, i}
        <tr>
          <td>{cartProduct.options.quantity}</td>
          <td>{cartProduct.showName}</td>
          <td>S./ {cartProduct.finalUnitPrice}</td>
          <td>S./ {cartProduct.total}</td>
        </tr>
      {/each}
      <tr>
        <td colspan="3" style="font-weight: 600;">Total</td>
        <td style="font-weight: 600;">S./ {order.total}</td>
      </tr>
    </tbody>
  </table>
</div>
<section>
  <button class="inverted" style="--color: red" on:click={(e) => window.print()}
    >Imprimir</button
  >
</section>
