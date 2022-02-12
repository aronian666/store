<script>
  import { onMount } from "svelte";
  import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
  import { randomColor } from "$lib/scripts/randomColor";
  export let cut;
  export let glass;
  import {
    BoxBufferGeometry,
    Mesh,
    MeshBasicMaterial,
    PerspectiveCamera,
    Scene,
    Vector3,
    WebGLRenderer,
  } from "three";
  const aspect = glass.x / glass.y;
  const camera = new PerspectiveCamera(70, aspect, 0.1, 500);
  const scene = new Scene();
  camera.position.set(0, 0, glass.length() / 2.4);
  const createMesh = (section, color) => {
    const mesh = new Mesh(
      new BoxBufferGeometry(section.x - 1.5, section.y - 1.5, 1),
      new MeshBasicMaterial({ color })
    );
    mesh.position.set(
      section.init.x + section.x / 2,
      section.init.y + section.y / 2,
      0
    );
    mesh.position.add(new Vector3(-glass.x / 2, -glass.y / 2, 0));
    return mesh;
  };
  function draw(cut) {
    const sections = cut.sections.map((section) => {
      const color = randomColor();
      //const color = "orange";
      return createMesh(section, color);
    });
    const rest = cut.glasses.map((section) => createMesh(section, "#2196F3"));
    return [...sections, ...rest];
  }
  const meshes = draw(cut);
  scene.add(...meshes);
  onMount(() => {
    const parent = document.querySelector(".parent");
    const canvas = document.querySelector("canvas");
    const renderer = new WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(
      (window.innerWidth * 6) / 10,
      (window.innerWidth * 6) / 10 / aspect
    );
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    const controls = new OrbitControls(camera, canvas);
    const animate = (time) => {
      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate(0);
    return () => {
      renderer.dispose();
      meshes.forEach((mesh) => {
        mesh.material.dispose();
        mesh.geometry.dispose();
      });
    };
  });
</script>

<div class="parent grid">
  <canvas />
</div>

<style>
  .parent {
    background-color: #ffdee9;
    background-image: linear-gradient(0deg, #ffdee9 0%, #b5fffc 100%);
  }
</style>
