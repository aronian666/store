<script>
  export let input;
  export let onChange;
</script>

<label class="switch">
  <input
    type="checkbox"
    bind:checked={input}
    on:change={(e) => onChange(input)}
  />
  <span class="slider round" />
</label>

<style>
  .switch {
    position: relative;
    display: inline-block;
    width: 2rem;
    height: 1rem;
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: calc(1rem - 4px);
    width: calc(1rem - 4px);
    left: 2px;
    bottom: 2px;
    background-color: white;
    transition: 0.3s;
  }

  input:checked + .slider {
    background-color: orange;
  }

  input:focus + .slider {
    box-shadow: 0 0 1px orange;
  }

  input:checked + .slider:before {
    transform: translateX(1rem);
  }
  .slider.round {
    border-radius: 1rem;
  }

  .slider.round:before {
    border-radius: 50%;
  }
</style>
