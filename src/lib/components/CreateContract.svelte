<script>
  import Contract from "$lib/models/Contract";
  import Quote from "$lib/models/Quote";
  import { getContext, onMount } from "svelte";
  import Fieldset from "./Fieldset.svelte";
  import FieldsetSelect from "./FieldsetSelect.svelte";
  import Li from "./Li.svelte";
  import List from "./List.svelte";
  const days = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"];
  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Deciembre",
  ];

  export let date = new Date();

  const users = getContext("users");
  const clients = getContext("clients");
  const services = getContext("services");
  const addContract = getContext("addContract");
  const quote = getContext("quote");
  const handler = getContext("handler");
  let hour = date.getHours();
  const minutes = [0, 30];
  const hours = [hour, hour + 1];
  let contract = new Contract({ quote });
  const hourMinutes = hours
    .map((hour) => {
      return minutes.map((minute) => {
        return { hour, minute };
      });
    })
    .flat();
  let assistant = {
    start: hourMinutes[0],
    end: hourMinutes[2],
    expert: null,
  };
  const handleSubmit = async (e) => {
    contract.start = new Date(date.getTime());
    contract.start.setHours(assistant.start.hour);
    contract.start.setMinutes(assistant.start.minute);
    contract.end = new Date(date.getTime());
    contract.end.setHours(assistant.end.hour);
    contract.end.setMinutes(assistant.end.minute);
    const { error, data } = await Contract.send(e.target, { contract });
    await Quote.update({ _id: quote._id, contract: data });
    if (!error) {
      addContract(new Contract(data));
      handler();
    } else {
      alert("ha ocurrido un error, sorry :(");
    }
  };
  /* onMount(() => {
    const exits = document.querySelector("scriptmaps")
    if (exits) return
    const maps = document.createElement("script")
    maps.setAttribute("id", "scriptmaps")
    maps.setAttribute("src", "https://maps.googleapis.com/maps/api/js?key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&callback=initMap&v=weekly")
    document.head.appendChild(maps)
  }) */
</script>

<form
  action="/contracts.json"
  method="post"
  on:submit|preventDefault={handleSubmit}
>
  <h3>Cliente</h3>
  <Fieldset
    name="contract[client][name]"
    bind:input={quote.client.name}
    readonly={true}
    title="Cliente"
    list="clients"
  />
  <Fieldset
    readonly={true}
    name="contract[client][phone]"
    bind:input={quote.client.phone}
    title="Telefono"
  />
  <Fieldset
    readonly={true}
    name="contract[client][direction]"
    bind:input={quote.client.direction}
    title="Direccion del cliente"
  />
  <h3>Detalles</h3>
  <fieldset>
    <label for="day">Dia</label>
    <input
      type="text"
      value={`${days[date.getDay()]} ${date.getDate()} del ${
        monthNames[date.getMonth()]
      }`}
      readonly
    />
  </fieldset>
  <div class="grid auto-fit gap" style="--size: 100px">
    <FieldsetSelect
      items={hourMinutes}
      name="contract[start]"
      icon="schedule"
      let:item
      title="Inicio"
      bind:input={assistant.start}
    >
      <option slot="option" value={item}>{item.hour} : {item.minute}</option>
    </FieldsetSelect>
    <FieldsetSelect
      items={hourMinutes}
      name="contract[end]"
      icon="schedule"
      let:item
      title="Fin"
      bind:input={assistant.end}
    >
      <option slot="option" value={item}>{item.hour} : {item.minute}</option>
    </FieldsetSelect>
  </div>
  <div class="flex column gap">
    <FieldsetSelect
      items={users}
      name="assistant[expert]"
      let:item
      title="Tecnico"
      change={(e) => {
        const exist = contract.experts.find(
          (u) => u._id === assistant.expert._id
        );
        if (!exist) contract.experts.push(assistant.expert);
        assistant.expert = null;
        contract = contract;
      }}
      bind:input={assistant.expert}
    >
      <option slot="option" value={item}>{item.name}</option>
    </FieldsetSelect>
    <List items={contract.experts} let:item let:i>
      <Li
        slot="li"
        text={item.name}
        onDelete={(e) => {
          contract.experts.splice(i, 1);
          contract = contract;
        }}
      />
    </List>
  </div>
  <FieldsetSelect
    items={services}
    name="contract[service]"
    let:item
    title="Servicio"
    bind:input={contract.service}
  >
    <option slot="option" value={item._id}>{item.name}</option>
  </FieldsetSelect>
  <Fieldset
    name="contract[quote][total]"
    title="Precio"
    bind:input={quote.total}
    readonly={true}
    type="number"
    icon="attach_money"
    min="0"
    step="0.01"
  />

  <button class="inverted">Crear</button>
</form>

<datalist id="clients">
  {#each clients as client}
    <option value={client.name} />
  {/each}
</datalist>

<style>
  form {
    width: 400px;
  }
</style>
