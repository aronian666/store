<script>
  import { goto } from "$app/navigation";
  import Fieldset from "$lib/components/Fieldset.svelte";
  import FieldsetSelect from "$lib/components/FieldsetSelect.svelte";
  import Li from "$lib/components/Li.svelte";
  import List from "$lib/components/List.svelte";
  import ActiveRecord from "$lib/models/ActiveRecord";
  import Group from "$lib/models/Group";
  export let products = [];
  export let group = new Group({});
  const types = [
    { name: "Tipo", values: [""] },
    { name: "Tamaño", values: [""] },
    { name: "Color", values: [""] },
  ];
  let type = null;
  const handleType = () => {
    const exist = group.variants.find((variant) => variant.name === type.name);
    if (!exist) {
      group.variants.push(type);
      group = group;
    }
    type = null;
  };
  const addCombination = () => {
    group.combine();
    group.reset();
    group = group;
  };
  const submitGroup = async (e) => {
    if (group.variants.length === 0)
      return alert("Tiene que agregar variantes");
    if (group.combinations.length === 0)
      return alert("Tiene que agregar combinaciones");
    const rest = group.combinations.filter(
      (combination) => !combination.product
    );
    if (rest.length > 0) return alert("Faltan productos por asinar");
    const data = await Group.send(e.target, { group });
    if (!data.error) goto(`/groups`);
  };
  const deleteGroup = async (e) => {
    const { error } = await ActiveRecord.send(
      { action: "/groups.json?_method=DELETE", method: "post" },
      { group: { _id: group._id } }
    );
    if (error)
      return alert("Ha ocurrido un error mientras se trataba de eliminar");
    goto("/groups");
  };
</script>

<form
  action="/groups/new.json"
  method="post"
  on:submit|preventDefault={submitGroup}
>
  <section class="panel grid">
    <h3>Datos generales</h3>
    <Fieldset
      title="Nombre del grupo"
      name="group[name]"
      bind:input={group.name}
      required
    />
    <FieldsetSelect
      bind:input={type}
      change={handleType}
      items={types}
      title="Seleccionar variantes"
      name="variants"
      let:item
      blank={true}
    >
      <option value={item} slot="option">{item.name}</option>
    </FieldsetSelect>
    <List slot="down" items={group.variants} let:item let:i>
      <Li
        slot="li"
        text={item.name}
        onDelete={(e) => {
          group.variants.splice(i, 1);
          group = group;
        }}
      />
    </List>
  </section>
  {#if group.variants.length > 0}
    <div class="panel grid">
      <h3>Agregar combinacion</h3>
      {#each group.variants as variant, i}
        <div class="panel flex gap">
          {#each variant.values as value, i}
            <fieldset>
              <label for={`product[variants][${variant.name}][${i}]`}
                >{variant.name} {i + 1}</label
              >
              <input
                name={`product[variants][${variant.name}][${i}]`}
                id={`product[variants][${variant.name}][${i}]`}
                type="text"
                bind:value
                on:keypress={(e) => {
                  if (value.length > 0 && i + 1 === variant.values.length) {
                    variant.values.push("");
                  }
                }}
              />
            </fieldset>
          {/each}
        </div>
      {/each}
      <div>
        <button
          type="button"
          class="inverted"
          style="--color: limegreen"
          on:click={addCombination}>Agregar</button
        >
      </div>
    </div>
  {/if}
  {#if group.combinations.length > 0}
    <section class="panel grid">
      <h3>Asignar variantes a productos</h3>
      <table>
        <tr>
          {#each group.variants as variant, i}
            <th>{variant.name}</th>
          {/each}

          <th>Producto</th>
          <th>Acciones</th>
        </tr>
        {#each group.combinations as combination, i}
          <tr>
            {#each group.variants as variant, index2}
              <td>{combination.variant[variant.name]}</td>
            {/each}
            <td>
              <input
                type="text"
                list="products"
                style="width: 100%"
                class={combination.product ? "valid" : "invalid"}
                bind:value={combination.product_name}
                on:change={(e) => {
                  const product = products.find(
                    (product) => product.name === combination.product_name
                  );
                  combination.product = product?._id;
                }}
              />
            </td>
            <td>
              <button
                type="button"
                class="holed"
                style="--color: tomato"
                on:click={(e) => {
                  if (!confirm("¿Esta seguro que desea eliminar?")) return;
                  group.combinations.splice(i, 1);
                  group = group;
                }}>Eliminar</button
              >
            </td>
          </tr>
        {/each}
      </table>
    </section>
  {/if}
  <div class="grid auto-fit gap">
    {#if group._id}
      <button
        type="button"
        class="inverted"
        style="--color: red"
        on:click={deleteGroup}>Eliminar grupo</button
      >
    {/if}
    <button class="inverted" style="--color: green"
      >{group._id ? "Actualizar grupo" : "Crear grupo"}</button
    >
  </div>
</form>
<datalist id="products" style="height:5.1em;overflow:hidden">
  {#each products as product (product._id)}
    <option value={product.name} />
  {/each}
</datalist>

<style>
  .valid {
    box-shadow: 0 0 0 3px green;
  }
  .invalid {
    box-shadow: 0 0 0 3px tomato;
  }
</style>
