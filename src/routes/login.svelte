<script context="module">
  export async function load({ session }) {
    if (session.current_user) return { status: 303, redirect: "/" };
    return { props: null };
  }
</script>

<script>
  import Fieldset from "$lib/components/Fieldset.svelte";
  import { page } from "$app/stores";

  let user = {
    email: "",
    password: "",
  };
  $: error = $page.url.searchParams.get("error");
</script>

<div class="center">
  <div class="panel grid" style="padding: 2rem;">
    <h1>Iniciar Sesión</h1>
    <form action="/login.json" method="post">
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
      {#if error}
        <p class="error">{error}</p>
      {/if}
      <button type="submit" class="inverted" style="--color: black">
        Iniciar sesión
      </button>
    </form>
    <p>¿Aún no tienes una cuenta? <a href="/sign_up">Registrate</a></p>
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
