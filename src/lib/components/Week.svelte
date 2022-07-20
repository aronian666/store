<script>
  import Hour from "./Hour.svelte";

  export let current = new Date();
  export let contracts = [];
  const today = new Date();
  const days = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];
  const assignLastDay = (current) => {
    return Array(3)
      .fill(0)
      .map((a, b) => {
        const date = new Date(current.getTime());
        date.setDate(15);
        date.setMonth(current.getMonth() - b + 2);
        date.setDate(0);
        return date.getDate();
      })
      .reverse();
  };
  const assignDays = (current) => {
    return Array(7)
      .fill(0)
      .map((value, index) => {
        const day = current.getDate() + index - current.getDay();
        if (day < 1)
          return { day: latest[0] + day, month: current.getMonth() - 1 };
        if (day > latest[1])
          return { day: day - latest[1], month: current.getMonth() + 1 };
        return { day, month: current.getMonth() };
      });
  };
  $: latest = assignLastDay(current);
  $: numbers = assignDays(current);
  const hours = Array(14)
    .fill(0)
    .map((a, b) => b + 7);
  $: assignContract = (hour, day, month, year) => {
    return contracts.filter((contract) => {
      const serviceHour = contract.start.getHours();
      const hoursCompare = hour <= serviceHour && hour + 1 > serviceHour;
      if (
        hoursCompare &&
        day === contract.start.getDate() &&
        month === contract.start.getMonth() &&
        year === contract.start.getFullYear()
      )
        return contract;
    });
  };
</script>

<div class="week">
  <div class="header">
    {#each days as day, i}
      <div class="grid gap">
        <div class="day-name">
          {day}
        </div>
        <div
          class="day-number"
          class:today={numbers[i].day === today.getDate()}
        >
          {numbers && numbers[i].day}
        </div>
      </div>
    {/each}
  </div>
  <div class="body">
    {#each hours as hour}
      <div class="hours">{hour} {hour > 12 ? "PM" : "AM"}</div>
      {#each days as day, i}
        <Hour
          {hour}
          day={numbers[i].day}
          month={numbers[i].month}
          year={current.getFullYear()}
          contracts={assignContract(
            hour,
            numbers[i].day,
            numbers[i].month,
            current.getFullYear()
          )}
        />
      {/each}
    {/each}
  </div>
</div>

<style>
  .week {
    background-color: #efefef;
  }
  .header,
  .body {
    display: grid;
    gap: 2px;
    grid-template-columns: 50px repeat(7, 1fr);
  }
  .body {
    height: 70vh;
    overflow: auto;
  }
  .body::-webkit-scrollbar {
    display: none;
  }
  .header > div:first-child {
    grid-column-start: 2;
  }
  .header > div {
    text-align: center;
  }
  .day-name {
    font-size: 0.7rem;
  }
  .day-number {
    font-size: 1.5rem;
  }
  .hours {
    font-size: 0.7rem;
    position: relative;
    top: -0.5rem;
    text-align: center;
  }
  .today {
    background: skyblue;
    color: white;
    font-weight: bold;
  }
</style>
