<script>
  import Contract from "$lib/models/Contract";
  import Payment from "$lib/models/Payment";
  import Fieldset from "./Fieldset.svelte";
  import Modal from "./Modal.svelte";
  import Table from "./Table.svelte";

  export let contract = new Contract({});
  let payment = {
    amount: 0,
    contract: contract._id,
  };
  let open = false;
  const addPayment = async (e) => {
    const data = await Payment.create(payment);
    payment.amount = 0;
    payment = payment;
    contract.payments.push(new Payment(data));
    contract = contract;
    open = false;
  };
</script>

<section class="panel flex column gap">
  <h3>Pagos</h3>
  <div class="grid gap payments">
    <span>Total a pagar</span>
    <b style="color: deepskyblue">{contract.quote.total.toFixed(2)}</b>
    <span>Total pagado</span>
    <b style="color: orange">{contract.total.toFixed(2)}</b>
    <span>Restante</span>
    <b style="color: tomato">{contract.rest.toFixed(2)}</b>
  </div>
  <button
    disabled={contract.rest <= 0}
    class="inverted"
    on:click={(e) => (open = true)}>Agregar pago</button
  >
  <Table
    items={contract.payments}
    count={5}
    properties={[
      { name: "Fecha y hora", property: "createdAt" },
      { name: "Monto", property: "amount" },
    ]}
    let:item
  >
    <tr slot="tr">
      <td>{item.createdAt.toLocaleString()}</td>
      <td class="amount">S./ {item.amount.toFixed(2)}</td>
    </tr>
  </Table>
  {#if open}
    <Modal handler={(e) => (open = false)}>
      <form
        action="/payments.json"
        method="post"
        on:submit|preventDefault={addPayment}
      >
        <Fieldset
          name="payment[amount]"
          title="Monto"
          bind:input={payment.amount}
        />
        <button>Agregar pago</button>
      </form>
    </Modal>
  {/if}
</section>

<style>
  .amount {
    color: green;
    text-align: right;
  }
  .payments {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
</style>
