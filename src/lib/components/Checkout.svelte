<script>
  import { goto } from "$app/navigation";

  import ActiveRecord from "$lib/models/ActiveRecord";
  import Client from "$lib/models/Client";
  import Quote from "$lib/models/Quote";

  import { getContext, onMount } from "svelte";
  import Fieldset from "./Fieldset.svelte";
  import Modal from "./Modal.svelte";
  import Print from "./Print.svelte";
  let order = getContext("order");
  let loading = getContext("loading");
  let handler = getContext("handler");
  let clients = [];
  let print = false;
  const submitOrder = async (e) => {
    loading.set(true);
    const { data, error } = await ActiveRecord.send(e.target, {
      order: $order,
    });
    if (error) return handler();
    $order.cartProducts = [];
    $order.client = new Client({});
    order.set($order);
    goto(`/orders/${data._id}`);
  };
  const submitQuote = async (e) => {
    loading.set(true);
    const quote = await Quote.create($order);
    $order.cartProducts = [];
    $order.client = new Client({});
    order.set($order);
    goto(`/contracts/quotes?quote=${quote._id}`);
  };
  onMount(async () => {
    const { data, error } = await ActiveRecord.get("/clients.json");
    clients = data;
  });
</script>

<form action="/orders/new.json" method="post">
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
  <section class="grid gap">
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
            <td>S./ {cartProduct.finalUnitPrice}</td>
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
  <div class="grid auto-fit gap" style="--size: 100px">
    <button
      type="button"
      class="holed"
      on:click={(e) => (print = true)}
      style="--color: black">Imprimir</button
    >
    <button
      type="button"
      on:click={submitQuote}
      name="quote"
      class="holed"
      style="--color: deepskyblue">Cotizar</button
    >
    <button
      type="button"
      on:click={(e) =>
        submitOrder({ target: { action: "/orders/new.json", method: "post" } })}
      name="order"
      class="holed"
      style="--color: tomato">Pagar</button
    >
  </div>
</form>
{#if print}
  <Modal handler={(e) => (print = false)}>
    <Print order={$order} all={false} />
  </Modal>
{/if}

<datalist id="clients">
  {#each clients as client}
    <option value={client.name} />
  {/each}
</datalist>
