import 'tsconfig-paths/register';

import { IMidwayWebApplication } from '@midwayjs/web';
// import { Application } from 'egg';
import { LibraryModel } from '@/app/model/library';
import { ResourceModel } from '@/app/model/resource';
import { SettingModel } from '@/app/model/setting';

export default class Boot  {
  app: IMidwayWebApplication;

  constructor(app: IMidwayWebApplication) {
    this.app = app;
  }

  didLoad() {
    // IoC inject all model
    this.app.getApplicationContext().registerObject('libraryModel', LibraryModel);
    this.app.getApplicationContext().registerObject('resourceModel', ResourceModel);
    this.app.getApplicationContext().registerObject('settingModel', SettingModel);

    // (this.app as any).model.sync({
    //   force: true,
    // });
  }
}
