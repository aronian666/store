<script context="module">
  export async function load({ fetch, params }) {
    const response = await fetch(`/contracts/${params.id}.json`);
    const contract = await response.json();
    return { props: { contract } };
  }
</script>

<script>
  import Icon from "$lib/components/Icon.svelte";
  import Modal from "$lib/components/Modal.svelte";

  import Payment from "$lib/components/Payment.svelte";
  import Print from "$lib/components/Print.svelte";
  import Progress from "$lib/components/Progress.svelte";
  import Table from "$lib/components/Table.svelte";
  import Client from "$lib/db/Client";
  import Contract from "$lib/models/Contract";
  import Service from "$lib/models/Service";
  import P from "$lib/models/Payment";
  import { storage } from "$lib/scripts/firebase";
  import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
  import { onMount } from "svelte";
  export let contract = new Contract({});
  contract = new Contract(contract);
  let submitPhoto = false;
  onMount(async () => {
    const response = await fetch("/services.json");
    const services = await response.json();
    contract.service = services.find(
      (service) => contract.service === service._id
    );
    contract.service = new Service(contract.service);
    const paymentResponse = await fetch(
      `/payments.json?contract=${contract._id}`
    );
    const payments = await paymentResponse.json();
    contract.payments = payments.map((payment) => {
      return new P(payment);
    });
    contract = contract;
  });
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
    submitPhoto = true;
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
    submitPhoto = false;
  };
  let img = null;
  let note = null;
</script>

<div class="grid" style="gap:1rem">
  <Progress
    steps={Contract.statuses}
    currentStep={contract.status}
    onClick={(status, index) => updateStatus(index)}
  />
  <section class="grid auto-fit" style="gap: 1rem">
    <section class="flex panel gap column">
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
          <Icon size="16" icon="face_4" /><span
            >{contract.quote.client.name}</span
          >
        </div>
        <div class="flex gap">
          <Icon size="16" icon="attach_money" /><span
            >{contract.quote.client.direction}</span
          >
        </div>
        <div class="flex gap">
          <Icon size="16" icon="import_contacts" /><span
            >{contract.stringCode}</span
          >
        </div>
        <div class="flex gap">
          <Icon size="16" icon="construction" /><span
            >{contract.experts.map((e) => e.name).join(" - ")}</span
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
    <section class="panel flex column gap">
      <h3>Photos</h3>
      <div class="grid gap auto-fill photos" style="--size: 150px">
        <label>
          <input
            type="file"
            multiple
            style="display: none;"
            on:change={handleInput}
          />
          {submitPhoto ? "Subiendo..." : "Subir fotos"}
        </label>
        {#each contract.photos as photo, i}
          <picture on:click={(e) => (img = photo)}>
            <img src={photo} alt={`Foto ${i}`} />
          </picture>
        {/each}
      </div>
    </section>
  </section>
  <section class="flex column gap">
    <h3>Recibos</h3>
    <div class="flex gap">
      <button on:click={(e) => (note = true)}>Nota</button>
      <button>Boleta</button>
      <button>Factura</button>
    </div>
  </section>
</div>
{#if note}
  <Modal handler={(e) => (note = null)}>
    <Print order={contract.quote}>
      <span slot="code" class="code">{contract.stringCode}</span>
      <table slot="table">
        <thead>
          <tr>
            <th>CANT</th>
            <th>DESCRIPCIÓN</th>
            <th>P. TOTAL</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>{contract.service.name}</td>
            <td class="right">{contract.quote.total.toFixed(2)}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2">TOTAL A PAGAR</td>
            <td colspan="2" class="right">{contract.quote.total.toFixed(2)}</td>
          </tr>
          <tr>
            <td colspan="2">ADELANTO</td>
            <td colspan="2" class="right">{contract.total.toFixed(2)}</td>
          </tr>
          <tr>
            <td colspan="2">SALDO</td>
            <td colspan="2" class="right">{contract.rest.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
    </Print>
  </Modal>
{/if}
{#if img}
  <Modal handler={(e) => (img = null)}>
    <img src={img} alt="" class="big" />
  </Modal>
{/if}

<style>
  tfoot td:last-child {
    font-weight: bold;
  }
  tfoot td {
    font-size: 1.25rem;
  }
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
  .big {
    width: 80vw;
    height: 80vh;
  }
  .right {
    text-align: right;
  }
  .code {
    font-size: 1.5rem;
  }
</style>
