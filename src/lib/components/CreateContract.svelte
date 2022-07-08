<script>
  import Contract from "$lib/models/Contract";
  import { getContext, onMount } from "svelte";
  import Fieldset from "./Fieldset.svelte";
  import FieldsetSelect from "./FieldsetSelect.svelte";
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
  let contract = new Contract({});
  const users = getContext("users");
  const clients = getContext("clients");
  const services = getContext("services");
  const addContract = getContext("addContract");
  const handler = getContext("handler");
  let hour = date.getHours();
  const minutes = [0, 30];
  const hours = [hour, hour + 1];
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
  };
  const handleSubmit = async (e) => {
    contract.start = new Date(date.getTime());
    contract.start.setHours(assistant.start.hour);
    contract.start.setMinutes(assistant.start.minute);
    contract.end = new Date(date.getTime());
    contract.end.setHours(assistant.end.hour);
    contract.end.setMinutes(assistant.end.minute);
    const { error, data } = await Contract.send(e.target, { contract });
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
  const handleClient = (e) => {
    const client = clients.find(
      (client) => client.name === contract.client.name
    );
    if (client) {
      contract.client._id = client._id;
      contract.client.phone = client.phone;
      contract.client.direction = client.direction;
    }
  };
</script>

<form
  action="/contracts.json"
  method="post"
  on:submit|preventDefault={handleSubmit}
>
  <h3>Cliente</h3>
  <Fieldset
    name="contract[client][name]"
    bind:input={contract.client.name}
    onChange={handleClient}
    title="Cliente"
    list="clients"
  />
  <Fieldset
    name="contract[client][phone]"
    bind:input={contract.client.phone}
    title="Telefono"
  />
  <Fieldset
    name="contract[client][direction]"
    bind:input={contract.client.direction}
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
  <div class="grid auto-fit gap" style="--size: 70px">
    <FieldsetSelect
      items={hourMinutes}
      name="contract[start]"
      let:item
      title="Inicio"
      bind:input={assistant.start}
    >
      <option slot="option" value={item}>{item.hour} : {item.minute}</option>
    </FieldsetSelect>
    <FieldsetSelect
      items={hourMinutes}
      name="contract[end]"
      let:item
      title="Fin"
      bind:input={assistant.end}
    >
      <option slot="option" value={item}>{item.hour} : {item.minute}</option>
    </FieldsetSelect>
  </div>
  <div class="grid auto-fit gap" style="--size: 70px">
    <FieldsetSelect
      items={users}
      name="contract[expert]"
      let:item
      title="Tecnico"
      bind:input={contract.expert}
    >
      <option slot="option" value={item._id}>{item.name}</option>
    </FieldsetSelect>
    <FieldsetSelect
      items={services}
      name="contract[service]"
      let:item
      title="Servicio"
      bind:input={contract.service}
    >
      <option slot="option" value={item._id}>{item.name}</option>
    </FieldsetSelect>
  </div>
  <div class="flex gap">
    <Fieldset
      name="contract[price]"
      title="Precio"
      bind:input={contract.price}
      type="number"
      min="0"
      step="0.01"
    />
    <Fieldset
      name="contract[balance]"
      title="Adelanto"
      bind:input={contract.balance}
      type="number"
      min="0"
      step="0.01"
    />
  </div>

  <Fieldset
    name="contract[direction]"
    title="Direccion del trabajo"
    bind:input={contract.direction}
    placeholder="Jr. Puno"
  />

  <button class="inverted">Crear</button>
</form>

<datalist id="clients">
  {#each clients as client}
    <option value={client.name} />
  {/each}
</datalist>
