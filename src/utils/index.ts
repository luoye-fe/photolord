import * as path from 'path';
import * as crypto from 'crypto';

export default null;

export function isSubDir(dir: string, parent: string) {
  const relative = path.relative(parent, dir);
  return relative && !relative.startsWith('..') && !path.isAbsolute(relative);
}

export function md5Buffer(buffer: Buffer): string {
  const BUFFER_SIZE = 8192;
  const hash = crypto.createHash('md5');

  let bytesRead = 0;
  while (bytesRead < buffer.length) {
    hash.update(buffer.slice(bytesRead, bytesRead + BUFFER_SIZE));
    bytesRead += BUFFER_SIZE;
  }

  return hash.digest('hex');
}
