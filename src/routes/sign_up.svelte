<script context="module">
  export async function load({ session }) {
    if (session.current_user) {
      return { status: 303, redirect: "/" };
    }
    return { status: 200 };
  }
</script>

<script>
  import Fieldset from "$lib/components/Fieldset.svelte";
  import ActiveRecord from "$lib/models/ActiveRecord";
  import { onMount } from "svelte";
  let user = {
    name: "",
    email: "",
    password: "",
    repeat_password: "",
  };
  let errors = "";
  onMount(() => {
    const input = document.getElementById("user[repeat_password]");
    function validateField() {
      if (this.value !== user.password)
        return this.setCustomValidity("Las contraseñas deben de ser iguales.");
      this.setCustomValidity("");
    }
    input.oninput = validateField;
  });
  const submit = async (e) => {
    const { error, data } = await ActiveRecord.send(e.target, { user });
    return (errors = data.error);
  };
</script>

<svelte:head><title>Registrate</title></svelte:head>
<div class="center">
  <div class="panel">
    <h1>Registrate</h1>
    <form action="/sign_up" method="post" on:submit|preventDefault={submit}>
      <Fieldset
        title="Nombre"
        bind:input={user.name}
        name="user[name]"
        placeholder="Nombre del usuario"
        type="text"
        required
        info="Este nombre se registrara en las ventas que realize."
      />
      <Fieldset
        title="Correo electrónico"
        bind:input={user.email}
        name="user[email]"
        placeholder="Correo del usuario"
        type="email"
        required
      />
      <Fieldset
        title="Contreseña"
        name="user[password]"
        bind:input={user.password}
        type="password"
        required
        minlength="6"
        info="La contraseña debe de tener al menos 6 letras."
      />
      <Fieldset
        title="Confirme contreseña"
        name="user[repeat_password]"
        bind:input={user.repeat_password}
        type="password"
        required
        minlength="6"
        info="Las contraseñas deben de coincidir."
      />
      <p class="error">{errors}</p>
      <button class="inverted" style="--color: var(--purple)" type="submit"
        >Registrarse</button
      >
    </form>
    <p>¿Ya tienes una cuenta? <a href="/login">Inicia sesión</a></p>
  </div>
</div>

<style>
  .center {
    display: grid;
    place-content: center;
    height: 100vh;
  }
  .panel {
    display: grid;
    gap: 1rem;
  }
  h1 {
    text-align: center;
  }
</style>
