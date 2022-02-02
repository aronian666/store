<script>
  import FieldsetSelect from "./FieldsetSelect.svelte";

  export let items = [];
  export let filter = [];
  export let filtered;
  const ranges = [
    { value: { min: 0, max: 50 }, name: "0 - 50" },
    { value: { min: 50, max: 100 }, name: "50 - 100" },
    { value: { min: 100, max: 200 }, name: "100 - 200" },
    { value: { min: 200, max: 300 }, name: "200 - 300" },
  ];
  let filterOptions = filter.map((fil) => {
    if (fil.range) fil.options = ranges;
    else
      fil.options = [...new Set(items.map((item) => item[fil.property]))].map(
        (i) => ({ name: i, value: i })
      );
    fil.value = null;
    return fil;
  });
  $: {
    filtered = items.filter((item) => {
      return filterOptions.reduce((a, filterOption) => {
        if (!filterOption.value) return a;
        let compare;
        if (typeof filterOption.value === "object") {
          compare =
            filterOption.value.max >= item[filterOption.property] &&
            filterOption.value.min <= item[filterOption.property];
        } else
          compare =
            filterOption.value === "" ||
            filterOption.value === item[filterOption.property];
        return a && compare;
      }, true);
    });
  }
</script>

<div class="flex gap">
  {#each filterOptions as filterOption}
    <FieldsetSelect
      let:item
      items={filterOption.options}
      bind:input={filterOption.value}
      placeholder={filterOption.name}
      title={filterOption.name}
      name={`filter[${filterOption.name}]`}
      blank={true}
    >
      <option slot="option" value={item.value}>{item.name}</option>
    </FieldsetSelect>
  {/each}
  <slot />
</div>
