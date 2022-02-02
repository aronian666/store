<script context="module">
  export async function load({ session }) {
    if (!session.current_user) return { status: 303, redirect: "/login" };
    return { props: null };
  }
</script>

<div class="grid" style="gap: 1rem">
  <slot />
</div>
