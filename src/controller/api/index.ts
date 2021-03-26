import { Controller, Get, Provide } from '@midwayjs/decorator';

@Provide()
@Controller('/api')
export class ApiIndexController {

  @Get('/auth')
  async home() {
    return 'auth';
  }
}
