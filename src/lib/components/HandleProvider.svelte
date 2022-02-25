<script>
  import ActiveRecord from "$lib/models/ActiveRecord";
  import Fieldset from "./Fieldset.svelte";
  export let provider;
  const handleSubmit = async (e) => {
    const data = await ActiveRecord.send(e.target, { provider });
    if (!data.error) location.reload();
  };
</script>

<form
  action="/providers.json"
  method="post"
  on:submit|preventDefault={handleSubmit}
>
  <h3>{provider._id ? "Actualizar proveedor" : "Crear Proveedor"}</h3>
  <Fieldset title="Nombre" name="provider[name]" bind:input={provider.name} />
  <button> {provider._id ? "Actualizar" : "Crear"} </button>
</form>
