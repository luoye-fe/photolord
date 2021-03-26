import { Provide } from '@midwayjs/decorator';

@Provide()
export default class HomeService {
  index() {
    return 'photolord';
  }
}
