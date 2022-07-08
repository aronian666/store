<script>
  import ActiveRecord from "$lib/models/ActiveRecord";
  import Unit from "$lib/models/Unit";
  import Fieldset from "./Fieldset.svelte";
  import Switch from "./Switch.svelte";
  export let unit = new Unit({});
  const submitUnit = async (e) => {
    const data = await ActiveRecord.send(e.target, { unit });
    if (!data.error) location.reload();
  };
</script>

<form action="/units.json" method="post" on:submit|preventDefault={submitUnit}>
  <Fieldset title="Nombre" name="unit[name]" bind:input={unit.name} />
  <Fieldset
    title="Nombre corto"
    name="unit[shortName]"
    bind:input={unit.shortName}
  />
  <Fieldset
    name="unit[divide]"
    type="number"
    title="Divide"
    bind:input={unit.divide}
  />
  <fieldset>
    <label for="unit[measures][height]"> Alto </label>
    <Switch
      title="Alto"
      name="unit[measures][height]"
      id="unit[measures][height]"
      bind:input={unit.measures.height}
    />
  </fieldset>
  <fieldset>
    <label for="unit[measures][width]"> Largo </label>
    <Switch
      title="Largo"
      name="unit[measures][width]"
      id="unit[measures][width]"
      bind:input={unit.measures.width}
    />
  </fieldset>
  <button type="submit">{unit._id ? "Actualizar" : "Crear"}</button>
</form>
