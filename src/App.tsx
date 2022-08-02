import { Component, onMount } from 'solid-js';

import { Car } from './@types/car';

const App: Component = () => {
  let canvas: HTMLCanvasElement;

  onMount(() => {
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;
    const car = new Car(100, 100, 30, 50);

    const animate = () => {
      canvas.height = window.innerHeight;
      car.update();
      car.draw(ctx);
      requestAnimationFrame(animate);
    };

    animate();
  });

  return (
    <>
      <canvas ref={canvas!} width={200} />
    </>
  );
};

export default App;
