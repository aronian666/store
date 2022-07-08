<script context="module">
  import User from "$lib/models/User";
  export async function load({ session, url }) {
    if (!session.current_user) return { props: null };
    const current_user = new User(session.current_user);
    const path = url.pathname.split("/")[1];
    if (current_user.can(path)) return { props: null };
    return { status: 303, redirect: "/" };
  }
</script>

<script>
  import PrincipalNav from "$lib/components/PrincipalNav.svelte";
  import Order from "$lib/models/Order";
  import { onMount, setContext } from "svelte";
  import { writable } from "svelte/store";
  import { session, navigating } from "$app/stores";
  import Loading from "$lib/components/Loading.svelte";
  import ActiveRecord from "$lib/models/ActiveRecord";

  let current_user = $session.current_user
    ? new User($session.current_user)
    : null;
  setContext("current_user", current_user);
  let order = writable(new Order({ employee: $session.current_user }));
  let codes = writable([]);
  setContext("codes", codes);
  onMount(async () => {
    const local = localStorage.getItem("cartProducts");
    if (local && local !== "undefined" && local !== "null") {
      $order.setProducts(JSON.parse(local));
      order.set($order);
    }
    order.subscribe((value) => {
      localStorage.setItem("cartProducts", JSON.stringify(value.cartProducts));
    });
    const { data } = await ActiveRecord.get("/users.json");
    codes.set(data.map((user) => user.code).filter((code) => code));
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
