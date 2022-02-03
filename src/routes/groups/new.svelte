<script context="module">
  export async function load({ session, fetch }) {
    if (!session.current_user) return { status: 303, redirect: "/login" };
    const respose = await fetch("/groups/new.json");
    const products = await respose.json();
    return {
      props: { products },
    };
  }
</script>

<script>
  import HandleGroup from "$lib/components/HandleGroup.svelte";
  export let products = [];
</script>

<svelte:head>
  <title>Crear nuevo grupo</title>
</svelte:head>
<HandleGroup {products} />
