import * as fse from 'fs-extra';

export function analyzeFile(filePath: string) {
  const fileIsExists = fse.existsSync(filePath);

  console.log(fileIsExists);
}
