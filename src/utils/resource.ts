import * as path from 'path';
import * as fse from 'fs-extra';

import sharp from 'sharp';
import exifr from 'exifr';

import { md5Buffer } from '@/utils/index';
import DetectObject from '@/detect/object/index';

import { IMAGE_EXTENSIONS } from '@/const/token/image';
import { IObjectDetectResult, IPlainObject, IResourceAnalyseResult } from '@/typings';

function formatExif(exif: IPlainObject) {
  const result = {};
  if (!exif) return result;

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

export function isImage(resourcePath: string) {
  return IMAGE_EXTENSIONS.find(i => i === path.extname(resourcePath).slice(1).toLowerCase());
}

export async function analyseResource(resourcePath: string): Promise<IResourceAnalyseResult> {
  const resourceIsExists = fse.existsSync(resourcePath);
  if (!resourceIsExists) throw new Error('Resource is not exists');
  if (!isImage(resourcePath)) throw new Error('Resource is not image');

  // get meta data
  let metaData = null;
  try {
    metaData = await sharp(resourcePath).metadata();
  } catch (e) {
    global.agent.logger.info(`Sharp resource metadata error, does not affect the main process, ${resourcePath}`);
    global.agent.logger.error(e);
  }

  if (!metaData) return null;

  const resourceBufferData = fse.readFileSync(resourcePath);

  // get exif data
  let exifInfo = null;
  try {
    exifInfo = await exifr.parse(resourceBufferData);
  } catch (e) {
    global.agent.logger.info(`Get resource exif error, does not affect the main process, ${resourcePath}`);
    global.agent.logger.error(e);
  }

  // get object detect data
  let objectDetectResult: IObjectDetectResult[] = [];
  try {
    const objectDetectInstance = DetectObject.getInstance();
    objectDetectResult = await objectDetectInstance.detect(resourcePath);
  } catch (e) {
    global.agent.logger.info(`Get resource object detect result error, does not affect the main process, ${resourcePath}`);
    global.agent.logger.error(e);
  }

  // get face detect data

  const md5 = md5Buffer(resourceBufferData);
  const stat = fse.statSync(resourcePath);

  return {
    md5,
    name: path.basename(resourcePath),
    path: resourcePath,
    format: metaData.format.toUpperCase(),
    size: stat.size,
    width: metaData.width,
    height: metaData.height,
    createDate: stat.birthtime,
    modifyDate: stat.mtime,
    exif: formatExif(exifInfo),
    objectDetectResult,
  };
}
