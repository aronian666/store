<script>
  import { goto } from "$app/navigation";
  import Fieldset from "./Fieldset.svelte";
  import FieldsetSelect from "./FieldsetSelect.svelte";
  import Product from "$lib/models/Product";
  export let categories = [];
  export let units = [];
  export let product;

  let assistant = {
    unit_id: "",
  };
  const submitProduct = async (e) => {
    const { data } = await Product.send(e.target, { product });
    goto(`/products/${data._id}`);
  };
  const handleUnits = (e) => {
    const exits = product.unitProducts.find(
      (unit) => unit.unit._id === assistant.unit_id
    );
    if (exits) return;
    const unit = units.find((unit) => unit._id == assistant.unit_id);
    product = product.setUnit(unit);
    assistant.unit_id = "";
  };
</script>

<h1>Crear Producto</h1>
<form
  action="/products.json"
  method="post"
  on:submit|preventDefault={submitProduct}
>
  <section class="grid panel" style="gap: 0.75rem; --color: var(--purple)">
    <h2>Datos generales</h2>
    <Fieldset
      title="Nombre del producto"
      name="product[name]"
      bind:input={product.name}
      placeholder="Nombre del producto"
      required
    />
    <FieldsetSelect
      items={categories}
      title="Categoría"
      name="product[category]"
      bind:input={product.category}
      let:item
      required
    >
      <option value={item._id} slot="option">{item.name}</option>
    </FieldsetSelect>
  </section>
  <section class="grid panel" style="gap: 0.75rem">
    <h2>Configurar unidades</h2>
    <FieldsetSelect
      items={units}
      title="Agregar unidad"
      name="assitant[unit_id]"
      info="Selecciona las unidades en las cuales se vendera este producto."
      let:item
      bind:input={assistant.unit_id}
      change={handleUnits}
    >
      <option value={item._id} slot="option">{item.name}</option>
    </FieldsetSelect>
    <div class="flex" style="gap: 1rem">
      {#each product.unitProducts as unitProduct, i}
        <div class="grid panel" style="gap: 0.75rem; --color: darkcyan">
          <h4>{unitProduct.unit.name}</h4>
          <Fieldset
            title="Cantidad"
            bind:input={unitProduct.quantity}
            name={`product[unit][${i}][quantity]`}
            type="number"
            required
            min="0"
          />
          <Fieldset
            title="Precio de compra"
            bind:input={unitProduct.buyPrice}
            name={`product[unit][${i}][buyPrice]`}
            type="number"
            step="0.01"
            required
            min="0"
          />
          <Fieldset
            title="Precio de venta"
            bind:input={unitProduct.sellPrice}
            name={`product[unit][${i}][sellPrice]`}
            type="number"
            required
            step="0.01"
            min="0"
          />
          <Fieldset
            title="Precio de venta - Juliaca"
            bind:input={unitProduct.otherPrice}
            name={`product[unit][${i}][otherPrice]`}
            type="number"
            required
            step="0.01"
            min="0"
          />
          <button
            style="--color: red"
            class="inverted"
            type="button"
            on:click={(e) => {
              const allow = confirm(
                "¿Estas seguro que deseas eliminar esta unidad?"
              );
              if (!allow) return;
              product.unitProducts.splice(i, 1);
              product = product;
            }}>Eliminar</button
          >
        </div>
      {/each}
    </div>
  </section>
  <button type="submit" class="inverted" style="--color: var(--purple)"
    >Guardar</button
  >
</form>

<style>
  h1 {
    text-align: center;
  }
</style>
