import * as path from 'path';
import * as fse from 'fs-extra';
import sharp from 'sharp';
import exifReader from 'exif-reader';

import { IMAGE_EXTENSIONS } from '@/const/token/image';
import { IPlainObject, IResourceInfo } from '@/typings';

function isImage(filePath: string) {
  return IMAGE_EXTENSIONS.find(i => i === path.extname(filePath).slice(1).toLowerCase());
}

function formatExif(exif: IPlainObject) {
  const result = {};

  for (const key in exif) {
    if (Object.prototype.hasOwnProperty.call(exif, key)) {
      result[key.toLocaleLowerCase()] = exif[key];
    }
  }

  return result;
}

export async function analyzeFile(filePath: string): Promise<IResourceInfo> {
  const fileIsExists = fse.existsSync(filePath);
  if (!fileIsExists) throw new Error('file is not exists');
  if (!isImage(filePath)) throw new Error('file is not image');

  const image = sharp(filePath);
  const metadata = await image.metadata();

  const exif: IPlainObject = metadata.exif ? exifReader(metadata.exif) : {};

  return {
    exif: formatExif({
      ...exif.image || {},
      ...exif.exif || {},
      ...exif.gps || {},
    }),
  };
}
