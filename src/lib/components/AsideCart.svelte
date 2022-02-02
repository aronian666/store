<script>
  import { getContext } from "svelte";

  let order = getContext("order");
  let active = true;
</script>

<aside class:active class="flex column gap">
  <button on:click={(e) => (active = !active)}
    ><i class="fas fa-shopping-cart" />
  </button>
  <div class="content grid" style="gap: 1rem">
    <h3>
      {$order.cartProducts.length} productos
      <span style="color: red">S./ {$order.total}</span>
    </h3>
    <div class="grid gap">
      {#each $order.cartProducts as cartProduct, i}
        <section class="panel grid" style="gap: .25rem; position: relative;">
          <h5>{cartProduct.product.name}</h5>
          <p style="color: deeppink">S./ {cartProduct.total}</p>

          <div
            class="round"
            style="--color:red; right: 0; cursor: pointer"
            on:click={(e) => {
              if (!confirm("Esta seguro que desea eliminar?")) return;
              $order.cartProducts.splice(i, 1);
              order.set($order);
            }}
          >
            X
          </div>
          <div class="round" style="left: 0; ">
            {cartProduct.options.quantity}
          </div>
        </section>
      {/each}
    </div>
    <a href="/cart" class="button inverted" style="--color: red">Pagar</a>
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
  .round {
    position: absolute;
    background-color: var(--color, orange);
    color: white;
    width: 1.5rem;
    aspect-ratio: 1/1;
    border-radius: 50%;
    display: grid;
    place-content: center;

    top: -0.8rem;
    font-size: 0.75rem;
  }
</style>
