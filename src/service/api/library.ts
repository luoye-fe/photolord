import { Provide, Inject } from '@midwayjs/decorator';
import { LibraryModel } from '@/app/model/library';

@Provide()
export default class ApiLibraryService {

  @Inject()
  private libraryModel: typeof LibraryModel;

  public async query(id: number) {
    const result = await this.libraryModel.findOne({
      where: {
        id,
      },
    });

    return result;
  }

  public async batchQuery(page = 1, size = 10) {
    const result = await this.libraryModel.findAll({
      where: {
        delete_flag: 0,
      },
      limit: size,
      offset: (page - 1) * size,
      order: [
        ['gmt_create', 'DESC'],
      ],
    });

    return result;
  }

  public async crate(model: LibraryModel) {
    await this.libraryModel.create(model);
  }

  public async update(id: number, model: LibraryModel) {
    await this.libraryModel.update(model, {
      where: {
        id,
      },
    });
  }
}
