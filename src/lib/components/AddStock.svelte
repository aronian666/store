<script>
  import ActiveRecord from "$lib/models/ActiveRecord";
  import Buy from "$lib/models/Buy";
  import { getContext, onMount } from "svelte";
  import Fieldset from "./Fieldset.svelte";
  import FieldsetSelect from "./FieldsetSelect.svelte";
  export let unitProduct;
  export let product;
  let providers = [];
  let buy = new Buy({
    product: product._id,
    unitProduct: unitProduct._id,
    buyPrice: unitProduct.buyPrice,
    sellPrice: unitProduct.sellPrice,
  });
  let loading = getContext("loading");
  onMount(async () => {
    const { data } = await ActiveRecord.get("/providers.json");
    providers = data;
    buy.provider = data[0]._id;
  });
  const addStock = async (e) => {
    $loading = true;
    const response = await ActiveRecord.send(e.target, { buy });
    if (!response.error) location.reload();
  };
</script>

<form
  action={`/products/${product._id}/buys.json`}
  method="post"
  on:submit|preventDefault={addStock}
>
  <h2>{unitProduct.unit.name}</h2>
  <Fieldset
    title="Cantidad"
    bind:input={buy.quantity}
    name={`buy[quantity]`}
    type="number"
    step="0.01"
    required
    min="0"
  />
  <Fieldset
    title="Precio de compra"
    bind:input={buy.buyPrice}
    name={`buy[buyPrice]`}
    type="number"
    required
    step="0.01"
    min="0"
  />
  <Fieldset
    title="Precio de venta"
    bind:input={buy.sellPrice}
    name={`buy[sellPrice]`}
    type="number"
    required
    step="0.01"
    min="0"
  />
  <Fieldset
    title="Fecha de compra"
    bind:input={buy.date}
    name="buy[date]"
    type="date"
    required
  />
  <FieldsetSelect
    title="Proveedor"
    items={providers}
    bind:input={buy.provider}
    let:item
    required
  >
    <option slot="option" value={item._id}>{item.name}</option>
  </FieldsetSelect>
  <button class="inverted" style="--color: green">Agregar</button>
</form>
