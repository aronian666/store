<script context="module">
    export async function load({ fetch }) {
        const response = await fetch("/quotes.json");
        const quotes = await response.json();
        return { props: { quotes } };
    }
</script>

<script>
    import Modal from "$lib/components/Modal.svelte";
    import Search from "$lib/components/Search.svelte";
    import Table from "$lib/components/Table.svelte";
    import Quote from "$lib/models/Quote";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";

    export let quotes = [];

    quotes = quotes.map((quote) => new Quote(quote));
    let searched = [];
    const quoteId = $page.url.searchParams.get("quote");
    let modal = quotes.find((quote) => quote._id == quoteId);
</script>

<div class="grid" style="gap: 1rem">
    <section class="panel">
        <h3>Filtros</h3>
        <Search
            items={quotes}
            bind:searched
            properties={[
                "stringCode",
                "clientName",
                "employeeName",
                "productCount",
                "createdAt",
            ]}
        />
    </section>
    <section class="panel grid">
        <Table
            let:item
            items={searched}
            properties={[
                { name: "Assinado", property: "contract" },
                { name: "Cliente", property: "clientName" },
                { name: "Vendedor", property: "employeeName" },
                { name: "Productos", property: "productCount" },
                { name: "Fecha", property: "createdAt" },
                { name: "Detalles" },
            ]}
        >
            <tr slot="tr" class:assigned={item.contract}>
                <td>{item.assigned}</td>
                <td>{item.clientName}</td>
                <td>{item.employee.name}</td>
                <td>{item.cartProducts.length}</td>
                <td>{item.createdAt.toLocaleString()}</td>
                <td class="grid">
                    <button
                        class="holed"
                        style="--color: tomato"
                        on:click={() => goto(`?quote=${item._id}`)}
                    >
                        Ver detalles</button
                    >
                </td>
            </tr>
        </Table>
    </section>
</div>

{#if modal}
    <Modal handler={() => goto($page.url.pathname)}>
        <div class="grid gap">
            <h3>Detalles</h3>
            <table>
                <thead>
                    <tr>
                        <th>Cantidad</th>
                        <th>Nombre</th>
                        <th>Unidad</th>
                        <th>Precio unitario</th>
                        <th>Precio total</th>
                    </tr>
                </thead>
                <tbody>
                    {#each modal.cartProducts as product}
                        <tr>
                            <td>{product.options.quantity}</td>
                            <td>{product.name}</td>
                            <td>{product.unitProduct.unit.name}</td>
                            <td>{product.finalUnitPrice}</td>
                            <td style="text-align: right;"
                                >{product.total.toFixed(2)}</td
                            >
                        </tr>
                    {/each}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="3" />
                        <td><b>TOTAL</b></td>
                        <td style="text-align: right;"
                            ><b>{modal.total.toFixed(2)}</b></td
                        >
                    </tr>
                </tfoot>
            </table>
            <div class="flex gap reverse">
                <button
                    on:click={async (e) => {
                        const { error, data } = await Quote.del(modal);
                        if (!error) {
                            location.reload();
                        }
                    }}
                    class="holed"
                    style="--color: tomato">Eliminar</button
                >
                {#if !modal.contract}
                    <a
                        href={`/contracts?quote=${modal._id}`}
                        class="holed button"
                        style="--color: deepskyblue">Iniciar contrato</a
                    >
                {:else}
                    <a
                        href={`/contracts/${modal.contract}`}
                        class="holed button"
                        style="--color: deepskyblue">Ver contrato</a
                    >
                {/if}
            </div>
        </div>
    </Modal>
{/if}

<style>
    .assigned {
        color: green;
    }
</style>
