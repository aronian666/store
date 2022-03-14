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
  import Icon from "$lib/components/Icon.svelte";
  import Table from "$lib/components/Table.svelte";
  import Switch from "$lib/components/Switch.svelte";
  export let products = [];
  products = products.map((product) => new Product(product));
  const product = products.find((product) => product.unitProducts.length === 0);
  console.log(product);
  let filtered = [];
  let searched = [];
  const updateProduct = async (product) => {
    const { data, error } = await Product.send(
      { action: "/products.json?_method=PUT", method: "post" },
      { product }
    );
  };
</script>

<svelte:head>
  <title>Productos</title>
</svelte:head>
<div class="panel">
  <div class="flex space-between">
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
    </Filter>
    <button
      on:click={(e) => Product.export(searched)}
      class="inverted"
      style="--color: blueviolet"
    >
      <Icon icon="download" />
      Descargar
    </button>
  </div>

  <Table
    let:item
    items={searched}
    properties={[
      { name: "Producto", property: "name" },
      { name: "Cantidad", property: "quantity" },
      { name: "Precio de venta", property: "sellPrice" },
      { name: "Reponer", property: "replenish" },
      { name: "Detalles", property: "details" },
    ]}
  >
    <tr slot="tr">
      <td>{item.name}</td>
      <td>{item.quantity}</td>
      <td>S./ {item.sellPrice}</td>
      <td>
        <Switch
          input={item.replenish}
          onChange={(value) => {
            item.replenish = value;
            updateProduct(item);
          }}
        />
      </td>
      <td>
        <a href={`/products/${item._id}`}>Detalles</a>
      </td>
    </tr>
  </Table>
</div>
