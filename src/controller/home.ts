import { Controller, Get, Provide, Inject } from '@midwayjs/decorator';

import HomeService from '@/service/home';

@Provide()
@Controller('/')
export class HomeController {

  @Inject()
  homeService: HomeService;

  @Get('/')
  async home() {
    return `Hello ${this.homeService.index()}!`;
  }
}
