<script>
  import CartProduct from "$lib/models/CartProduct";
  import List from "./List.svelte";
  import Li from "./Li.svelte";
  import Fieldset from "./Fieldset.svelte";
  import { getContext } from "svelte";
  import Group from "$lib/models/Group";
  import Prompt from "./Prompt.svelte";
  export let product;
  export let handler;
  export let group;
  export let index;
  export let cartProduct = new CartProduct({
    options: { price: product.sellPrice },
    product: product,
    unitProduct: product.unitProduct,
  });
  let order = getContext("order");
  const codes = getContext("codes");
  let editCode = false;
  let previus_id = product._id;
  const nameChange = (id) => {
    if (previus_id !== id) {
      cartProduct.unitProduct = product.unitProduct;
      previus_unit_id = cartProduct.unitProduct.unit._id;
      cartProduct.resetPrice();
      cartProduct.product = product;
    }
    previus_id = id;
  };
  let previus_unit_id = product.unitProduct.unit._id;
  const changeUnit = (id) => {
    if (id !== previus_unit_id) {
      cartProduct = cartProduct.resetPrice();
    }
    previus_unit_id = cartProduct.unitProduct.unit._id;
  };
  $: {
    changeUnit(cartProduct.unitProduct.unit._id);
  }
  $: {
    nameChange(product._id);
  }
  const current_user = getContext("current_user");
  let permit = current_user.role != 2;
  const addProduct = (e) => {
    if (typeof index === "number") {
      if (confirm("¿Estas seguro de querer guardar los cambios?") === false)
        return;
      $order.cartProducts[index] = cartProduct;
      handler();
    } else {
      cartProduct.group = group
        ? new Group(JSON.parse(JSON.stringify(group)))
        : null;
      $order.cartProducts = [cartProduct, ...$order.cartProducts];
      alert("Se ha añadido al carrito!");
    }
    cartProduct = new CartProduct(cartProduct.toObject());
  };
</script>

<form on:submit|preventDefault={addProduct}>
  <h4>{product.name}</h4>
  <section class="flex wrap space-between" style="gap: 1rem">
    <fieldset>
      <h5>Disponible</h5>
      <p
        style={`color: ${
          cartProduct.unitProduct.quantity > 0 ? "green" : "red"
        }`}
      >
        {cartProduct.unitProduct.quantity}
      </p>
    </fieldset>
    <fieldset>
      <h5>Unidad</h5>
      <List items={product.unitProducts} let:item>
        <Li
          slot="li"
          text={item.unit.name}
          onClick={(e) => (cartProduct.unitProduct = item)}
          active={cartProduct.unitProduct.unit._id === item.unit._id}
        />
      </List>
    </fieldset>
  </section>
  <section class="flex space-between" style="gap: 2rem">
    <fieldset>
      <h5>Precio de venta</h5>
      <p
        style="cursor: pointer"
        on:click={(e) =>
          (cartProduct.options.price = cartProduct.unitProduct.sellPrice)}
      >
        S./ {cartProduct.unitProduct.sellPrice}
      </p>
    </fieldset>
    {#if permit}
      <fieldset>
        <h5>Precio de Compra</h5>
        <p>S./ {cartProduct.unitProduct.buyPrice}</p>
      </fieldset>
    {/if}
    <fieldset>
      <h5>Precio Juliaca</h5>
      <p>S/. {cartProduct.unitProduct.otherPrice}</p>
    </fieldset>
  </section>
  <section class="grid gap">
    <div class="grid auto-fit gap" style="--size: 150px">
      <Fieldset
        name="options[price]"
        type="number"
        step="0.01"
        icon="attach_money"
        title="Precio"
        bind:input={cartProduct.options.price}
        min="0"
        readonly={!permit}
        onClick={(e) => (editCode = true)}
      />
      <Fieldset
        icon="format_align_justify"
        type="number"
        name="options[quantity]"
        title="Cantidad"
        bind:input={cartProduct.options.quantity}
        min="0"
        info="Puedes poner como maximo la cantidad disponible"
      />
    </div>
    {#if cartProduct.unitProduct.unit.measures}
      <div class="grid auto-fit gap" style="--size: 150px">
        {#if cartProduct.unitProduct.unit.measures?.width}
          <Fieldset
            type="number"
            icon="trending_flat"
            name="options[measures][width]"
            step="0.01"
            title="Largo"
            min="0"
            onFocus={(e) => {
              if (cartProduct.options.measures.width === 1)
                cartProduct.options.measures.width = null;
            }}
            onBlur={(e) => {
              if (cartProduct.options.measures.width === null)
                cartProduct.options.measures.width = 1;
            }}
            bind:input={cartProduct.options.measures.width}
          />
        {/if}
        {#if cartProduct.unitProduct.unit.measures?.height}
          <Fieldset
            icon="height"
            type="number"
            title="Alto"
            step="0.01"
            name="options[measures][height]"
            min="0"
            onFocus={(e) => {
              if (cartProduct.options.measures.height === 1)
                cartProduct.options.measures.height = null;
            }}
            onBlur={(e) => {
              if (cartProduct.options.measures.height === null)
                cartProduct.options.measures.height = 1;
            }}
            bind:input={cartProduct.options.measures.height}
          />
        {/if}
      </div>
    {/if}
  </section>
  <section class="grid gap auto-fit" style="--size: 150px">
    <fieldset>
      <h5>Precio por unidad</h5>
      <p style="color: darkviolet; font-weight: 500">
        S/. {cartProduct.finalUnitPrice}
      </p>
    </fieldset>
    <fieldset>
      <h5>Precio total</h5>
      <p style="color: red; font-weight: 500">S/. {cartProduct.total}</p>
    </fieldset>
  </section>
  <button disabled={cartProduct.unitProduct.quantity <= 0} type="submit">
    {typeof index === "number" ? "Modificar" : "Agregar al carrito"}</button
  >
</form>

{#if editCode}
  <Prompt
    title="Ingresa un codigo para editar"
    handler={(e) => (editCode = false)}
    type="password"
    success={(code) => {
      if ($codes.includes(code)) {
        permit = true;
        editCode = false;
        return alert("Ahora puedes editar");
      }
      alert("El codigo no es valido");
    }}
  />
{/if}
