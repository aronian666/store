<script context="module">
  export async function load({ session }) {
    if (!session.current_user) return { status: 303, redirect: "/login" };
    return { props: null };
  }
</script>

<script>
  import Checkout from "$lib/components/Checkout.svelte";
  import Fieldset from "$lib/components/Fieldset.svelte";
  import Modal from "$lib/components/Modal.svelte";
  import SaleGroup from "$lib/components/SaleGroup.svelte";
  import { getContext } from "svelte";
  let order = getContext("order");
  let checkout = false;
  let editProduct = {
    index: null,
    cartProduct: null,
  };
</script>

<svelte:head>
  <title>Carrito de venta</title>
</svelte:head>
<div class="grid gap">
  <h1>{$order.cartProducts.length} productos en el carrito</h1>
  <div class="flex wrap" style="gap: 1rem">
    <div style="flex: auto 3 1; gap: 1rem" class="grid">
      {#each $order.cartProducts as cartProduct, i}
        <div class="panel grid">
          <div class="flex space-between">
            <h4>{cartProduct.product.name}</h4>
            <div style="font-weight: 600;">
              S/. {cartProduct.total}
            </div>
          </div>
          <div class="flex wrap gap">
            <Fieldset
              title="Unidad"
              name={`prodict[${i}][unit][name]`}
              input={cartProduct.unitProduct.unit.name}
              readonly
              icon="widgets"
            />
            <Fieldset
              icon="format_align_justify"
              type="number"
              title="Cantidad"
              bind:input={cartProduct.options.quantity}
              name={`pruduct[${i}][quantity]`}
            />
            <Fieldset
              title="Precio por unidad"
              name={`product[${i}][unit][unitPrice]`}
              input={cartProduct.finalUnitPrice}
              readonly
              icon="attach_money"
            />

            {#if cartProduct.unitProduct.unit.measures?.width}
              <Fieldset
                icon="trending_flat"
                title="Largo"
                type="number"
                bind:input={cartProduct.options.measures.width}
                name={`pruduct[${i}][width]`}
                step="0.01"
              />
            {/if}
            {#if cartProduct.unitProduct.unit.measures?.height}
              <Fieldset
                title="Alto"
                icon="height"
                type="number"
                bind:input={cartProduct.options.measures.height}
                name={`pruduct[${i}][height]`}
                step="0.01"
              />
            {/if}
          </div>
          <div class="flex wrap gap">
            <button
              class="holed"
              style="--color: red"
              on:click={(e) => {
                if (!confirm("¿Esta seguro que desea eliminar?")) return;
                $order.cartProducts.splice(i, 1);
                order.set($order);
              }}>Eliminar</button
            >
            {#if cartProduct.group}
              <button
                on:click={(e) => {
                  editProduct = { cartProduct, index: i };
                }}
                class="holed"
                style="--color: orange">Editar</button
              >
            {/if}
          </div>
        </div>
      {/each}
    </div>
    <div style="flex: auto 1 1">
      <div class="grid panel">
        <h5>Total a Pagar</h5>
        <div style="color: tomato; font-size: 1.5rem; font-weight: 600">
          S./ {$order.total}
        </div>
        <button
          class="inverted"
          style="--color: black"
          disabled={$order.cartProducts.length === 0}
          on:click={(e) => (checkout = true)}>Pagar</button
        >
      </div>
    </div>
  </div>
</div>
{#if editProduct.cartProduct}
  <Modal
    handler={(e) => (editProduct = { cartProduct: null, index: null })}
    let:handler
  >
    <SaleGroup
      group={editProduct.cartProduct.group}
      cartProduct={editProduct.cartProduct}
      index={editProduct.index}
      {handler}
    />
  </Modal>
{/if}

{#if checkout}
  <Modal handler={(e) => (checkout = false)}>
    <Checkout />
  </Modal>
{/if}
