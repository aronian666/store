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
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  let user = {
    name: "",
    email: "",
    password: "",
    repeat_password: "",
  };
  onMount(() => {
    const input = document.getElementById("user[repeat_password]");
    function validateField() {
      if (this.value !== user.password)
        return this.setCustomValidity("Las contraseñas deben de ser iguales.");
      this.setCustomValidity("");
    }
    input.oninput = validateField;
  });
  $: error = $page.url.searchParams.get("error");
</script>

<svelte:head><title>Registrate</title></svelte:head>
<div class="center">
  <div class="panel grid" style="padding: 2rem;">
    <h1>Registrate</h1>
    <form action="/sign_up.json" method="post">
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
      {#if error}
        <p class="error">{error}</p>
      {/if}
      <button class="inverted" style="--color: black" type="submit"
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
    background-image: url("/logo.svg");
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
  }
  h1 {
    text-align: center;
  }
</style>
