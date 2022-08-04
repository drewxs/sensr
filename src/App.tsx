import { Component, onMount } from 'solid-js';

import { Car, Road } from 'types';

const App: Component = () => {
  let canvas: HTMLCanvasElement;

  onMount(() => {
    const laneCount = 5;
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;
    const road = new Road(canvas.width / 2, canvas.width * 0.9);
    const car = new Car(
      road.getLaneCenter(Math.floor(laneCount / 2)),
      100,
      30,
      50
    );

    const animate = () => {
      car.update(road.borders);

      canvas.height = window.innerHeight;

      ctx.save();
      ctx.translate(0, -car.y + canvas.height * 0.7);

      road.draw(ctx);
      car.draw(ctx);

      ctx.restore();
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
