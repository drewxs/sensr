import { Component, onMount } from 'solid-js';

import { Car, ControlType, Road } from 'types';

const LANE_COUNT = 8;
const LANE_WIDTH = 50;
const ROAD_WIDTH = LANE_COUNT * LANE_WIDTH;
const USER_COLOR = '#080808';
const NPC_COLOR = '#580000';

const App: Component = () => {
  let carCanvas: HTMLCanvasElement;
  let networkCanvas: HTMLCanvasElement;

  onMount(() => {
    const carCtx: CanvasRenderingContext2D = carCanvas.getContext('2d')!;
    const networkCtx: CanvasRenderingContext2D = carCanvas.getContext('2d')!;

    const road = new Road(
      carCanvas.width / 2,
      carCanvas.width * 0.9,
      LANE_COUNT
    );
    const initialPosition: number = road.getLaneCenter(
      Math.floor(LANE_COUNT / 2)
    );
    const car = new Car(initialPosition, 100, 30, 50, ControlType.AI);
    const traffic: Car[] = [
      new Car(initialPosition, 0, 30, 50, ControlType.NPC, 2),
    ];

    const animate = () => {
      traffic.forEach((x) => x.update(road.borders));
      car.update(road.borders, traffic);

      carCanvas.height = window.innerHeight;
      networkCanvas.height = window.innerHeight;

      carCtx.save();
      carCtx.translate(0, -car.y + carCanvas.height * 0.7);

      road.draw(carCtx);
      traffic.forEach((x) => x.draw(carCtx, NPC_COLOR));
      car.draw(carCtx, USER_COLOR);

      carCtx.restore();

      requestAnimationFrame(animate);
    };

    animate();
  });

  return (
    <>
      <canvas ref={carCanvas!} id='carCanvas' width={ROAD_WIDTH} />
      <canvas
        ref={networkCanvas!}
        id='networkCanvas'
        width={ROAD_WIDTH * 1.5}
      />
    </>
  );
};

export default App;
