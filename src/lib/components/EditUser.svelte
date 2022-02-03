<script>
  import User from "$lib/models/User";
  import { getContext } from "svelte";
  import Fieldset from "./Fieldset.svelte";
  import FieldsetSelect from "./FieldsetSelect.svelte";

  export let user = new User({});
  let loading = getContext("loading");
  const current_user = getContext("current_user");
  const updateUser = async (e) => {
    $loading = true;
    const response = await User.send(e.target, { user });
    location.reload();
  };
</script>

<form action="/users.json" method="post" on:submit|preventDefault={updateUser}>
  <Fieldset title="Nombre" required bind:input={user.name} />
  {#if current_user._id === user._id}
    <Fieldset title="Codigo" bind:input={user.code} />
  {/if}
  {#if current_user.role === 0}
    <FieldsetSelect
      title="Rol"
      bind:input={user.role}
      items={User.getRoles()}
      let:item
    >
      <option slot="option" value={item.role}>{item.name}</option>
    </FieldsetSelect>
  {/if}

  <button> Actualizar </button>
</form>
