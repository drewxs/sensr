import { Component, JSXElement, onMount } from 'solid-js';

import { Car, ControlType, Road, Visualizer } from 'types';

const LANE_COUNT: number = 8;
const LANE_WIDTH: number = 50;
const ROAD_WIDTH: number = LANE_COUNT * LANE_WIDTH;

const USER_COLOR: string = '#080808';
const USER_SHADOW_COLOR: string = '#181f25';
const NPC_COLOR: string = '#580000';

const ANIMATION_DURATION: number = 50;

const CAR_WIDTH: number = 30;
const CAR_HEIGHT: number = 50;
const CAR_Y_OFFSET: number = 100;

const NUM_CARS: number = 100;

const App: Component = (): JSXElement => {
  let carCanvas: HTMLCanvasElement;
  let networkCanvas: HTMLCanvasElement;

  let leadingCar: Car;

  const saveModel = (): void => {
    try {
      localStorage.setItem(
        'leadingNetwork',
        JSON.stringify(leadingCar.network)
      );
    } catch (err) {
      console.log(err);
    }
  };

  const discardModel = (): void => {
    try {
      localStorage.removeItem('leadingNetwork');
    } catch (err) {
      console.log(err);
    }
  };

  onMount(() => {
    const carCtx: CanvasRenderingContext2D = carCanvas.getContext('2d')!;
    const networkCtx: CanvasRenderingContext2D =
      networkCanvas.getContext('2d')!;

    const road = new Road(
      carCanvas.width / 2,
      carCanvas.width * 0.9,
      LANE_COUNT
    );
    const initialPosition: number = road.getLaneCenter(
      Math.floor(LANE_COUNT / 2)
    );

    const generateCars = (n: number): Car[] => {
      const cars: Car[] = [];
      for (let i: number = 0; i < n; i++) {
        cars.push(
          new Car(
            initialPosition,
            CAR_Y_OFFSET,
            CAR_WIDTH,
            CAR_HEIGHT,
            ControlType.AI
          )
        );
      }
      return cars;
    };

    const cars = generateCars(NUM_CARS);
    const traffic: Car[] = [
      new Car(
        road.getLaneCenter(Math.floor(Math.random() * LANE_COUNT + 1)),
        -CAR_Y_OFFSET,
        CAR_WIDTH,
        CAR_HEIGHT,
        ControlType.NPC,
        2
      ),
      new Car(
        road.getLaneCenter(Math.floor(Math.random() * LANE_COUNT + 1)),
        -CAR_Y_OFFSET * Math.random() * LANE_COUNT,
        CAR_WIDTH,
        CAR_HEIGHT,
        ControlType.NPC,
        2
      ),
      new Car(
        road.getLaneCenter(Math.floor(Math.random() * LANE_COUNT + 1)),
        -CAR_Y_OFFSET * Math.random() * LANE_COUNT,
        CAR_WIDTH,
        CAR_HEIGHT,
        ControlType.NPC,
        2
      ),
      new Car(
        road.getLaneCenter(Math.floor(Math.random() * LANE_COUNT + 1)),
        -CAR_Y_OFFSET * Math.random() * LANE_COUNT,
        CAR_WIDTH,
        CAR_HEIGHT,
        ControlType.NPC,
        2
      ),
    ];

    leadingCar = cars[0];

    // Load saved model if it exists
    let savedModel: string | null = localStorage.getItem('leadingNetwork');
    if (savedModel) {
      leadingCar.network = JSON.parse(savedModel);
    }

    const animate = (time: number = ANIMATION_DURATION): void => {
      traffic.forEach((x) => x.update(road.borders));
      cars.forEach((car) => car.update(road.borders, traffic));

      // Fitness function, farthest y value in this case
      leadingCar = cars.find((c) => c.y === Math.min(...cars.map((c) => c.y)))!;

      carCanvas.height = window.innerHeight;
      networkCanvas.height = window.innerHeight;

      carCtx.save();
      carCtx.translate(0, -leadingCar.y + carCanvas.height * 0.7);

      road.draw(carCtx);
      traffic.forEach((x) => x.draw(carCtx, NPC_COLOR));
      carCtx.globalAlpha = 0.4;
      cars.forEach((car) => car.draw(carCtx, USER_SHADOW_COLOR));
      carCtx.globalAlpha = 1;
      leadingCar.draw(carCtx, USER_COLOR, true);

      carCtx.restore();

      networkCtx.lineDashOffset = -time / 50;
      Visualizer.drawNetwork(networkCtx, leadingCar.network!);
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
      <div id='options'>
        <button onClick={saveModel}>💾</button>
        <button onClick={discardModel}>🗑️</button>
      </div>
    </>
  );
};

export default App;
