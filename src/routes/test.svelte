<script>
    import { sign } from "$lib/scripts/sign";

    import { onMount } from "svelte";

    onMount(async () => {
        const signed = await sign();
        console.log(signed);
    });
</script>

<h1>las ratas no lloran</h1>
