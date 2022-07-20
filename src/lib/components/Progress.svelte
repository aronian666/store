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
      style={`--color: ${step.color}`}
      class:active={i <= currentStep}
    >
      {step.name}
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
    background-color: black;
    z-index: 1;
  }
  .step.active {
    color: white;
    background-color: var(--color);
    font-weight: bold;
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
