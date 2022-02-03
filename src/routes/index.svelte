<script context="module">
  export async function load({ session }) {
    if (!session.current_user) return { status: 303, redirect: "/login" };
    return { props: null };
  }
</script>

<script>
  import { session } from "$app/stores";
  let current_user = $session.current_user;
</script>

<h1>Bienvenido {current_user.name}</h1>
<p>Tenias que darme la plantilla de los reportes prro!</p>
<p>Aqui ira, creo que solo esto falta</p>
