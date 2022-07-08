<script context="module">
  export async function load({ fetch, params }) {
    const response = await fetch(`/contracts/${params.id}.json`);
    const contract = await response.json();
    return { props: { contract } };
  }
</script>

<script>
  import Icon from "$lib/components/Icon.svelte";

  import Payment from "$lib/components/Payment.svelte";
  import Progress from "$lib/components/Progress.svelte";
  import Table from "$lib/components/Table.svelte";
  import Client from "$lib/db/Client";
  import Contract from "$lib/models/Contract";
  import { storage } from "$lib/scripts/firebase";
  import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
  export let contract = new Contract({});
  contract = new Contract(contract);
  const addFile = async (file) => {
    const reference = ref(storage, `contracts/${contract._id}/${file.name}`);
    const promise = await uploadBytes(reference, file);
    return promise;
  };
  const updateStatus = async (status) => {
    const data = await Contract.update({ _id: contract._id, status });
    contract.status = status;
    contract = contract;
  };
  const handleInput = async (e) => {
    const filesArray = e.target.files;
    const files = [];
    for (let i = 0; i < filesArray.length; i++) {
      files.push(filesArray[i]);
    }
    const snapshots = await Promise.all(files.map((file) => addFile(file)));
    const urls = await Promise.all(
      snapshots.map((snapshot) => getDownloadURL(snapshot.ref))
    );
    const { data, error } = await Contract.send(
      { action: "/contracts.json?_method=PUT", method: "post" },
      { photos: urls, _id: contract._id }
    );
    if (!error) {
      contract.photos.push(urls);
      contract = contract;
    }
  };
</script>

<div class="grid" style="gap:1rem">
  <Progress
    steps={Contract.statuses.map((s) => s.name)}
    currentStep={contract.status}
    onClick={(status, index) => updateStatus(index)}
  />
  <section class="grid auto-fit" style="gap: 1rem">
    <section class="flex gap column">
      <h3>Detalles</h3>
      <div class="flex gap column">
        <div class="flex gap">
          <Icon size="16" icon="cleaning_services" /><span
            >{contract.service.name}</span
          >
        </div>
        <div class="flex gap">
          <Icon size="16" icon="calendar_month" /><span
            >{contract.start.toLocaleDateString()}</span
          >
        </div>
        <div class="flex gap">
          <Icon size="16" icon="schedule" /><span
            >{contract.start.toLocaleTimeString()}</span
          >
        </div>
        <div class="flex gap">
          <Icon size="16" icon="manage_accounts" /><span
            >{contract.expert.name}</span
          >
        </div>
        <div class="flex gap">
          <Icon size="16" icon="face_4" /><span>{contract.client.name}</span>
        </div>
        <div class="flex gap">
          <Icon size="16" icon="attach_money" /><span>{contract.direction}</span
          >
        </div>
      </div>
      <button
        class="inverted"
        style="--color: red"
        on:click={(e) => updateStatus(3)}>Cancelar contrato</button
      >
    </section>

    <Payment bind:contract />
    <section class="flex column gap">
      <h3>Photos</h3>
      <div class="grid gap auto-fill photos" style="--size: 150px">
        <label>
          <input
            type="file"
            multiple
            style="display: none;"
            on:change={handleInput}
          />
          Agregar foto
        </label>
        {#each contract.photos as photo, i}
          <picture>
            <img src={photo} alt={`Foto ${i}`} />
          </picture>
        {/each}
      </div>
    </section>
  </section>
  <section class="flex column gap">
    <h3>Recibos</h3>
    <div class="flex gap">
      <button>Nota</button>
      <button>Boleta</button>
      <button>Factura</button>
    </div>
  </section>
</div>

<style>
  .photos > * {
    aspect-ratio: 1;
    border-radius: 0.5rem;
  }
  picture {
    padding: 0.5rem;
    background-color: #efefef;
  }
  img {
    width: 100%;
    height: 100%;
  }
  label {
    border: 1px dashed black;
    display: grid;
    place-content: center;
    cursor: pointer;
  }
  label:hover {
    background-color: #efefef;
  }
</style>
