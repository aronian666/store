<script context="module">
  export async function load({ session }) {
    if (!session.current_user) return { status: 303, redirect: "/login" };
    return { props: null };
  }
</script>

<script>
  import { page } from "$app/stores";
  import Nav from "$lib/components/Nav.svelte";
  $: active = (item, index) => item.href === $page.url.pathname;
  const items = [
    { href: "/groups", name: "Grupos" },
    { href: "/groups/new", name: "Crear nuevo grupo" },
  ];
</script>

<div class="grid" style="gap: 2rem">
  <Nav {items} {active} />
  <slot />
</div>
