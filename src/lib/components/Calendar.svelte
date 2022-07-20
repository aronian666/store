<script>
  import Icon from "./Icon.svelte";

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
  const dayNames = ["D", "L", "M", "M", "J", "V", "S"];
  export let current = new Date();
  const today = new Date();
  $: firstDay = new Date(current.getFullYear(), current.getMonth(), 1);
  $: lastDay = new Date(current.getFullYear(), current.getMonth() + 1, 0);
  $: days = Array(lastDay.getDate())
    .fill(0)
    .map((value, index) => index + 1);
  const changeMonth = (number) => {
    current.setMonth(current.getMonth() + number);
    current = current;
  };
</script>

<div class="calendar">
  <div class="flex space-between">
    <h3>{monthNames[current.getMonth()]} {current.getFullYear()}</h3>
    <div class="flex" style="gap: .25rem">
      <button on:click={(e) => changeMonth(-1)}>
        <Icon icon="arrow_back_ios" size="10" />
      </button>
      <button on:click={(e) => changeMonth(1)}>
        <Icon icon="arrow_forward_ios" size="10" />
      </button>
    </div>
  </div>
  <section>
    <ul class="header">
      {#each dayNames as day}
        <li>{day}</li>
      {/each}
    </ul>
    <ul class="days" style={`--start:${firstDay.getDay() + 1}`}>
      {#each days as day}
        <li
          on:click={(e) => {
            current.setDate(day);
            current = current;
          }}
          class:today={day === today.getDate() &&
            current.getMonth() === today.getMonth()}
          class:current={day === current.getDate()}
        >
          {day}
        </li>
      {/each}
    </ul>
  </section>
</div>

<style>
  .calendar {
    font-size: 0.65rem;
  }
  ul {
    list-style: none;
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    padding: 0;
    gap: 2px;
    background-color: rgb(225, 225, 225);
  }
  .days li:first-child {
    grid-column-start: var(--start);
  }
  .days li {
    aspect-ratio: 1;
    display: grid;
    place-content: center;
    font-size: 0.5rem;
    cursor: pointer;
  }
  .header li {
    text-align: center;
    background-color: black;
    padding: 0.35rem;
    color: white;
  }
  ul li {
    background-color: white;
  }
  button {
    padding: 0.25rem;
  }
  .today {
    background: skyblue;
    font-weight: bold;
    color: white;
    border-radius: 50%;
  }
  .current {
    background-color: orange;
    color: white;
  }
</style>
