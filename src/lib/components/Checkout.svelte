<script>
  import { goto } from "$app/navigation";

  import ActiveRecord from "$lib/models/ActiveRecord";

  import { getContext, onMount } from "svelte";
  import Fieldset from "./Fieldset.svelte";
  let order = getContext("order");
  let loading = getContext("loading");
  let handler = getContext("handler");
  let clients = [];
  const submitOrder = async (e) => {
    loading.set(true);
    const { data, error } = await ActiveRecord.send(e.target, {
      order: $order,
    });
    if (error) return handler();
    $order.cartProducts = [];
    order.set($order);
    goto(`/orders/${data._id}`);
  };
  onMount(async () => {
    const { data, error } = await ActiveRecord.get("/clients.json");
    clients = data;
  });
</script>

<form
  action="/orders/new.json"
  method="post"
  on:submit|preventDefault={submitOrder}
>
  <Fieldset
    title="Nombre del cliente"
    name="order[client][name]"
    bind:input={$order.client.name}
    placeholder="Nombre del cliente"
    datalist="clients"
    onChange={(e) => {
      const client = clients.find((client) => client.name === e.target.value);
      if (client) $order.client = JSON.parse(JSON.stringify(client));
      else $order.client._id = undefined;
      order.set($order);
    }}
  />
  <Fieldset
    title="Numero de celular"
    name="order[client][phone]"
    bind:input={$order.client.phone}
    placeholder="Numero de celular"
  />
  <Fieldset
    title="Direccion"
    name="order[client][direction]"
    bind:input={$order.client.direction}
    placeholder="Direccion"
  />
  <section id="print" class="grid gap">
    <h5>Resumen de venta</h5>
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
        {#each $order.cartProducts as cartProduct, i}
          <tr>
            <td>{cartProduct.options.quantity}</td>
            <td>{cartProduct.showName}</td>
            <td>S./ {cartProduct.unitPrice}</td>
            <td>S./ {cartProduct.total}</td>
          </tr>
        {/each}
        <tr>
          <td colspan="3" style="font-weight: 600;">Total</td>
          <td style="font-weight: 600;">S./ {$order.total}</td>
        </tr>
      </tbody>
    </table>
  </section>
  <div class="grid auto-fit gap" style="--size: 150px">
    <button
      type="button"
      class="inverted"
      on:click={(e) => window.print()}
      style="--color: black">Imprimir</button
    >
    <button type="submit" class="inverted" style="--color: red">Pagar</button>
  </div>
</form>

<datalist id="clients">
  {#each clients as client}
    <option value={client.name} />
  {/each}
</datalist>
