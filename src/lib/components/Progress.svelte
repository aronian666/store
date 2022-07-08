<script>
  export let steps = [];
  export let currentStep = 2;
  export let onClick;
  $: percentage = (currentStep * 100) / (steps.length - 1);
</script>

<div
  class="flex space-between"
  style={`--percentage: ${percentage}%`}
  {...$$restProps}
>
  {#each steps as step, i}
    <div
      on:click={(e) => onClick(step, i)}
      class="step"
      class:active={i <= currentStep}
    >
      {step}
    </div>
  {/each}
</div>

<style>
  .flex {
    position: relative;
  }
  .flex::after,
  .flex::before {
    content: "";
    width: 100%;
    position: absolute;
    height: 2px;
    top: 50%;
    background-color: lightgray;
  }
  .flex::before {
    width: var(--percentage);
    background-color: deepskyblue;
    z-index: 1;
  }
  .step.active {
    --color: deepskyblue;
  }
  .step {
    width: 100px;
    aspect-ratio: 1;
    border-radius: 50%;
    border: 2px solid var(--color, lightgray);
    display: grid;
    color: var(--color, lightgray);
    place-content: center;
    background-color: white;
    z-index: 1;
    cursor: pointer;
  }
</style>
