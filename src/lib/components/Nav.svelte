<script>
  export let items = [];
  export let active;
  import { page } from "$app/stores";
  $: active = (item, index) => $page.url.pathname === item.href;
</script>

<nav>
  {#each items as item, i}
    <a
      sveltekit:prefetch
      class:active={active && active(item, i)}
      href={item.href}>{item.name}</a
    >
  {/each}
</nav>

<style>
  nav {
    display: flex;
    box-shadow: 0 0 1px black;
    border-radius: 0.25rem;
  }
  a:first-child {
    border-radius: 0.25rem 0 0 0.25rem;
  }
  a {
    padding: 1rem;
    transition: 0.3s;
    box-shadow: 1px 0 0 0 rgba(128, 128, 128, 0.432);
  }
  a.active {
    background-color: deepskyblue;
    box-shadow: 0 0 0 1px deepskyblue;
    color: white;
    position: relative;
  }
  a.active::after {
    position: absolute;
    content: " ";
    top: 100%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%) rotate(45deg);
    width: 1rem;
    aspect-ratio: 1/1;
    background-color: deepskyblue;
  }
</style>
