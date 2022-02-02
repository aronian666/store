<script context="module">
  export async function load({ fetch, params }) {
    const { id } = params;
    const response = await fetch(`/products/${id}.json`);
    if (response.ok) return { props: { product: await response.json() } };
    return { status: 404 };
  }
</script>

<script>
  import Modal from "$lib/components/Modal.svelte";
  import UpdateUnit from "$lib/components/UpdateUnit.svelte";
  import ActiveRecord from "$lib/models/ActiveRecord";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";

  export let product;
  let sales = [];
  let index;
  onMount(async () => {
    const { data } = await ActiveRecord.get(
      `/cartProducts.json?product_id=${product._id}`
    );
    sales = data;
  });
</script>

<div class="grid" style="gap:1rem" in:fade>
  <section class="panel grid" style="--color: blueviolet">
    <h2>Detalles generales</h2>
    <div class="flex" style="gap: 1rem">
      <div class="panel grid" style="--color: deepskyblue">
        <h3>Nombre del producto</h3>
        <p>{product.name}</p>
      </div>
      <div class="panel grid" style="--color: DeepPink">
        <h3>Categoria</h3>
        <p>{product.category.name}</p>
      </div>
    </div>
  </section>
  <section class="panel grid" style="--color: LightSeaGreen">
    <h2>Detalles de venta</h2>
    <div class="flex gap wrap">
      {#each product.unitProducts as unitProduct, i}
        <div class="panel grid" style="--color: Maroon">
          <h3>{unitProduct.unit.name}</h3>
          <div class="flex gap wrap" style="--color: MidnightBlue">
            <div class="panel grid">
              <h4>Cantidad</h4>
              <p>{unitProduct.quantity}</p>
            </div>
            <div class="panel grid">
              <h4>Precio de compra</h4>
              <p>S./ {unitProduct.buyPrice}</p>
            </div>
            <div class="panel grid">
              <h4>Precio de venta</h4>
              <p>S./ {unitProduct.sellPrice}</p>
            </div>
            <div class="panel grid">
              <h4>Precio Juliaca</h4>
              <p>S./ {unitProduct.otherPrice}</p>
            </div>
          </div>
          <button
            class="inverted"
            style="--color: LimeGreen"
            on:click={(e) => (index = i)}>Modificar</button
          >
        </div>
      {/each}
    </div>
  </section>
</div>

{#if index != null}
  <Modal handler={(e) => (index = null)}>
    <UpdateUnit
      {index}
      product={JSON.parse(JSON.stringify(product))}
      handler={(newProduct) => {
        product = newProduct;
        index = null;
      }}
    />
  </Modal>
{/if}
