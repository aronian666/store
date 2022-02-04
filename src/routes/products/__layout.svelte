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
      name: "Todos los productos",
      icon: "fab fa-unity",
    },
    {
      href: "/products/new",
      name: "Crear producto",
      icon: "fas fa-file",
    },
    { href: "/products/add", name: "Agregar excel" },
  ];
</script>

<div class="grid" style="gap: 2rem">
  <Nav items={pages} />
  <slot />
</div>
