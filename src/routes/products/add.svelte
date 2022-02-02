<script>
  import Modal from "$lib/components/Modal.svelte";
  import Product from "$lib/models/Product";
  import { XLSXReader } from "$lib/scripts/xlsxReader";
  const reader = new XLSXReader();
  const handleProducts = async (products) => {
    loading = true;
    const success = await Product.saveMany(products);
    loading = false;
  };
  const handleFile = (selector, handleData) => {
    const file = document.querySelector(selector).files[0];
    reader.parseExcel(file);
    setTimeout(() => {
      handleData(reader.data[0]);
    }, 100);
  };
  let loading = false;
</script>

<div class="flex wrap gap">
  <section class="panel grid">
    <h2>Actualizar y agregar productos</h2>
    <input type="file" id="update" />
    <button on:click={Product.getFormat} class="holed" style="--color: red"
      >Descargar formato</button
    >
    <button on:click={(e) => handleFile("#update", handleProducts)}
      >Subir archivo</button
    >
  </section>
</div>
{#if loading}
  <Modal loading={true} />
{/if}
