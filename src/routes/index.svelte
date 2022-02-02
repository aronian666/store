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