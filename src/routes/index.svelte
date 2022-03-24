<script context="module">
  export async function load({ session, fetch }) {
    if (!session.current_user) return { status: 303, redirect: "/login" };
    return { props: null };
  }
</script>

<script>
  import Products from "$lib/components/Products.svelte";
  import Summary from "$lib/components/Summary.svelte";
  import { getContext } from "svelte";
  const current_user = getContext("current_user");
</script>

<h1>Hola {current_user.name}</h1>
{#if current_user.role === 3}
  <Products />
{/if}
{#if [0, 1].includes(current_user.role)}
  <Summary />
{/if}
