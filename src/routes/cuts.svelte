<script>
  import { Vector2 } from "three";
  import Draw from "$lib/components/Draw.svelte";
  const glass = new Vector2(300, 100);
  const vector = new Vector2(0, 0);
  vector.quantity = 1;
  let nivel = 1;
  let inputs = [vector];
  let cuts = [];
  let finalGlass;
  $: sections = inputs
    .map((s) => Array(s.quantity).fill(new Vector2(s.x, s.y)))
    .flat();
  glass.init = new Vector2(0, 0);
  function cut(glass, sections) {
    const section = sections[0];
    if (!section) return [];
    const forms = getForms(section, glass, sections.slice(1, sections.length));
    return forms;
  }
  function getForms(section, glass, sections) {
    const axles = ["x", "y"];
    const count = section.x === section.y ? 1 : 2;

    let posibilities = [];
    for (let index = 0; index < count; index++) {
      const form = new Vector2(
        section[axles[index]],
        section[axles[axles.length - index - 1]]
      );
      form.init = glass.init;
      const glasses = getGlasses(form, glass);
      if (glasses === false) continue;
      glasses.forEach((glass) => {
        posibilities.push({
          sections: [form],
          glasses: glass.filter((g) => g.x !== 0 && g.y !== 0),
        });
      });
    }
    if (sections.length === 0) return posibilities;

    return nextGlass(posibilities, sections);
  }

  function nextGlass(posibilities, sections) {
    let fusion = [];
    posibilities.forEach((posibility) => {
      posibility.glasses.forEach((glass, index) => {
        const cuts = cut(glass, [sections[0]]);
        const restGlasses = [...posibility.glasses];
        restGlasses.splice(index, 1);
        cuts.forEach((cut) => {
          fusion.push({
            sections: [...posibility.sections, ...cut.sections],
            glasses: [...restGlasses, ...cut.glasses],
          });
        });
      });
    });
    const min = Math.min(...fusion.map((p) => p.glasses.length));

    fusion = fusion.filter((p) => p.glasses.length <= min + nivel);
    let noDuplicate = reduceDuplicate(fusion);
    /* noDuplicate = noDuplicate.map((cut) => {
          const beforeGlasses = [...cut.glasses];
          cut.glasses = unionGlass(cut.glasses);
          return cut;
      }); */
    //noDuplicate = reduceDuplicate(noDuplicate);
    //const noDuplicate = fusion;

    if (sections[1])
      return nextGlass(noDuplicate, sections.slice(1, sections.length));
    return noDuplicate;
  }
  function getGlasses(section, glass) {
    const axles = ["x", "y"];
    const count = section.x === glass.x || section.y === glass.y ? 1 : 2;
    const ab = [];

    if (glass.x - section.x < 0 || glass.y - section.y < 0) return false;

    for (let index = 0; index < count; index++) {
      const axis = axles[index];
      const restGlass = new Vector2();
      if (axis === "x") {
        restGlass.set(-section.x, 0);
      } else {
        restGlass.set(0, -section.y);
      }
      const glass1 = glass.clone().add(restGlass);
      let glass2;
      if (axis === "x") {
        glass2 = glass.clone().add(new Vector2(-glass1.x, -section.y));
        glass1.init = new Vector2(
          glass.x - glass1.x + glass.init.x,
          glass.init.y
        );
        glass2.init = new Vector2(
          glass.init.x,
          glass.y - glass2.y + glass.init.y
        );
      } else {
        glass2 = glass.clone().add(new Vector2(-section.x, -glass1.y));
        glass1.init = new Vector2(
          glass.init.x,
          glass.y - glass1.y + glass.init.y
        );
        glass2.init = new Vector2(
          glass.x - glass2.x + glass.init.x,
          glass.init.y
        );
      }

      let glasses = [glass1, glass2].filter((g) => g.x >= 0 && g.y >= 0);
      ab.push(glasses);
    }
    return ab.filter((p) => p.length > 0);
  }
  function orderGlasses(glasses = []) {
    return glasses.sort((a, b) => b.length() - a.length());
  }
  function reduceDuplicate(rest) {
    rest.map((r) => {
      r.glasses = orderGlasses(r.glasses);
    });
    const noDuplicates = [];
    rest.forEach((r, index) => {
      if (index === 0) return noDuplicates.push(r);
      for (let noDuplicate of noDuplicates) {
        const equal = noDuplicate.glasses.reduce(
          (a, b, i) => a && equalGlasses(b, r.glasses[i]),
          true
        );
        if (equal) return;
      }
      noDuplicates.push(r);
    });

    return noDuplicates;
  }
  /* function unionGlass(glasses) {
      if (glasses.length <= 1) return glasses;
      let first;
      const finalGlasses = [];
      glasses.forEach((glass, index) => {
          if (index === 0) {
              first = glass.clone();
              first.init = glass.init.clone();
              return finalGlasses.push(glass);
          }
          const positionX = new Vector2(first.init.x + first.x, first.init.y);
          const positionY = new Vector2(first.init.x, first.init.y + first.y);
          if (first.x === glass.x && positionY.equals(glass.init))
              return first.set(first.x, first.y + glass.y);
          if (first.y === glass.y && positionX.equals(glass.init))
              return first.set(first.x + glass.x, first.y);
          finalGlasses.push(glass);
          first = glass.clone();
          first.init = glass.init.clone();
      });
      return finalGlasses;
  } */
  function equalGlasses(glass1, glass2) {
    return (
      (glass1.x === glass2.x && glass1.y === glass2.y) ||
      (glass1.x === glass2.y && glass1.y === glass2.x)
    );
  }
  function combine(array = []) {
    if (array.length < 2) return array;
    if (array.length == 2) {
      if (array[0] === array[1]) return [array];
      return [array, [...array].reverse()];
    }
    const algo = [];
    const answers = {};
    for (let i = 0; i < array.length; i++) {
      const copy = [...array];
      const first = copy.splice(i, 1);
      let combinations;
      if (answers[first[0]]) {
        continue;
        //combinations = answers[first[0]];
        //combinations.forEach(c => algo.push(first[0], ...c))
      }
      combinations = combine(copy);
      const already = [];
      combinations.forEach((combination) => {
        for (let a of already) {
          if (a.toString() === combination.toString()) return;
        }
        already.push(combination);
        algo.push([...first, ...combination]);
      });
      answers[first[0]] = already;
    }
    return algo;
  }
</script>

<section class="padding grid gap">
  <form>
    <fieldset>
      <label for="glass[x]">Ancho</label>
      <input type="number" bind:value={glass.x} />
    </fieldset>
    <fieldset>
      <label for="glass[y]">Alto</label>
      <input type="number" bind:value={glass.y} />
    </fieldset>
    <fieldset>
      <label for="nivel">Nivel de busqueda</label>
      <select bind:value={nivel}>
        {#each Array(3) as a, i}
          <option value={i}>{i + 1}</option>
        {/each}
      </select>
    </fieldset>
    <table>
      <thead>
        <tr>
          <td>Alto</td>
          <td>Ancho</td>
          <td>Cantidad</td>
          <td>
            <button
              type="button"
              on:click={(e) => {
                const vector = new Vector2();
                vector.quantity = 1;
                inputs.push(vector);
                inputs = inputs;
              }}>Añadir corte</button
            >
          </td>
        </tr>
      </thead>
      <tbody>
        {#each inputs as input, i}
          <tr>
            <td>
              <input type="number" step="0.01" bind:value={input.x} />
            </td>
            <td>
              <input type="number" step="0.01" bind:value={input.y} />
            </td>
            <td>
              <input type="number" bind:value={input.quantity} />
            </td>
            <td>
              <button
                style="background-color: red; color: white"
                type="button"
                on:click={(e) => {
                  inputs.splice(i, 1);
                  inputs = inputs;
                }}>eliminar</button
              >
            </td>
          </tr>
        {/each}
      </tbody>
    </table>

    <button
      on:click={(e) => {
        const cutsArray = cut(glass, orderGlasses(sections));
        const min = Math.min(...cutsArray.map((c) => c.glasses.length));
        cuts = cutsArray.filter((c) => c.glasses.length === min);
        finalGlass = glass;
      }}
      type="button"
    >
      Cortar
    </button>
  </form>
  {#if finalGlass}
    <Draw glass={finalGlass} {cuts} />
  {/if}
</section>

<style>
  form {
    display: grid;
  }
  fieldset {
    border: none;
    display: grid;
    grid-template-columns: 6rem 10rem;
  }
  label {
    font-weight: bold;
  }
</style>
