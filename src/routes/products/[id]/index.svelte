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
  import { goto } from "$app/navigation";
  import CartProduct from "$lib/models/CartProduct";
  import PaginateTable from "$lib/components/PaginateTable.svelte";
  import AddStock from "$lib/components/AddStock.svelte";
  import Buy from "$lib/models/Buy";

  export let product;
  let cartProducts = [];
  let buys = [];
  let index;
  let addStockIndex;
  onMount(async () => {
    const { data } = await ActiveRecord.get(
      `/products/${product._id}/cartProducts.json`
    );
    cartProducts = data.map((item) => new CartProduct(item));
    const response = await ActiveRecord.get(
      `/products/${product._id}/buys.json`
    );
    buys = response.data.map((item) => new Buy(item));
  });
  $: totalGain = cartProducts.reduce((a, b) => a + b.gain, 0);
  $: totalQuantity = cartProducts.reduce((a, b) => a + b.options.quantity, 0);
  $: totalInvestment = buys.reduce((a, b) => a + b.investment, 0);
  $: totalBuyQuantity = buys.reduce((a, b) => a + b.quantity, 0);
  const deleteProduct = async (e) => {
    if (!confirm("Estas seguro de querer eliminar este producto?")) return;
    const { error } = await ActiveRecord.send(
      { action: "/products.json?_method=DELETE", method: "post" },
      { product: { _id: product._id } }
    );
    if (!error) return goto("/products");
    alert("Ha ocurrido un error mientras se trataba de eliminar.");
  };
</script>

<svelte:head>
  <title>{product.name}</title>
</svelte:head>
<div class="grid" style="gap:1rem" in:fade>
  <section class="panel grid">
    <div class="flex space-between">
      <h3>Detalles generales</h3>
      <div class="flex gap">
        <a
          href={`/products/${product._id}/edit`}
          class="button inverted"
          style="--color: orange">Editar</a
        >
        <button class="inverted" style="--color:red" on:click={deleteProduct}>
          Eliminar</button
        >
      </div>
    </div>
    <div class="flex" style="gap: 1rem">
      <div class="panel grid" style="--color: deepskyblue">
        <h4>Nombre del producto</h4>
        <p>{product.name}</p>
      </div>
      <div class="panel grid" style="--color: deepskyblue">
        <h4>Categoria</h4>
        <p>{product.category.name}</p>
      </div>
    </div>
  </section>
  <section class="panel grid">
    <h3>Detalles de venta</h3>
    <div class="flex gap wrap">
      {#each product.unitProducts as unitProduct, i}
        <div class="panel grid" style="--color: tomato">
          <h4>{unitProduct.unit.name}</h4>
          <div class="flex gap wrap" style="--color: violet">
            <div class="panel grid">
              <h5>Cantidad</h5>
              <p>{unitProduct.quantity}</p>
            </div>
            <div class="panel grid">
              <h5>Precio de compra</h5>
              <p>S./ {unitProduct.buyPrice}</p>
            </div>
            <div class="panel grid">
              <h5>Precio de venta</h5>
              <p>S./ {unitProduct.sellPrice}</p>
            </div>
            <div class="panel grid">
              <h5>Precio Juliaca</h5>
              <p>S./ {unitProduct.otherPrice}</p>
            </div>
          </div>
          <button
            class="inverted"
            style="--color: deeppink"
            on:click={(e) => (index = i)}>Modificar</button
          >
          <button on:click={(e) => (addStockIndex = i)}>
            Agregar {unitProduct.unit.name}(s)
          </button>
        </div>
      {/each}
    </div>
  </section>
  <div class="flex wrap gap">
    <section class="panel flex column" style="flex: 1 1 auto">
      <h3>Vendidos</h3>
      <div class="flex gap" style="--color: limegreen">
        <div class="panel grid">
          <h4>Unidades vendidas</h4>
          <p>{totalQuantity}</p>
        </div>
        <div class="panel grid">
          <h4>Ganancia total</h4>
          <p>S/. {totalGain}</p>
        </div>
      </div>
      <div class="panel">
        <PaginateTable
          let:item
          items={cartProducts}
          header={[
            "Cantidad",
            "Unidad",
            "Precio de venta",
            "Total",
            "Ganancia",
            "Venta",
          ]}
        >
          <tr>
            <td>{item.equivalentQuantity}</td>
            <td>
              {item.unitProduct.unit.name}
            </td>
            <td>S./ {item.options.price}</td>
            <td>S./ {item.total}</td>
            <td>S./ {item.gain}</td>
            <td>
              <a href={`/orders/${item.order}`}>Ver detalles</a>
            </td>
          </tr>
        </PaginateTable>
      </div>
    </section>
    <section class="panel flex column" style="flex: 1 1 auto">
      <h3>Compras</h3>
      <div class="flex gap" style="--color: tomato">
        <div class="panel grid">
          <h4>Unidades compradas</h4>
          <p>{totalBuyQuantity}</p>
        </div>
        <div class="panel grid">
          <h4>Inversion Total</h4>
          <p>S/. {totalInvestment}</p>
        </div>
      </div>
      <div class="panel">
        <PaginateTable
          let:item
          items={buys}
          header={["Cantidad", "Precio de compra", "Proveedor"]}
        >
          <tr>
            <td>{item.quantity}</td>
            <td>S./ {item.buyPrice}</td>
            <td>{item.provider.name}</td>
          </tr>
        </PaginateTable>
      </div>
    </section>
  </div>
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

{#if addStockIndex != null}
  <Modal handler={(e) => (addStockIndex = null)} let:handler>
    <AddStock unitProduct={product.unitProducts[addStockIndex]} {product} />
  </Modal>
{/if}
