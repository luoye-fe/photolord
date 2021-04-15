import * as path from 'path';
import * as fse from 'fs-extra';

import sharp from 'sharp';
import exifr from 'exifr';

import { md5Buffer } from '@/utils/index';

import { IMAGE_EXTENSIONS } from '@/const/token/image';
import { IPlainObject, IResourceInfo } from '@/typings';

function formatExif(exif: IPlainObject) {
  const result = {};

  for (const key in exif) {
    if (Object.prototype.hasOwnProperty.call(exif, key)) {
      const originVal = exif[key];
      const resultKey = key;

      // special exif format value: Uint8Array | number | Date | array
      if (ArrayBuffer.isView(originVal)) {
        const current = [];
        for (const byte of originVal as Uint8Array) {
          current.push(byte);
        }
        result[resultKey] = current.join(','); // TODO: parse it
      } else if (typeof originVal === 'number') {
        result[resultKey] = originVal.toString();
      } else if (Object.prototype.toString.call(originVal) === '[object Date]') {
        result[resultKey] = originVal.getTime().toString();
      } else if (Array.isArray(originVal)) {
        result[resultKey] = originVal.join(','); // TODO: parse it
      } else {
        result[resultKey] = originVal;
      }
    }
  }

  return result;
}

export function isImage(filePath: string) {
  return IMAGE_EXTENSIONS.find(i => i === path.extname(filePath).slice(1).toLowerCase());
}

export async function analyzeFile(filePath: string): Promise<IResourceInfo> {
  const fileIsExists = fse.existsSync(filePath);
  if (!fileIsExists) throw new Error('file is not exists');
  if (!isImage(filePath)) throw new Error('file is not image');

  const metaData = await sharp(filePath).metadata();

  const fileBufferData = fse.readFileSync(filePath);

  let exifInfo = null;
  try {
    exifInfo = await exifr.parse(fileBufferData);
  } catch (e) {
    global.agent.logger.info('get resource exif error, does not affect the main process.');
    global.agent.logger.error(e);
  }
  const md5 = md5Buffer(fileBufferData);
  const stat = fse.statSync(filePath);

  return {
    md5,
    name: path.basename(filePath),
    path: filePath,
    format: metaData.format.toUpperCase(),
    size: stat.size,
    width: metaData.width,
    height: metaData.height,
    createDate: stat.birthtime,
    modifyDate: stat.mtime,
    exif: formatExif(exifInfo),
  };
}
