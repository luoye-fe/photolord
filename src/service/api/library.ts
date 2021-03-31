import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';

import { LibraryModel } from '@/entity/library';

@Provide()
export default class ApiLibraryService {

  @InjectEntityModel(LibraryModel)
  private libraryModel: Repository<LibraryModel>;

  public async query(id: number) {
    const result = await this.libraryModel.findOne({
      where: {
        id,
      },
    });

    return result;
  }

  public async queryByPath(path: string) {
    const result = await this.libraryModel.findOne({
      where: {
        path,
      },
    });

    return result;
  }

  public async batchQuery(page = 1, size = 10) {
    const result = await this.libraryModel.find({
      where: {
        delete_flag: 0,
      },
      take: size,
      skip: (page - 1) * size,
      order: {
        gmt_create: 'DESC',
      },
    });

    return result;
  }

  public async create(model: LibraryModel) {
    return await this.libraryModel.save(model);
  }

  public async update(id: number, model: LibraryModel) {
    await this.libraryModel.update({
      id,
    }, model);
  }
}
