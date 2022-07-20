<script>
  import Contract from "$lib/models/Contract";

  import Checkboxes from "./Checkboxes.svelte";

  export let statuses;
</script>

<h3>Estados</h3>
<Checkboxes
  items={Contract.statuses.map((s) => s.name)}
  bind:group={statuses}
  colors={Contract.statuses.map((s) => s.color)}
/>
