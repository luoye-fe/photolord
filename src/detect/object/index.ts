import * as path from 'path';
import sharp from 'sharp';
import * as tf from '@tensorflow/tfjs-node-gpu';
import labelMap from './misc/en.json';

export default class ObjectDetect {
  model: tf.GraphModel | null = null;
  modelPath = tf.io.fileSystem(path.join(__filename, '../model/B7/model.json'));
  NUM_OF_CHANNELS = 3;
  imageSize = 600; // B7 model image size

  static instance: ObjectDetect = null;

  private async loadModel() {
    if (this.model) return this.model;

    this.model = await tf.loadGraphModel(this.modelPath);
    return this.model;
  }

  private async createTensor(image: sharp.Sharp): Promise<tf.Tensor3D> {
    const values = new Float32Array(
      this.imageSize * this.imageSize * this.NUM_OF_CHANNELS
    );

    const metadata = await image.metadata();
    const { width = 0, height = 0 } = metadata;
    const realSize = Math.min(width, height);

    const x = 0;
    const y = 0;
    const w = this.imageSize;
    const h = this.imageSize;

    const bufferData = await image
      .extract({
        left: width > height ? Math.floor((width - height) / 2) : 0,
        top: height > width ? Math.floor((height - width) / 2) : 0,
        width: realSize,
        height: realSize,
      })
      .resize(this.imageSize, this.imageSize)
      .removeAlpha() // keep 3 channels
      .raw()
      .toBuffer({ resolveWithObject: true });

    for (let _y = y; _y < y + h; _y++) {
      for (let _x = x; _x < x + w; _x++) {
        const offset = this.NUM_OF_CHANNELS * (w * _y + _x);
        values[offset + 0] = ((bufferData.data[offset + 0] - 1) / 127.0) >> 0;
        values[offset + 1] = ((bufferData.data[offset + 1] - 1) / 127.0) >> 0;
        values[offset + 2] = ((bufferData.data[offset + 2] - 1) / 127.0) >> 0;
      }
    }

    const outShape: [number, number, number] = [
      this.imageSize,
      this.imageSize,
      this.NUM_OF_CHANNELS,
    ];
    let imageTensor = tf.tensor3d(values, outShape, 'float32');
    imageTensor = imageTensor.expandDims(0);
    return imageTensor;
  }

  public async detect(filePath: string): Promise<{ label: string; precision: number }[]> {
    const result = [];

    const model = await this.loadModel();

    const image = sharp(filePath);
    const tensor = await this.createTensor(image);

    const objectArray = model.predict(tensor) as tf.Tensor;
    const values = objectArray.dataSync() as Float32Array;

    const arr = Array.from(values);
    const topValues = values
      .sort((a: number, b: number) => b - a)
      .slice(0, 5);
    const indexes = topValues.map((e: number) => arr.indexOf(e));
    const sum = topValues.reduce((a: number, b: number) => {
      return a + b;
    }, 0);
    indexes.forEach((value: number, index: number) => {
      result.push({
        label: labelMap[value],
        precision: (topValues[index] / sum) * 100,
      });
    });

    return result;
  }

  static getInstance() {
    if (this.instance) return this.instance;

    this.instance = new ObjectDetect();
    return this.instance;
  }
}
