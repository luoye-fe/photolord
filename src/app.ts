import 'tsconfig-paths/register';

import { IMidwayWebApplication } from '@midwayjs/web';
export default class Boot {
  app: IMidwayWebApplication;

  constructor(app: IMidwayWebApplication) {
    this.app = app;
  }

  didReady() {
    // find all library, send to agent
  }

  beforeClose() {
    // tell agent close all watch
  }
}
