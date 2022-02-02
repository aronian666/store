<script context="module">
  export async function load({ session }) {
    if (!session.current_user) return { status: 303, redirect: "/login" };
    return { props: null };
  }
</script>

<script>
  import Nav from "$lib/components/Nav.svelte";
  const items = [{ href: "/orders", name: "Ventas" }];
</script>

<div class="grid" style="gap: 2rem">
  <Nav {items} />
  <slot />
</div>
