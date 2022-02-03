<script context="module">
  export async function load({ fetch, params }) {
    const response = await fetch("/products/new.json");
    const response2 = await fetch(`/products/${params.id}.json`);
    const data = await response.json();
    const product = await response2.json();
    //product.category = product.category._id;
    return { props: { ...data, product } };
  }
</script>

<script>
  import HandleProduct from "$lib/components/HandleProduct.svelte";
  import Product from "$lib/models/Product";
  export let categories = [];
  export let units = [];
  export let product;
  product = new Product(product);
  product.category = product.category._id;
</script>

<svelte:head>
  <title>Editar {product.name}</title>
</svelte:head>
<HandleProduct {product} {categories} {units} />
