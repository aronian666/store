<script context="module">
  export async function load({ fetch }) {
    const response = await fetch("/products/new.json");
    const data = await response.json();
    return { props: data };
  }
</script>

<script>
  import HandleProduct from "$lib/components/HandleProduct.svelte";
  import Product from "$lib/models/Product";
  export let categories = [];
  export let units = [];
  export let product = new Product({});
</script>

<svelte:head>
  <title>Crear nuevo producto</title>
</svelte:head>
<HandleProduct {product} {categories} {units} />
