<script context="module">
  export async function load({ fetch }) {
    const response = await fetch("/users.json");
    if (!response.ok) {
      return {
        status: 400,
        error: new Error("No se pudo cargar los usuarios"),
      };
    }
    const users = await response.json();
    return {
      props: users,
    };
  }
</script>

<script>
  import EditUser from "$lib/components/EditUser.svelte";

  import Modal from "$lib/components/Modal.svelte";
  import User from "$lib/models/User";
  import { getContext } from "svelte";
  const current_user = getContext("current_user");
  export let users = [];
  users = users.map((user) => new User(user));
  let u;
</script>

<h2>Hola {current_user.name}</h2>
<div class="flex gap">
  <div class="panel">
    <h4>Rol</h4>
    <p>{current_user.roleString}</p>
  </div>
  <div class="panel">
    <h4>Correo electronico</h4>
    <p>{current_user.email}</p>
  </div>
</div>
<button on:click={(e) => (u = current_user)}>Editar mi usuario</button>

<table>
  <thead>
    <tr>
      <th>Nombre</th>
      <th>Correo</th>
      <th>Rol</th>
      <th>Acciones</th>
    </tr>
  </thead>
  <tbody>
    {#each users as user, i}
      <tr>
        <td>{user.name}</td>
        <td>{user.email}</td>
        <td>{user.roleString}</td>
        <td>
          <button disabled={current_user.role != 0} on:click={(e) => (u = user)}
            >Editar</button
          >
        </td>
      </tr>
    {/each}
  </tbody>
</table>

{#if u}
  <Modal handler={(e) => (u = null)} let:handler>
    <EditUser user={u} />
  </Modal>
{/if}
