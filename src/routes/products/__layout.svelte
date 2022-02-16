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
      href: "/products",
      name: "Resumen",
    },
    {
      href: "/products/all",
      name: "Todos los productos",
    },
    {
      href: "/products/new",
      name: "Crear producto",
    },
    { href: "/products/add", name: "Agregar excel" },
  ];
</script>

<div class="grid" style="gap: 2rem">
  <Nav items={pages} />
  <slot />
</div>
