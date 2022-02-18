<script>
  import { searchIndividual } from "$lib/scripts/search";
  import Fieldset from "./Fieldset.svelte";

  export let items;
  export let searched = [];
  export let properties;
  let search = "";

  $: {
    searched = searchIndividual(items, search.split(" "), properties);
  }
</script>

<Fieldset
  {...$$restProps}
  title="Buscar"
  placeholder="Buscar..."
  bind:input={search}
  icon="search"
/>
