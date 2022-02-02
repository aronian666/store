<script context="module">
  export async function load({ fetch }) {
    const response = await fetch("/groups.json");
    const groups = await response.json();
    return { props: { groups } };
  }
</script>

<script>
  import Group from "$lib/models/Group";
  export let groups = [];
  groups = groups.map((group) => new Group(group));
</script>

<div class="flex gap wrap">
  {#each groups as group (group._id)}
    <div class="grid panel">
      <h3>{group.name}</h3>
      <p>Productos: {group.combinations.length}</p>
      <a
        class="button inverted"
        style="--color: blue"
        sveltekit:prefetch
        href={`/groups/${group._id}`}>Editar</a
      >
    </div>
  {/each}
</div>
