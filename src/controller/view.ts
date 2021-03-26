import { Controller, Get, Provide, App } from '@midwayjs/decorator';
import { Application, Context } from 'egg';
import * as fs from 'fs';
// import * as path from 'fs';

@Provide()
@Controller('/')
export class ViewController {

  @App()
  app: Application; 

  @Get('/test')
  async home(ctx: Context) {
    // const env = this.app.getEnv();

    // if (env === 'local') return 'local development please open http://localhost:3333';

    ctx.body = fs.createReadStream('../static/index.html');
  }
}
