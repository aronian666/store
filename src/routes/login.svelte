<script context="module">
  export async function load({ session }) {
    if (session.current_user) return { status: 303, redirect: "/" };
    return { props: null };
  }
</script>

<script>
  import Fieldset from "$lib/components/Fieldset.svelte";
  import ActiveRecord from "$lib/models/ActiveRecord";
  let user = {
    email: "",
    password: "",
  };
  let errors;
  const submitForm = async (e) => {
    const { error, data } = await ActiveRecord.send(e.target, { user });
    if (error) return (errors = data.error);
  };
</script>

<div class="center">
  <div class="panel grid">
    <h1>Iniciar Sesión</h1>
    <form action="/login" method="post" on:submit|preventDefault={submitForm}>
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
      {#if errors}
        <p class="error">{errors}</p>
      {/if}
      <button type="submit" class="inverted" style="--color: var(--purple)">
        Log in
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
  }
</style>
