import { Component, createSignal, JSXElement, onMount } from 'solid-js';

import {
  ANIMATION_DURATION,
  CAR_HEIGHT,
  CAR_SPEED,
  CAR_WIDTH,
  CAR_Y_OFFSET,
  LANE_COUNT,
  LANE_WIDTH,
  MESSAGE_DURATION,
  MUTATION_AMOUNT,
  NUM_NETWORKS,
  ROAD_WIDTH,
  TRAINING_DATA,
} from 'config';
import { Car, ControlType, NeuralNetwork, Road, Visualizer } from 'types';
import { readCsv } from 'utils';

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
      console.log('saved model');
    } catch (err) {
      console.log(err);
    }
  };

  const discardModel = (): void => {
    try {
      localStorage.removeItem('leadingNetwork');
      setDiscarded(true);
      setTimeout(() => setDiscarded(false), MESSAGE_DURATION);
      console.log('discarded model');
    } catch (err) {
      console.log(err);
    }
  };

  // Load saved model if it exists
  const loadModel = (cars: Car[]): void => {
    let savedModel: string | null = localStorage.getItem('leadingNetwork');
    if (savedModel) {
      for (let i: number = 0; i < cars.length; i++) {
        cars[i].network = JSON.parse(savedModel);
        if (i !== 0) {
          NeuralNetwork.mutate(cars[i].network!, MUTATION_AMOUNT);
        }
      }
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

    // Generate n AI cars
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

    const cars = generateCars(NUM_NETWORKS);
    leadingCar = cars[0];
    loadModel(cars);

    // Generate traffic from training data
    const traffic: Car[] = [];
    readCsv(TRAINING_DATA).then((data) => {
      data?.forEach((npc) =>
        traffic.push(
          new Car(
            road.getLaneCenter(npc.x),
            npc.y,
            CAR_WIDTH,
            CAR_HEIGHT,
            ControlType.NPC,
            npc.speed
          )
        )
      );
    });

    // Mutate leading car on an interval
    setInterval(() => {
      NeuralNetwork.mutate(leadingCar.network!, MUTATION_AMOUNT / 10);
    }, 5000);

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
