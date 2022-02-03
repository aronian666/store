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
  <title>Venta {order._id}</title>
</svelte:head>
<div id="print" class="grid" style="gap: 1rem">
  <section class="panel grid">
    <h4>Datos del cliente</h4>
    <div class="flex" style="gap: 1rem">
      <div>
        <h5>Codigo</h5>
        <p>{order._id}</p>
      </div>
      <div>
        <h5>Cliente</h5>
        <p>{order.client.name}</p>
      </div>
      <div>
        <h5>Telefono</h5>
        <p>{order.client.phone}</p>
      </div>
      <div>
        <h5>Direccion</h5>
        <p>{order.client.direction}</p>
      </div>
    </div>
  </section>
  <section class="panel grid">
    <h4>Detalles de venta</h4>
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
            <td>S./ {cartProduct.unitPrice}</td>
            <td>S./ {cartProduct.total}</td>
          </tr>
        {/each}
        <tr>
          <td colspan="3" style="font-weight: 600;">Total</td>
          <td style="font-weight: 600;">S./ {order.total}</td>
        </tr>
      </tbody>
    </table>
  </section>
</div>
<section>
  <button
    class="inverted"
    style="--color: lime"
    on:click={(e) => window.print()}>Imprimir</button
  >
</section>
