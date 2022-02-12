<script>
  import { onMount } from "svelte";
  import Draw3D from "./Draw3D.svelte";
  import Modal from "./Modal.svelte";

  export let cuts;
  export let glass;
  $: {
    cuts;
    setTimeout(() => {
      assignAspect();
    }, 1);
  }
  let aspect = 400 / glass.x;
  function setPosition(vector, index, aspect) {
    return `
          width: ${vector.x * aspect - 1}px;
          height: ${vector.y * aspect - 1}px;
          background-color: ${
            index !== undefined ? "GreenYellow" : "DodgerBlue"
          };
          bottom: ${(vector.init?.y || 0) * aspect + 1}px;
          left: ${(vector.init?.x || 0) * aspect + 1}px;
      `;
  }
  let assignAspect = () => {};
  onMount(() => {
    assignAspect = (e) => {
      const parent = document.querySelector(".parent");
      aspect = parent?.clientWidth / glass.x;
    };
    window.addEventListener("resize", assignAspect);
    //assignAspect();
    return () => window.removeEventListener("resize", assignAspect);
  });
  let draw = {
    open: false,
    cut: null,
  };
</script>

<div>
  {#each cuts as cut, i}
    <section
      class="grid gap panel"
      style="cursor: pointer;"
      on:click={(e) => {
        draw.open = true;
        draw.cut = cut;
      }}
    >
      <h4>Opcion {i + 1}</h4>
      <section style={`height: ${glass.y * aspect}px`} class="parent">
        {#each cut.sections as section, index}
          <section class="child" style={setPosition(section, index, aspect)}>
            {index + 1}
          </section>
        {/each}
        {#each cut.glasses as glass}
          <section
            class="child"
            style={setPosition(glass, undefined, aspect)}
          />
        {/each}
      </section>
    </section>
  {/each}
</div>
{#if draw.open}
  <Modal handler={(e) => (draw.open = false)}>
    <Draw3D cut={draw.cut} {glass} />
  </Modal>
{/if}

<style>
  div {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
    gap: 1rem;
  }
  .parent {
    position: relative;
  }
  .child {
    position: absolute;
  }
  .parent > * {
    display: grid;
    place-content: center;
  }
</style>
