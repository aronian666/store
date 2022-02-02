<script>
  export let text;
</script>

<div>
  <span>!</span>
  <p>
    {text}
  </p>
</div>

<style>
  div {
    position: relative;
  }
  p {
    position: absolute;
    background-color: rgba(0, 0, 0, 0.74);
    color: white;
    top: 1.5rem;
    width: 10rem;
    padding: 0.75rem;
    display: none;
    z-index: 1;
    place-content: center;
    font-size: 0.75rem;
    font-weight: 400;
    left: -5rem;
    border-radius: 0.5rem;
  }
  span {
    aspect-ratio: 1/1;
    width: 1.125rem;
    display: grid;
    place-content: center;
    border-radius: 50%;
    background-color: rgb(84, 105, 212);
    color: white;
    cursor: pointer;
  }
  span:hover + p {
    display: grid;
  }
</style>
