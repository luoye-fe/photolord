import * as path from 'path';

export default null;

export function isSubDir(dir: string, parent: string) {
  const relative = path.relative(parent, dir);
  return relative && !relative.startsWith('..') && !path.isAbsolute(relative);
}
