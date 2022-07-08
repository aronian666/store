<script context="module">
  export async function load({ session }) {
    if (!session.current_user) return { status: 303, redirect: "/login" };
    return { props: null };
  }
</script>

<script>
  import Nav from "$lib/components/Nav.svelte";
  $: pages = [
    {
      href: "/contracts",
      name: "Resumen",
    },
    { href: "/contracts/services", name: "Servicios" },
  ];
</script>

<div class="grid">
  <Nav items={pages} />
  <slot />
</div>
