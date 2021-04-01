import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/orm';
import { FindConditions, Repository } from 'typeorm';

import { LibraryModel } from '@/entity/library';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Provide()
export default class ApiLibraryService {

  @InjectEntityModel(LibraryModel)
  private libraryModel: Repository<LibraryModel>;

  public async query(options: FindConditions<LibraryModel>) {
    const result = await this.libraryModel.findOne({
      where: options,
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

  public async update(id: number, model: QueryDeepPartialEntity<LibraryModel>) {
    await this.libraryModel.update(id, model);
    return await this.libraryModel.findOne(id);
  }
}
