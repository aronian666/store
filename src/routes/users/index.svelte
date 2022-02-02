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
  export let users = [];
</script>

<p>El numero de usuarios es: {users.length}</p>
