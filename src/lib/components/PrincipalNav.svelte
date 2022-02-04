<script>
  import { page } from "$app/stores";
  import ActiveRecord from "$lib/models/ActiveRecord";
  import { getContext } from "svelte";
  import Icon from "./Icon.svelte";
  const current_user = getContext("current_user");
  const menu = [
    { href: "/", text: "Inicio", icon: "home" },
    {
      href: "/products",

      text: "Productos",
      icon: "article",
    },
    {
      href: "/sales",

      text: "Vender",
      icon: "work_outline",
    },
    {
      href: "/orders",

      text: "Reporte de ventas",
      icon: "storefront",
    },
    { href: "/groups", icon: "grid_view", text: "Grupos" },
    {
      href: "/cart",
      icon: "shopping_cart",
      text: "Carrito de venta",
    },
    { href: "/users", icon: "person", text: "Usuarios" },
  ].filter((item) =>
    current_user.can(item.href.substring(1, item.href.length))
  );
  let show = false;
</script>

<header class:show>
  <nav class="flex column gap">
    <div class="flex column gap">
      <picture>
        <img src="/logo.svg" alt="logo" />
      </picture>
      <div>
        {#each menu as item, i}
          <a
            sveltekit:prefetch
            href={item.href}
            class:active={$page.url.pathname === item.href}
          >
            <Icon icon={item.icon} />
            <span>{item.text}</span>
          </a>
        {/each}
      </div>
    </div>
    <a href="/log_out.json" rel="external">
      <Icon icon="logout" /><span>Salir</span>
    </a>
  </nav>
</header>

<style>
  .show {
    left: -3rem;
  }
  header {
    position: relative;
  }
  a.active {
    border-right: 5px solid red;
    color: red;
    font-weight: 700;
  }
  nav {
    min-height: 100vh;
    box-shadow: 0 0 1rem gray;
    width: 4rem;
    transition: 0.3s;
    justify-content: space-between;
    position: sticky;
    top: 0;
  }
  nav:hover {
    width: 20rem;
  }
  nav:hover span {
    opacity: 1;
  }
  a {
    display: grid;
    grid-template-columns: 3rem auto;
    align-items: center;
    gap: 1rem;
    padding: 1.25rem;
    color: black;
  }
  a:hover {
    color: red;
    background-color: #fafafa;
  }
  a span {
    font-size: 1.3rem;
    opacity: 0;
    pointer-events: none;
    transition: 0.3s;
    width: max-content;
  }
  img {
    width: 100%;
    max-width: 100px;
  }
  picture {
    display: grid;
    place-content: center;
    padding: 0.25rem;
  }
</style>
