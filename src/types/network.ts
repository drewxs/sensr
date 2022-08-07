import { sigmoid } from 'utils';

export class NeuralNetwork {
  layers: Layer[];

  constructor(neuronCounts: number[]) {
    this.layers = [];

    for (let i: number = 0; i < neuronCounts.length - 1; i++) {
      const layer: Layer = new Layer(neuronCounts[i], neuronCounts[i + 1]);
      this.layers.push(layer);
    }
  }

  /**
   * Feedforward the neural network.
   *
   * @param inputs - input nodes
   * @param network - the network to feedforward
   * @returns output nodes
   */
  static feedForward(inputs: number[], network: NeuralNetwork) {
    let outputs: number[] = Layer.feedForward(inputs, network.layers[0]);

    for (let i: number = 0; i < network.layers.length; i++) {
      outputs = Layer.feedForward(outputs, network.layers[i]);
    }

    return outputs;
  }
}

export class Layer {
  inputs: number[];
  outputs: number[];
  biases: number[];
  weights: number[][];

  constructor(inputCount: number, outputCount: number) {
    this.inputs = new Array<number>(inputCount);
    this.outputs = new Array<number>(outputCount);
    this.biases = new Array<number>(outputCount);

    this.weights = [];
    for (let i: number = 0; i < inputCount; i++) {
      this.weights[i] = new Array<number>(outputCount);
    }

    Layer.randomize(this);
  }

  /**
   * Randomize weights and biases for a layer.
   *
   * @param layer - layer to randomize
   */
  static randomize(layer: Layer): void {
    for (let i: number = 0; i < layer.inputs.length; i++) {
      for (let j: number = 0; j < layer.outputs.length; j++) {
        layer.weights[i][j] = Math.random() * 2 - 1;
      }
    }

    for (let i: number = 0; i < layer.biases.length; i++) {
      layer.biases[i] = Math.random() * 2 - 1;
    }
  }

  /**
   * Feedforward function.
   *
   * @param inputs - input nodes
   * @param layer - input layer
   * @returns output nodes
   */
  static feedForward(inputs: number[], layer: Layer): number[] {
    for (let i: number = 0; i < layer.inputs.length; i++) {
      layer.inputs[i] = inputs[i];
    }

    for (let i: number = 0; i < layer.outputs.length; i++) {
      let sum: number = 0;

      for (let j = 0; j < layer.inputs.length; j++) {
        sum += layer.inputs[j] * layer.weights[j][i];
      }

      layer.outputs[i] = sigmoid(sum + layer.biases[i]) > 0.5 ? 1 : 0;
    }

    return layer.outputs;
  }
}
