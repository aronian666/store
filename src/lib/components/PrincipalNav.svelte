<script>
  import { page } from "$app/stores";
  import ActiveRecord from "$lib/models/ActiveRecord";

  const menu = [
    { href: "/", class: "fas fa-home", text: "Inicio" },
    { href: "/products", class: "far fa-list-alt", text: "Productos" },
    { href: "/sales", class: "fas fa-money-check-alt", text: "Vender" },
    {
      href: "/orders",
      class: "far fa-chart-bar",
      text: "Reporte de ventas",
    },
    { href: "/groups", class: "fas fa-object-group", text: "Grupos" },
    {
      href: "/cart",
      class: "fas fa-shopping-cart",
      text: "Carrito de venta",
    },
    { href: "/cuts", class: "fas fa-cut", text: "Cortar" },
    { href: "/profile", class: "fas fa-users", text: "Usuarios" },
  ];
  let show = false;
</script>

<header class:show>
  <nav class="flex column gap">
    <div class="flex column gap">
      <picture>
        <img src="/logo.png" alt="logo" />
      </picture>
      <div>
        {#each menu as item, i}
          <a
            sveltekit:prefetch
            href={item.href}
            class:active={$page.url.pathname === item.href}
          >
            <i class={item.class} /><span>{item.text}</span>
          </a>
        {/each}
      </div>
    </div>
    <a href="/" on:click={(e) => ActiveRecord.get("/log_out")}>
      <i class="fas fa-sign-out-alt" /><span>Salir</span>
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
    border-right: 5px solid var(--blue, blue);
    color: var(--blue, blue);
    font-weight: 700;
  }
  nav {
    min-height: 100vh;
    box-shadow: 0 0 1rem gray;
    width: 5.5rem;
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
    color: var(--blue);
    background-color: #fafafa;
  }
  a i {
    display: grid;
    place-content: center;
    font-size: 1.75rem;
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
    max-width: 150px;
  }
  picture {
    display: grid;
    place-content: center;
  }
</style>
