<script>
  import PrincipalNav from "$lib/components/PrincipalNav.svelte";
  import Order from "$lib/models/Order";
  import { onMount, setContext } from "svelte";
  import { writable } from "svelte/store";
  import { session, navigating } from "$app/stores";
  import Loading from "$lib/components/Loading.svelte";
  let order = writable(new Order({ employee: $session.current_user }));
  onMount(() => {
    const local = localStorage.getItem("cartProducts");
    if (local && local !== "undefined" && local !== "null") {
      $order.setProducts(JSON.parse(local));
      order.set($order);
    }
    order.subscribe((value) => {
      localStorage.setItem("cartProducts", JSON.stringify(value.cartProducts));
    });
  });
  setContext("order", order);
  $: loading = $navigating;
</script>

{#if $session.current_user}
  <div class="flex">
    <PrincipalNav />
    <main style="padding: 1rem; width: 100%">
      {#if loading}
        <div class="loading">
          <Loading />
        </div>
      {:else}
        <slot />
      {/if}
    </main>
  </div>
{:else}
  <slot />
{/if}

<style>
  .loading {
    height: 100%;
    display: grid;
    place-content: center;
  }
</style>