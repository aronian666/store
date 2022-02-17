<script context="module">
  export async function load({ session, fetch }) {
    if (!session.current_user) return { status: 303, redirect: "/login" };
    return { props: null };
  }
</script>

<script>
  import Summary from "$lib/components/Summary.svelte";
  import { getContext } from "svelte";
  const current_user = getContext("current_user");
</script>

<h1>Hola {current_user.name}</h1>
{#if current_user.role !== 2}
  <Summary />
{/if}
