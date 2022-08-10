import { Component, createSignal, JSXElement, onMount } from 'solid-js';

import { Car, ControlType, NeuralNetwork, Road, Visualizer } from 'types';
import { random, randomInt } from 'utils';

const LANE_COUNT: number = 5;
const LANE_WIDTH: number = 60;
const ROAD_WIDTH: number = LANE_COUNT * LANE_WIDTH;

const CAR_WIDTH: number = 30;
const CAR_HEIGHT: number = 50;
const CAR_Y_OFFSET: number = 100;
const CAR_SPEED: number = 4;

const NUM_CARS: number = 100;
const NUM_NPCS: number = NUM_CARS / 4;

const ANIMATION_DURATION: number = 50;
const MESSAGE_DURATION: number = 500;

const App: Component = (): JSXElement => {
  const [saved, setSaved] = createSignal(false);
  const [discarded, setDiscarded] = createSignal(false);

  let carCanvas: HTMLCanvasElement;
  let networkCanvas: HTMLCanvasElement;

  let leadingCar: Car;

  const saveModel = (): void => {
    try {
      localStorage.setItem(
        'leadingNetwork',
        JSON.stringify(leadingCar.network)
      );
      setSaved(true);
      setTimeout(() => setSaved(false), MESSAGE_DURATION);
    } catch (err) {
      console.log(err);
    }
  };

  const discardModel = (): void => {
    try {
      localStorage.removeItem('leadingNetwork');
      setDiscarded(true);
      setTimeout(() => setDiscarded(false), MESSAGE_DURATION);
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
            ControlType.AI,
            CAR_SPEED
          )
        );
      }
      return cars;
    };

    const cars = generateCars(NUM_CARS);

    const traffic: Car[] = [];
    for (let i: number = 0; i < NUM_NPCS; i++) {
      traffic.push(
        new Car(
          road.getLaneCenter(randomInt(0, LANE_COUNT - 1)),
          random(-CAR_Y_OFFSET / 2, -CAR_Y_OFFSET * 100),
          CAR_WIDTH,
          CAR_HEIGHT,
          ControlType.NPC,
          random(2, 4)
        )
      );
    }

    leadingCar = cars[0];

    // Load saved model if it exists
    let savedModel: string | null = localStorage.getItem('leadingNetwork');
    if (savedModel) {
      for (let i: number = 0; i < cars.length; i++) {
        cars[i].network = JSON.parse(savedModel);
        if (i !== 0) {
          NeuralNetwork.mutate(cars[i].network!, 0.1);
        }
      }
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
      traffic.forEach((x) => x.draw(carCtx));
      carCtx.globalAlpha = 0.01;
      cars.forEach((car) => car.draw(carCtx));
      carCtx.globalAlpha = 1;
      leadingCar.draw(carCtx, true);

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
      <canvas ref={networkCanvas!} id='networkCanvas' width={LANE_WIDTH * 10} />
      <div id='options'>
        <button onClick={saveModel}>
          💾
          {saved() && (
            <div class='options-message' id='saved'>
              Saved!
            </div>
          )}
        </button>
        <button onClick={discardModel}>
          🗑️
          {discarded() && (
            <div class='options-message' id='discarded'>
              Discarded!
            </div>
          )}
        </button>
      </div>
    </>
  );
};

export default App;
