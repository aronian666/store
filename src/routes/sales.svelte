<script context="module">
  export async function load({ session, fetch }) {
    if (!session.current_user) return { status: 303, redirect: "/login" };
    const respose = await fetch("/products.json");
    const products = await respose.json();
    const response2 = await fetch("/groups.json");
    const groups = await response2.json();
    return {
      props: { products, groups },
    };
  }
</script>

<script>
  import AsideCart from "$lib/components/AsideCart.svelte";
  import Filter from "$lib/components/Filter.svelte";
  import Modal from "$lib/components/Modal.svelte";
  import Pagination from "$lib/components/Pagination.svelte";
  import Sale from "$lib/components/Sale.svelte";
  import SaleGroup from "$lib/components/SaleGroup.svelte";
  import Search from "$lib/components/Search.svelte";
  import Group from "$lib/models/Group";
  import Product from "$lib/models/Product";
  import { onMount, setContext } from "svelte";
  import { writable } from "svelte/store";
  export let products = [];
  products = products.map((product) => new Product(product));
  export let groups = [];
  let codes = writable([]);
  setContext("codes", codes);
  groups = groups.map((group) => {
    const product_ids = group.combinations.map(
      (combination) => combination.product
    );
    const groupProducts = products.filter((p) => product_ids.includes(p._id));
    group = new Group(group);
    group.products = groupProducts;
    return group;
  });
  let searched = [];
  let filtered = [];
  let paginate = [];
  let product;
  let group;
  onMount(async () => {
    const { data } = await Group.get("/users.json");
    codes.set(data.users.map((user) => user.code).filter((code) => code));
  });
</script>

<svelte:head>
  <title>Vender</title>
</svelte:head>
<div class="grid" style="gap: 1rem">
  <section class="panel grid">
    <h3>Grupos</h3>
    <div class="grid auto-fill" style="gap: 1.5rem; --size: 200px">
      {#each groups as g}
        <div class="panel grid" style="--size: 1rem">
          <h5>{g.name}</h5>
          <p>{g.combinations.length} productos</p>
          <button on:click={(e) => (group = g)}>Vender</button>
        </div>
      {/each}
    </div>
  </section>
  <section class="panel grid">
    <h3>Productos</h3>
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

    <div class="grid auto-fill" style="gap: 1.5rem; --size: 200px">
      {#each paginate as p (p._id)}
        <div
          class="panel grid"
          style={`--size: 1rem; --color: ${p.quantity > 0 ? "green" : "red"}`}
        >
          <h5>
            {p.name}
          </h5>
          <div class="grid" style="gap: 0.25rem">
            <p class="category">{p.category.name}</p>
            <p class="price">
              <span> S./ </span>
              {p.sellPrice}
            </p>
            <p class={p.quantity > 0 ? "green" : "red"}>
              {p.quantity > 0 ? "Disponible" : "Agotado"}
            </p>
            <button on:click={(e) => (product = p)}>Vender</button>
          </div>
        </div>
      {/each}
    </div>
    <Pagination items={searched} bind:paginate />
  </section>
</div>
<AsideCart />
{#if product}
  <Modal exit={true} handler={(e) => (product = null)}>
    <Sale {product} />
  </Modal>
{/if}
{#if group}
  <Modal exit={true} handler={(e) => (group = null)}>
    <SaleGroup {group} handler={(e) => (group = null)} />
  </Modal>
{/if}

<style>
  p {
    font-size: 0.8rem;
  }
  .green {
    color: green;
  }
  .red {
    color: red;
  }
  p.category {
    color: gray;
    font-size: 0.7rem;
  }
  p.price {
    font-weight: 600;
    position: relative;
  }
  p.price span {
    font-size: 0.5rem;
    position: relative;
    top: -15%;
  }
</style>
