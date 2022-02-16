<script>
  import { getContext } from "svelte";
  import Icon from "./Icon.svelte";

  let order = getContext("order");
  let active = true;
  export let product;
  export let group;
  export let cartProduct;
  export let index;
  const handleEdit = (cP, i) => {
    if (cP.group) {
      group = cP.group;
      product = null;
    } else {
      product = cP.product;
      group = null;
    }
    index = i;
    cartProduct = cP;
  };
</script>

<aside class:active class="flex column gap">
  <button on:click={(e) => (active = !active)}
    ><Icon icon="shopping_cart" />
  </button>
  <div class="content grid gap">
    <h4>
      <div>{$order.cartProducts.length} productos</div>
      <span style="color: red">S./ {$order.total}</span>
    </h4>
    <div class="grid" style="gap: 0.5rem">
      {#each $order.cartProducts as cartProduct, i}
        <section class="grid" style="gap: .25rem; position: relative;">
          <h5>{cartProduct.showName}</h5>
          <div class="details">
            <span class="b-500">Cantidad</span>
            <p>{cartProduct.options.quantity}</p>
            <span class="b-500">P.U.</span>
            <p style="color: DodgerBlue" class="b-500">
              S./ {cartProduct.finalUnitPrice}
            </p>
            <span class="b-500">Total</span>
            <p style="color: red" class="b-500">S./ {cartProduct.total}</p>
            <button
              on:click={(e) => {
                if (!confirm("¿Esta seguro de querer eliminar este producto?"))
                  return;
                $order.cartProducts.splice(i, 1);
                order.set($order);
              }}
              class="inverted"
              style="--color: red">Eliminar</button
            >
            <button
              class="inverted"
              on:click={(e) => handleEdit(cartProduct, i)}
              style="--color: orange">Editar</button
            >
          </div>
        </section>
      {/each}
    </div>
    <a href="/cart" class="button inverted" style="--color: black">Pagar</a>
  </div>
</aside>

<style>
  aside {
    position: fixed;
    padding: 1rem;
    right: 0;
    top: 0;
    width: 300px;
    background-color: white;
    height: 100vh;
    transition: 0.3s;
    z-index: 2;
    border-left: 1px solid orange;
  }
  .content {
    overflow-y: auto;
    overflow-x: hidden;
  }
  .active {
    right: -300px;
  }
  aside > button {
    position: absolute;
    left: -5rem;
    font-size: 2rem;
    color: red;
  }
  section {
    border-bottom: 1px solid black;
    padding-bottom: 0.5rem;
  }
  .details {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 0.5rem;
    row-gap: 0.25rem;
  }
  .details > * {
    font-size: 0.7rem;
  }
  h4 {
    border-bottom: 1px solid black;
    padding-bottom: 0.5rem;
  }
</style>
