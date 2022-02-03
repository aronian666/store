<script context="module">
  export async function load({ params, fetch }) {
    const respose = await fetch("/groups/new.json");
    const products = await respose.json();
    const response2 = await fetch(`/groups/${params.id}.json`);
    const group = await response2.json();
    return {
      props: { products, group },
    };
  }
</script>

<script>
  import HandleGroup from "$lib/components/HandleGroup.svelte";
  import Group from "$lib/models/Group";
  export let products = [];
  export let group;
  group = new Group(group);
</script>

<svelte:head>
  <title>Grupo {group.name}</title>
</svelte:head>
<HandleGroup {products} {group} />
