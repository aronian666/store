<script>
  import Fieldset from "./Fieldset.svelte";
  import Modal from "./Modal.svelte";

  export let text = "";
  export let title = "";
  export let handler;
  export let success;
</script>

<Modal {handler}>
  <form on:submit|preventDefault={(e) => success(text)}>
    <Fieldset {title} bind:input={text} {...$$restProps} />
    <div class="flex gap reverse">
      <button class="inverted" style="--color: DeepSkyBlue" type="submit">
        Aceptar
      </button>
      <button
        type="button"
        class="inverted"
        style="--color: tomato"
        on:click={handler}
      >
        Cancelar
      </button>
    </div>
  </form>
</Modal>
