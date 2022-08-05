import { Component, onMount } from 'solid-js';

import { Car, Road } from 'types';

const LANE_COUNT = 8;
const LANE_WIDTH = 50;
const ROAD_WIDTH = LANE_COUNT * LANE_WIDTH;
const USER_COLOR = '#080808';
const NPC_COLOR = '#580000';

const App: Component = () => {
  let canvas: HTMLCanvasElement;

  onMount(() => {
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!;
    const road = new Road(canvas.width / 2, canvas.width * 0.9, LANE_COUNT);
    const initialPosition: number = road.getLaneCenter(
      Math.floor(LANE_COUNT / 2)
    );
    const car = new Car(initialPosition, 100, 30, 50, 'USER');
    const traffic: Car[] = [new Car(initialPosition, 0, 30, 50, 'NPC', 2)];

    const animate = () => {
      traffic.forEach((x) => x.update(road.borders));
      car.update(road.borders, traffic);

      canvas.height = window.innerHeight;

      ctx.save();
      ctx.translate(0, -car.y + canvas.height * 0.7);

      road.draw(ctx);
      traffic.forEach((x) => x.draw(ctx, NPC_COLOR));
      car.draw(ctx, USER_COLOR);

      ctx.restore();
      requestAnimationFrame(animate);
    };

    animate();
  });

  return (
    <>
      <canvas ref={canvas!} width={ROAD_WIDTH} />
    </>
  );
};

export default App;
