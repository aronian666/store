<script>
    import { groupBy } from "$lib/scripts/groupBy";

    export let cartProducts = [];
    let orders = groupBy(cartProducts, "order");
    const sum = (cartProducts = []) => {
        return cartProducts.reduce((a, b) => a + b.options.quantity, 0);
    };
</script>

<div class="grid" style="gap: 1.5rem">
    <h3>{cartProducts[0].product.name}</h3>
    <ul class="grid" style="gap: 0.5rem">
        {#each Object.keys(orders) as id, i}
            <li>
                <a href={`/orders/${id}`}
                    >Cantidad de material vendido <span>{sum(orders[id])}</span>
                </a>
            </li>
        {/each}
    </ul>
</div>

<style>
    a {
        color: black;
        font-weight: 400;
    }
    span {
        color: red;
    }
</style>
