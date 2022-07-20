<script>
  export let order;
  export let all = true;
</script>

<div id="print">
  <div class="border">
    <picture>
      <img src="/logo.svg" alt="logo" />
    </picture>
    <p><slot name="code" /></p>
    <p>Jr. Grau #160 - Ayaviri</p>
    <p>968248341 - 951522870</p>
  </div>
  {#if all}
    <div class="flex wrap space-around border" style="gap: .125rem">
      <p>Cliente: <b>{order.clientName}</b></p>
      <p>Direccion: <b>{order.client.showDirection}</b></p>
      <p>Telefono: <b>{order.client.showPhone}</b></p>
    </div>
    <div class="flex wrap space-around border" style="gap: .125rem">
      <p>Fecha: {order.createdAt.toLocaleString()}</p>
      <p>Vendedor: {order.employee.name}</p>
    </div>
  {/if}
  <div class="grid">
    {#if $$slots.table}
      <slot name="table" />
    {:else}
      <table>
        <thead>
          <tr>
            <th>CANT</th>
            <th>DESCRIPCIÓN</th>
            <th>P. UNIT</th>
            <th>P. TOTAL</th>
          </tr>
        </thead>
        <tbody>
          {#each order?.cartProducts as cartProduct}
            <tr>
              <td>{cartProduct.options.quantity}</td>
              <td>{cartProduct.showName}</td>
              <td class="right">{cartProduct.finalUnitPrice}</td>
              <td class="right">{cartProduct.total.toFixed(2)}</td>
            </tr>
          {/each}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2">TOTAL A PAGAR</td>
            <td colspan="2" class="right">{order.total.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
    {/if}
  </div>
  <div>
    {#if all}
      <p class="cursive">Revise su vuelto antes de retirarse.</p>
      <p class="cursive">No se admiten cambios ni devoluciones de productos.</p>
      <p>GRACIAS POR SU COMPRA</p>
    {/if}
    <p>VIDRIOCENTRO mas de 20 años a tu servicio</p>
  </div>
</div>
{#if $$slots.buttons}
  <slot name="buttons" />
{:else}
  <div class="grid">
    <button
      on:click={(e) => {
        window.scroll(0, 0);
        window.print();
      }}>Imprimir</button
    >
  </div>
{/if}

<style>
  .border {
    border-bottom: 1px dashed black;
  }
  .cursive {
    font-style: italic;
  }
  p {
    text-align: center;
  }
  picture {
    display: grid;
    place-content: center;
  }
  img {
    width: 8rem;
    aspect-ratio: 1/1;
  }
  tfoot td {
    font-weight: 700;
    font-size: 1rem !important;
  }
  td,
  th {
    padding: 0 0.125rem;
  }
  .right {
    text-align: right;
  }
  #print > div {
    padding: 0.25rem 0;
  }
  #print {
    font-family: "Roboto Condensed";
  }
  #print * {
    font-size: 0.65rem;
  }
</style>
