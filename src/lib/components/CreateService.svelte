<script>
  import Service from "$lib/models/Service";
  import { getContext } from "svelte";
  import Fieldset from "./Fieldset.svelte";

  let service = new Service({});

  const createService = (e) => {
    const { data, error } = Service.send(e.target, { service });
    if (!error) location.reload();
  };
</script>

<form
  on:submit|preventDefault={createService}
  action="/contracts/services.json"
  method="post"
>
  <Fieldset
    title="Nombre del servicio"
    name="service[name]"
    bind:input={service.name}
  />
  <button class="inverted" style="--color: green">Crear</button>
</form>
