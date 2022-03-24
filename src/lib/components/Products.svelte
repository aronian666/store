<script>
  import { onMount } from "svelte";
  import Filter from "$lib/components/Filter.svelte";
  import Pagination from "$lib/components/Pagination.svelte";
  import Search from "$lib/components/Search.svelte";
  import Product from "$lib/models/Product";
  import Loading from "$lib/components/Loading.svelte";
  let products = [];
  onMount(async () => {
    const response = await fetch("/products.json");
    const p = await response.json();
    products = p.map((product) => new Product(product));
  });
  let searched = [];
  let filtered = [];
  let paginate = [];
</script>

{#if products.length > 0}
  <section class="grid gap">
    <div class="flex space-between">
      <Filter
        items={products}
        bind:filtered
        filter={[
          { name: "Categoria", property: "categoryName" },
          { name: "Precio", property: "sellPrice", range: true },
          { name: "Cantidad", property: "quantity", range: true },
        ]}
      />
      <Search
        items={filtered}
        bind:searched
        style="--color: red"
        properties={["name", "stringCode", "categoryName"]}
      />
    </div>
    <div class="grid auto-fill gap">
      {#each paginate as product (product._id)}
        <div class="panel flex column space-between">
          <h5>{product.name}</h5>
          <p>S./ {product.sellPrice}</p>
        </div>
      {/each}
    </div>
    <Pagination count={16} items={searched} bind:paginate />
  </section>
{:else}
  <div class="grid place-content">
    <Loading />
  </div>
{/if}
