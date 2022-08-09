import { Layer, NeuralNetwork } from 'types';
import { getRGBA, lerp } from 'utils';

const BLACK: string = '#080808';
const WHITE: string = '#f1f1f1';

export class Visualizer {
  static drawNetwork(
    ctx: CanvasRenderingContext2D,
    network: NeuralNetwork
  ): void {
    const margin: number = 50;
    const left: number = margin;
    const top: number = margin;
    const width: number = ctx.canvas.width - margin * 2;
    const height: number = ctx.canvas.height - margin * 2;
    const layerHeight: number = height / network.layers.length;

    for (let i: number = network.layers.length - 1; i >= 0; i--) {
      const layerTop =
        top +
        lerp(
          height - layerHeight,
          0,
          network.layers.length == 1 ? 0.5 : i / (network.layers.length - 1)
        );

      ctx.setLineDash([7, 3]);
      Visualizer.drawLayer(
        ctx,
        network.layers[i],
        left,
        layerTop,
        width,
        layerHeight,
        i == network.layers.length - 1 ? ['🠈', '🠊', '🠉', '🠋'] : []
      );
    }
  }

  static drawLayer(
    ctx: CanvasRenderingContext2D,
    layer: Layer,
    left: number,
    top: number,
    width: number,
    height: number,
    outputLabels: string[]
  ): void {
    const right: number = left + width;
    const bottom: number = top + height;

    const { inputs, outputs, weights, biases } = layer;

    for (let i: number = 0; i < inputs.length; i++) {
      for (let j: number = 0; j < outputs.length; j++) {
        ctx.beginPath();
        ctx.moveTo(Visualizer.getNodeX(inputs, i, left, right), bottom);
        ctx.lineTo(Visualizer.getNodeX(outputs, j, left, right), top);
        ctx.lineWidth = 2;
        ctx.strokeStyle = getRGBA(weights[i][j]);
        ctx.stroke();
      }
    }

    const nodeRadius: number = 18;
    for (let i: number = 0; i < inputs.length; i++) {
      const x: number = Visualizer.getNodeX(inputs, i, left, right);
      ctx.beginPath();
      ctx.arc(x, bottom, nodeRadius, 0, Math.PI * 2);
      ctx.fillStyle = BLACK;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, bottom, nodeRadius * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = getRGBA(inputs[i]);
      ctx.fill();
    }

    for (let i: number = 0; i < outputs.length; i++) {
      const x: number = Visualizer.getNodeX(outputs, i, left, right);
      ctx.beginPath();
      ctx.arc(x, top, nodeRadius, 0, Math.PI * 2);
      ctx.fillStyle = BLACK;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x, top, nodeRadius * 0.6, 0, Math.PI * 2);
      ctx.fillStyle = getRGBA(outputs[i]);
      ctx.fill();

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.arc(x, top, nodeRadius * 0.8, 0, Math.PI * 2);
      ctx.strokeStyle = getRGBA(biases[i]);
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);

      if (outputLabels[i]) {
        ctx.beginPath();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = BLACK;
        ctx.strokeStyle = WHITE;
        ctx.font = nodeRadius * 1.5 + 'px Arial';
        ctx.fillText(outputLabels[i], x, top + nodeRadius * 0.1);
        ctx.lineWidth = 0.5;
        ctx.strokeText(outputLabels[i], x, top + nodeRadius * 0.1);
      }
    }
  }

  static getNodeX(
    nodes: number[],
    index: number,
    left: number,
    right: number
  ): number {
    return lerp(
      left,
      right,
      nodes.length == 1 ? 0.5 : index / (nodes.length - 1)
    );
  }
}
