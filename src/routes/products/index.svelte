<script context="module">
  export async function load({ session, fetch }) {
    if (!session.current_user) return { status: 303, redirect: "/login" };
    const respose = await fetch("/products.json");
    const products = await respose.json();
    return {
      props: { products },
    };
  }
</script>

<script>
  import Filter from "$lib/components/Filter.svelte";
  import Search from "$lib/components/Search.svelte";
  import Product from "$lib/models/Product";
  import Pagination from "$lib/components/Pagination.svelte";

  export let products = [];
  products = products.map((product) => new Product(product));
  let filtered = [];
  let searched = [];
  let paginate = [];
</script>

<svelte:head>
  <title>Productos</title>
</svelte:head>
<Filter
  items={products}
  bind:filtered
  filter={[
    { name: "Categoria", property: "categoryName" },
    { name: "Precio", property: "sellPrice", range: true },
    { name: "Cantidad", property: "quantity", range: true },
  ]}
>
  <Search items={filtered} bind:searched />
  <button on:click={(e) => Product.export(searched)}>Exportar</button>
</Filter>
<table>
  <thead>
    <tr>
      <th>Producto</th>
      <th>Cantidad</th>
      <th>Precio</th>
      <th>Detalles</th>
    </tr>
  </thead>
  <tbody>
    {#each paginate as product (product._id)}
      <tr>
        <td>{product.name}</td>
        <td>{product.quantity}</td>
        <td>S./ {product.sellPrice}</td>
        <td>
          <a href={`/products/${product._id}`}>Detalles</a>
        </td>
      </tr>
    {/each}
    <tr>
      <td />
    </tr>
  </tbody>
</table>

<Pagination items={searched} bind:paginate />
