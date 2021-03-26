import { Application } from 'egg';
import {
  Sequelize,
  Model,
  Table,
  Column,
  Comment,
  DataType,
  PrimaryKey,
  AutoIncrement,
  Index,
} from 'sequelize-typescript';

@Table({
  tableName: 'library',
  modelName: 'LibraryModel',
  timestamps: false,
})
export class LibraryModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Comment('primary key')
  @Column(DataType.BIGINT)
  id: number;

  @Index({ name: 'uk_library_absolute_path', type: 'UNIQUE', unique: true })
  @Comment('library absolute path')
  @Column(DataType.STRING)
  path: string;

  @Comment('watch library all change')
  @Column(DataType.INTEGER)
  auto_analyse: number;

  @Comment('library analyse status')
  @Column(DataType.INTEGER)
  analyse_ing: number;

  @Comment('delete flag')
  @Column(DataType.INTEGER)
  delete_flag: number;

  @Comment('create time')
  @Column(DataType.DATE)
  gmt_create: Date;

  @Comment('modify time')
  @Column(DataType.DATE)
  gmt_modified: Date;
}

export default function main(_: Application, sequelize: Sequelize) {
  // register model
  sequelize.addModels([LibraryModel]);

  return LibraryModel;
}
