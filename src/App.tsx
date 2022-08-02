import { Component, onMount } from 'solid-js';

// import { Car } from './@types/car';

const App: Component = () => {
  let canvas: HTMLCanvasElement;

  onMount(() => {
    canvas.height = window.innerHeight;

    // const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
    // const car = new Car(100, 100, 30, 50);
  });

  return (
    <>
      <canvas ref={canvas!} width={200} />
    </>
  );
};

export default App;
